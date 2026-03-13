import mongoose from 'mongoose';
import dns from 'dns';

// Force use of Google's public DNS to fix MongoDB SRV resolution on restricted networks
dns.setServers(['1.1.1.1', '8.8.8.8', '8.8.4.4']);
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

const MONGODB_URI = "mongodb+srv://boxfox:boxfox@cluster0.7oansfw.mongodb.net/";

const productSchema = new mongoose.Schema({
    wpId: { type: Number, required: true, unique: true },
    type: { type: String, default: 'simple' }, // simple, variable, variation
    sku: String,
    name: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    short_description: String,
    description: String,
    regular_price: String,
    sale_price: String,
    price: String,
    minPrice: String,
    maxPrice: String,
    categories: [String],
    tags: [String],
    images: [String],
    stock_status: String,
    stock_quantity: Number,
    parent_id: { type: Number, default: 0 },
    brand: { type: String, default: 'BoxFox' },
    minOrderQuantity: { type: Number, default: 10 },
    badge: String,
    weight: Number,
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: { type: String, default: 'inch' }
    },
    attributes: [{
        name: String,
        options: [String]
    }],
    specifications: [{
        key: String,
        value: String
    }],
    pacdoraId: String,
    lastSynced: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const burgerBoxes = [
    {
        name: "Classic Single Kraft Burger Box",
        categories: ["Burger Box"],
        minPrice: "8.50",
        maxPrice: "12.00",
        price: "8.50",
        dimensions: { length: 4.5, width: 4.5, height: 3.5, unit: 'inch' },
        description: "Made from premium 300 GSM food-grade kraft paper. This box is eco-friendly, biodegradable, and features a grease-resistant lining. The sturdy interlocking design ensures your burger stays secure and hot during transit. Perfect for a standard gourmet burger.",
        short_description: "Eco-friendly, grease-resistant kraft box for standard burgers.",
        brand: "BoxFox",
        minOrderQuantity: 100,
        tags: ["Burger", "Kraft", "Eco-friendly"],
        specifications: [
            { key: "Material", value: "300 GSM Food-Grade Kraft Paper" },
            { key: "Finish", value: "Natural Matte" },
            { key: "Feature", value: "Grease-Resistant Lining" }
        ],
        images: ["https://boxfox.in/wp-content/uploads/2022/11/Mailer_Box_Mockup_1-copy-scaled.jpg"], // Placeholder image for now
        stock_status: "instock"
    },
    {
        name: "Premium White High-Gloss Burger Box",
        categories: ["Burger Box"],
        minPrice: "10.00",
        maxPrice: "15.00",
        price: "10.00",
        dimensions: { length: 4.7, width: 4.7, height: 3.7, unit: 'inch' },
        description: "An elegant, high-impact packaging solution featuring a brilliant white gloss finish. This box is designed for premium fast-food brands that want to showcase cleanliness and luxury. Includes side vents to prevent steam buildup and maintain bun texture.",
        short_description: "Luxury white gloss finish with steam vents for premium burgers.",
        brand: "BoxFox",
        minOrderQuantity: 100,
        tags: ["Burger", "Premium", "Glossy"],
        specifications: [
            { key: "Material", value: "Premium Duplex Board" },
            { key: "Finish", value: "High-Gloss UV Coating" },
            { key: "Vents", value: "Side Aeration Vents included" }
        ],
        images: ["https://boxfox.in/wp-content/uploads/2022/11/Mailer_Box_Mockup_1-copy-scaled.jpg"],
        stock_status: "instock"
    },
    {
        name: "Signature Double Stack Burger Box",
        categories: ["Burger Box"],
        minPrice: "12.50",
        maxPrice: "18.00",
        price: "12.50",
        dimensions: { length: 5.5, width: 5.5, height: 4.5, unit: 'inch' },
        description: "Engineered specifically for heavy-duty, multi-layered gourmet burgers. This extra-tall box provides ample vertical space to accommodate double paddies, melting cheese, and stacked toppings without any compression. Reinforced structural walls prevent collapse.",
        short_description: "Extra-tall reinforced box for double-stack gourmet burgers.",
        brand: "BoxFox",
        minOrderQuantity: 50,
        tags: ["Burger", "Double Stack", "Heavy-Duty"],
        specifications: [
            { key: "Material", value: "Heavy-Duty Corrugated Board" },
            { key: "Internal Height", value: "4.5 Inches" },
            { key: "Structure", value: "Reinforced Sidewalls" }
        ],
        images: ["https://boxfox.in/wp-content/uploads/2022/11/Mailer_Box_Mockup_1-copy-scaled.jpg"],
        stock_status: "instock"
    },
    {
        name: "Artisanal Printed Burger Box",
        categories: ["Burger Box"],
        minPrice: "11.00",
        maxPrice: "16.00",
        price: "11.00",
        dimensions: { length: 4.5, width: 4.5, height: 3.5, unit: 'inch' },
        description: "Bring a rustic, artisanal feel to your brand with our custom-printed kraft boxes. Features beautiful soy-based ink patterns that communicate freshness and sustainability. The breathable design keeps the bun crisp while the secure lock prevents leakage.",
        short_description: "Rustic printed design with eco-friendly soy ink.",
        brand: "BoxFox",
        minOrderQuantity: 100,
        tags: ["Burger", "Artisanal", "Printed"],
        specifications: [
            { key: "Material", value: "Recycled Kraft Paper" },
            { key: "Ink", value: "Eco-Friendly Soy-Based" },
            { key: "Design", value: "Custom Patterned Prints" }
        ],
        images: ["https://boxfox.in/wp-content/uploads/2022/11/Mailer_Box_Mockup_1-copy-scaled.jpg"],
        stock_status: "instock"
    },
    {
        name: "Trio Mini-Burger Slider Box",
        categories: ["Burger Box"],
        minPrice: "15.00",
        maxPrice: "22.00",
        price: "15.00",
        dimensions: { length: 10.5, width: 3.5, height: 3.5, unit: 'inch' },
        description: "A specialized elongated box designed to hold three individual mini sliders side-by-side. Includes internal dividers to keep each slider perfectly positioned. Ideal for tasting menus, platter options, and high-end catering packages.",
        short_description: "Elongated platter box with dividers for 3 mini sliders.",
        brand: "BoxFox",
        minOrderQuantity: 50,
        tags: ["Slider", "Tasting Menu", "Dividers"],
        specifications: [
            { key: "Material", value: "Food-Safe Cardboard" },
            { key: "Capacity", value: "3 Sliders" },
            { key: "Dividers", value: "Built-in internal separators" }
        ],
        images: ["https://boxfox.in/wp-content/uploads/2022/11/Mailer_Box_Mockup_1-copy-scaled.jpg"],
        stock_status: "instock"
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        for (const box of burgerBoxes) {
            const wpId = Date.now() + Math.floor(Math.random() * 1000); // Random unique numeric ID
            await Product.create({
                ...box,
                wpId
            });
            console.log(`Created product: ${box.name}`);
        }

        console.log("Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
