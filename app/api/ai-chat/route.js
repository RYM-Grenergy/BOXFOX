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
    const products = await Product.find({}, { name: 1, price: 1, categories: 1, _id: 1 }).lean();
    
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
    const catalogContext = products.map(p => 
      `- ${p.name}: ₹${p.price} (Category: ${p.categories?.[0] || 'General'})`
    ).join('\n');

    const ordersContext = userOrders.length > 0 
      ? userOrders.map(o => `Logistics ID #${o.orderId}: Status is ${o.status}, Total ₹${o.total}`).join('\n')
      : "The user has no recorded order history.";

    const designsContext = savedDesigns.length > 0 
      ? savedDesigns.map(d => `- "${d.name}": Created on ${new Date(d.createdAt).toLocaleDateString()}.`).join('\n')
      : "The user has no saved designs yet.";

    const addressContext = userDetails?.shippingAddress 
      ? `${userDetails.shippingAddress.street}, ${userDetails.shippingAddress.city}, ${userDetails.shippingAddress.state} ${userDetails.shippingAddress.zipCode}`
      : "No shipping address on file.";

    const systemPrompt = `You are "Foxie" 🦊, the premium personal AI Assistant for BoxFox. 
Your role is to guide the user (${userDetails?.name || 'Guest'}) through our structural packaging catalog and their account details.

STRICT RULES:
- ONLY answer BoxFox-related queries.
- ALWAYS use newlines to separate paragraphs!
- ALWAYS use bullet points (•) for lists!

USER ACCOUNT INFORMATION:
Here is the current account data for ${userDetails?.name || 'the guest'}:
- Shipping Address: ${addressContext}
- Recent Orders History:
${ordersContext}
- Latest Saved Designs:
${designsContext}

CATALOG:
${catalogContext.slice(0, 500)}...
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
