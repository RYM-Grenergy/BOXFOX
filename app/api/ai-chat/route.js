import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import SavedDesign from "@/models/SavedDesign";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await dbConnect();
    const { message, history, userId } = await req.json();

    // 1. Validate userId
    const isValidUserId = userId && mongoose.Types.ObjectId.isValid(userId);

    // 2. Fetch Context Data
    const products = await Product.find({}, { name: 1, price: 1, categories: 1, short_description: 1, minOrderQuantity: 1, _id: 1 }).lean();
    
    let userDetails = null;
    let userOrders = [];
    let savedDesigns = [];

    if (isValidUserId) {
      try {
        const [user, orders, designs] = await Promise.all([
          User.findById(userId).lean(),
          Order.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
          SavedDesign.find({ userId }).sort({ updatedAt: -1 }).limit(5).lean()
        ]);
        
        userDetails = user;
        userOrders = orders;
        savedDesigns = designs;
      } catch (dbErr) {
        console.warn("Foxie: User profile data fetch failed, continuing with guest info.", dbErr);
      }
    }

    // 3. Prepare Prompt
    const catalogContext = products.slice(0, 15).map(p => 
      `• ${p.name}: ₹${p.price} | Min Order: ${p.minOrderQuantity || 10} units | Desc: ${p.short_description || 'Custom Packaging'}`
    ).join('\n');

    const ordersContext = userOrders.length > 0 
      ? userOrders.map(o => `Logistics ID #${o.orderId}: Status is ${o.status}, Total ₹${o.total}`).join('\n')
      : "The user has no recorded order history.";

    const designsContext = savedDesigns.length > 0 
      ? savedDesigns.map(d => `• "${d.name}": Created on ${new Date(d.createdAt).toLocaleDateString()}.`).join('\n')
      : "The user has no saved designs yet.";

    const addressContext = userDetails?.shippingAddress 
      ? `${userDetails.shippingAddress.street}, ${userDetails.shippingAddress.city}, ${userDetails.shippingAddress.state} ${userDetails.shippingAddress.zipCode}`
      : "No shipping address on file.";

    const systemPrompt = `You are "Foxie" 🦊, the Elite Structural Packaging Concierge for BoxFox (Indo Omakase Pvt. Ltd.). 
Your mission is to provide "Perfect & Accurate" guidance to our high-value clients.

COMPANY KNOWLEDGE (INTERNAL):
- Brand: BoxFox (Part of Indo Omakase Pvt. Ltd. / IOPL).
- Legacy: Established in 2010, ISO 9001:2008 Certified.
- Expertise: Premium Duplex & Rigid Custom Packaging, 3D Real-time Design Labs.
- Products: LED Bulb, Mobile, Watch, Headphone, FMCG, and Luxury Rigid Boxes.
- Leadership: Founded by Jay Agarwal (RichieJay).
- Value Prop: Turning ideas into physical reality with state-of-the-art machinery and designer expertise.

SERVICE PROTOCOLS:
- Lead Times: 2 business days (inventory items), 7-10 working days (bespoke/printed orders).
- Shipping: Pan-India delivery within 2-10 working days.
- Free Shipping: Available on retail orders over ₹2,000 within India.
- Express Shipping: Available for an extra charge (Delhi NCR: 1 day, Others: 1-2 days).
- Returns: 14-day window. Refunds for totals < ₹2,000 are issued as discount vouchers, not cash.
- Operational Hours: Mon-Fri, 10 AM - 8 PM (No processing on Sat/Sun).

PERSONALITY & TONE:
- Sophisticated yet approachable. Use emojis like 🦊, ✨, 📦, 🎨 sparingly.
- Professional, efficient, and extremely accurate.
- Always address the user by name if available (${userDetails?.name || 'Guest'}).

INTERACTION RULES:
- ONLY discuss BoxFox products, orders, and packaging. Redirect other queries gracefully back to packaging.
- ALWAYS use clean formatting:
  - Newlines between paragraphs.
  - Bullet points (•) for all listings.
  - Bold key terms using **text**.
- If a user asks about their order, use the "Recent Orders History" provided below.
- If a user asks about designs, refer to their "Latest Saved Designs".
- If a user is a Guest, encourage them to log in to see their specific saved designs and order tracking.

USER CONTEXT:
- Name: ${userDetails?.name || 'Guest'}
- Shipping Address: ${addressContext}
- Recent Orders History:
${ordersContext}
- Latest Saved Designs:
${designsContext}

AVAILABLE CATALOG PREVIEW:
${catalogContext}
`;

    // 4. CALL OpenRouter
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey.includes('YOUR_KEY_HERE')) {
      return NextResponse.json({ reply: "My brain isn't fully configured. Please provide the OPENROUTER_API_KEY in the server environment!" });
    }

    // ENSURE HEADERS ARE CLEAN ASCII ONLY
    const headers = {
      "Authorization": `Bearer ${apiKey}`.trim(),
      "Content-Type": "application/json",
      "HTTP-Referer": (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").trim(),
      "X-Title": "BoxFox Store Assistant".trim()
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [
          { role: "system", content: systemPrompt },
          ...history.slice(-10),
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
        const errorDetail = await response.text();
        console.error("OpenRouter Response Error:", errorDetail);
        throw new Error(`OpenRouter Error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    
    return NextResponse.json({ reply: reply || "I understood your request but my brain returned an empty response. Try refreshing!" });

  } catch (error) {
    console.error("Foxie System Error:", error);
    // Be helpful but avoid leaking secrets
    return NextResponse.json({ 
      reply: `🤖 FOXIE_V2_ERROR: "${error.message}". Note: If you just added your API key, please restart the server in your terminal!` 
    }, { status: 500 });
  }
}
