import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
    try {
        const body = await req.json();
        const apiKey = process.env.FREEPIK_API_KEY;

        if (!apiKey || apiKey === 'your_freepik_api_key_here') {
            return NextResponse.json({
                error: "Configuration Error",
                message: "Freepik API key is missing."
            }, { status: 500 });
        }

        await dbConnect();

        const token = req.cookies.get('token')?.value;
        let userId = null;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_development_purposes');
                userId = decoded.id;
            } catch (err) { }
        }

        if (!userId) {
            return NextResponse.json({
                error: "LIMIT_REACHED",
                limitReached: true,
                message: "Please login to use AI Forge."
            }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "LIMIT_REACHED", limitReached: true, message: "User not found." }, { status: 404 });
        }

        const now = new Date();
        const hasUnlimited = user.aiUnlimitedUntil && user.aiUnlimitedUntil > now;

        if (!hasUnlimited) {
            // Robust Daily Reset Logic
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

            if (user.lastAiGenerationDate) {
                const lastGenDate = new Date(user.lastAiGenerationDate);
                const lastGenStart = new Date(lastGenDate.getFullYear(), lastGenDate.getMonth(), lastGenDate.getDate()).getTime();

                if (lastGenStart < todayStart) {
                    user.aiGenerationCount = 0;
                }
            } else {
                // First time user
                user.aiGenerationCount = 0;
            }

            if (user.aiGenerationCount >= 5) {
                return NextResponse.json({
                    error: "LIMIT_REACHED",
                    limitReached: true,
                    message: "You have reached your 5 free AI generations for today."
                }, {
                    status: 403,
                    headers: { 'Cache-Control': 'no-store' }
                });
            }
        }

        // ============================================================
        //  INTELLIGENT PROMPT ENGINE v2
        //  Understands user intent from structured context.
        //  RULE #1: NEVER generate a 3D box. Only flat 2D graphics.
        //  RULE #2: Text/names are handled by the frontend overlay,
        //           so the AI should NOT draw text unless user asks
        //           for a typographic pattern.
        // ============================================================

        const {
            userIdea = "",         // Free-form user input like "black with gold accents"
            styles = [],           // ["Luxury Premium", "Minimal & Clean"]
            industries = [],       // ["Food & Bakery", "Corporate Gifting"]
            boxMode = "mailers",   // mailers | confectionary | pizza | luxury
            customText = "",       // Text user placed on box (e.g. "Shaswat")
            boxColors = {},        // { front: "#059669", ... }
            aspect_ratio = "square_1_1"
        } = body;

        // ----- STEP 0: Sanitize User Intent -----
        // Remove words that might confuse the AI into generating 3D objects
        const forbiddenWords = ["box", "package", "container", "crate", "3d", "mockup", "product", "mailer", "cardboard", "structure", "shape", "object", "rendering"];
        let sanitizedIdea = userIdea || "";
        forbiddenWords.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            sanitizedIdea = sanitizedIdea.replace(regex, "");
        });
        sanitizedIdea = sanitizedIdea.replace(/\s+/g, ' ').trim();

        // ----- STEP 1: Detect User Intent -----
        const intentFlags = {
            wantsColor: false,
            wantsPattern: false,
            wantsName: false,
            wantsMinimal: false,
            wantsBold: false,
        };

        const ideaLower = (userIdea || "").toLowerCase();

        // Detect if user is asking for specific colors
        const colorWords = ["black", "white", "red", "blue", "green", "gold", "silver", "pink", "orange", "yellow", "purple", "brown", "cream", "navy", "maroon", "teal", "coral"];
        const mentionedColors = colorWords.filter(c => ideaLower.includes(c));
        if (mentionedColors.length > 0) intentFlags.wantsColor = true;

        // Detect pattern/texture requests
        const patternWords = ["pattern", "texture", "floral", "geometric", "stripe", "dots", "abstract", "marble", "wood", "gradient", "wave", "leaf", "flower", "mandala", "tribal"];
        if (patternWords.some(w => ideaLower.includes(w))) intentFlags.wantsPattern = true;

        // Detect name/text requests
        const nameWords = ["name", "text", "write", "letter", "word", "brand", "logo", "typography"];
        if (nameWords.some(w => ideaLower.includes(w)) || customText) intentFlags.wantsName = true;

        // Detect minimal style
        if (ideaLower.includes("simple") || ideaLower.includes("clean") || ideaLower.includes("minimal") || styles.includes("Minimal & Clean")) {
            intentFlags.wantsMinimal = true;
        }

        // Detect bold/vibrant style
        if (ideaLower.includes("bold") || ideaLower.includes("vibrant") || ideaLower.includes("bright") || styles.includes("Bold & Playful")) {
            intentFlags.wantsBold = true;
        }

        // ----- STEP 2: Build Style Layer -----
        const styleDescriptors = {
            "Luxury Premium": "matte luxurious finish, subtle gold or silver metallic accents, dark rich tones, elegant ornamental borders, premium feel",
            "Eco & Sustainable": "organic earthy tones, natural kraft paper feel, hand-drawn botanical line art, eco-friendly warm beige and green palette",
            "Bold & Playful": "vibrant saturated colors, high contrast color blocks, energetic abstract shapes, fun and youthful graphic energy",
            "Minimal & Clean": "ultra-clean composition, generous whitespace, delicate thin lines, muted monochromatic palette, zen-like simplicity",
            "Festive & Celebratory": "sparkling festive ornaments, warm holiday palette of red gold green, celebratory confetti details, joyful decorative motifs",
            "Professional Corporate": "structured grid-based layout, corporate navy and silver palette, clean geometric shapes, trustworthy and authoritative tone",
            "Modern High-End": "futuristic sleek dark surfaces, subtle neon accent lines, premium carbon fiber or brushed metal texture, cutting-edge aesthetic",
            "Rustic Artisan": "hand-crafted feel, warm wood grain undertones, vintage stamp textures, artisan workshop aesthetic",
            "Vintage Classic": "retro typographic ornaments, aged parchment tones, classic serif decorations, nostalgic warmth",
            "Ultra Sleek": "razor-sharp minimalism, high-gloss obsidian black, precision geometric accents, futuristic luxury",
        };

        const industryDescriptors = {
            "Retail Shopping": "retail branding aesthetic, shopping bag feel, consumer-friendly",
            "Food & Bakery": "warm bakery and patisserie palette, appetizing tones, culinary charm",
            "Cosmetics & Beauty": "soft pastel beauty tones, elegant feminine curves, spa-like serenity",
            "Corporate Gifting": "executive presentation style, gift-worthy polished finish",
            "Apparel & Fashion": "runway-inspired fashion textile patterns, haute couture detailing",
            "Jewelry & Luxury": "precious gem-inspired rich deep tones, opulent velvet and silk feel",
            "E-Commerce Mailer": "modern shipping aesthetic, bold clean branding panels, unboxing excitement",
            "Subscription Box": "surprise and delight aesthetic, curated collection feel, playful reveal energy",
            "Artisan & Craft": "hand-made artisanal textures, small-batch workshop charm",
            "Health & Wellness": "calming zen palette, natural wellness greens and whites, clean organic feel",
        };

        let styleParts = styles.map(s => styleDescriptors[s]).filter(Boolean);
        let industryParts = industries.map(i => industryDescriptors[i]).filter(Boolean);

        // ----- STEP 3: Build Color Layer -----
        let colorInstruction = "";
        if (intentFlags.wantsColor && mentionedColors.length > 0) {
            colorInstruction = `Primary colors MUST be: ${mentionedColors.join(" and ")}. `;
        } else if (boxColors?.front && boxColors.front !== "#059669") {
            // Use the user's chosen box color as a hint
            colorInstruction = `Color palette should complement hex color ${boxColors.front}. `;
        }

        // ----- STEP 4: Build Name/Text Layer -----
        let textInstruction = "";
        if (intentFlags.wantsName && customText) {
            textInstruction = `Incorporate the text "${customText}" as an elegant typographic element within the graphic pattern. `;
        } else if (intentFlags.wantsName && !customText) {
            // User asked for "name on box" but text is handled in the frontend, so just add typographic patterns
            textInstruction = "Include subtle typographic decorative elements. ";
        }

        // ----- STEP 5: Assemble Final Prompt -----
        const coreParts = [];

        // Opening directive — this is the most important line
        coreParts.push("IMPORTANT: Generate ONLY a flat 2D graphic surface design. DO NOT draw any box, container, product, or 3D object whatsoever. The output should look like a digital wallpaper or print-ready artwork that fills the entire frame edge to edge.");

        // User's vision
        if (sanitizedIdea) {
            coreParts.push(`The user's design vision: "${sanitizedIdea}".`);
        }

        // Color
        if (colorInstruction) coreParts.push(colorInstruction);

        // Text
        if (textInstruction) coreParts.push(textInstruction);

        // Style
        if (styleParts.length > 0) {
            coreParts.push(`Design style: ${styleParts.join(". ")}.`);
        }

        // Industry
        if (industryParts.length > 0) {
            coreParts.push(`Design context: ${industryParts.join(". ")}.`);
        }

        // Minimal vs Bold adjustments
        if (intentFlags.wantsMinimal) {
            coreParts.push("Keep the design very clean and minimal. Use ample negative space. Less is more.");
        }
        if (intentFlags.wantsBold) {
            coreParts.push("Make the design bold, vibrant, and eye-catching with strong contrasts.");
        }

        // Technical quality directives (always included)
        coreParts.push("Technical specs: flat 2D only, seamless edge-to-edge surface pattern, high-resolution 8K clarity, crisp vector-like edges, no shadows, no lighting effects, no perspective distortion, no physical objects, pure graphic design.");

        const finalPrompt = coreParts.join(" ");

        console.log("🎨 AI Forge — User Idea (Raw):", userIdea || "(none)");
        console.log("🎨 AI Forge — User Idea (Sanitized):", sanitizedIdea || "(none)");
        console.log("🎨 AI Forge — Styles:", styles.join(", ") || "(none)");
        console.log("🎨 AI Forge — Industries:", industries.join(", ") || "(none)");
        console.log("🎨 AI Forge — Custom Text:", customText || "(none)");
        console.log("🎨 AI Forge — Final Prompt:", finalPrompt);

        // Call Freepik API
        const response = await fetch('https://api.freepik.com/v1/ai/text-to-image/flux-dev', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-freepik-api-key': apiKey
            },
            body: JSON.stringify({
                prompt: finalPrompt,
                aspect_ratio
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({
                error: "Freepik API Error",
                message: data.message || "Failed to initiate image generation",
                details: data
            }, { status: response.status });
        }

        if (!hasUnlimited) {
            user.aiGenerationCount = (user.aiGenerationCount || 0) + 1;
            user.lastAiGenerationDate = new Date();
            await user.save();
        }

        return NextResponse.json(
            { ...data, aiGenerationCount: user.aiGenerationCount },
            { headers: { 'Cache-Control': 'no-store' } }
        );
    } catch (error) {
        console.error("Image generation proxy error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message
        }, { status: 500 });
    }
}
