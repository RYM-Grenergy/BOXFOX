const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');

// MongoDB Connection URI
const MONGODB_URI = "mongodb+srv://boxfox:boxfox@cluster0.gvfw0mp.mongodb.net/";

// Product Schema for the script
const ProductSchema = new mongoose.Schema({
    wpId: { type: Number, unique: true },
    type: String,
    sku: String,
    name: String,
    slug: String,
    price: String,
    regular_price: String,
    sale_price: String,
    short_description: String,
    description: String,
    images: [String],
    categories: [String],
    tags: [String],
    stock_status: String,
    stock_quantity: Number,
    parent_id: Number,
    isFeatured: Boolean,
    lastSynced: { type: Date, default: Date.now }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const csvFilePath = path.join(__dirname, '../public/wc-product-export-20-2-2026-1771587225809.csv');

async function importCSV() {
    try {
        console.log('🚀 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const products = [];

        console.log('📡 Reading CSV file...');

        fs.createReadStream(csvFilePath)
            .pipe(csv({
                mapHeaders: ({ header }) => {
                    // Remove BOM and trim
                    return header.replace(/^\ufeff/, '').trim();
                }
            }))
            .on('data', (row) => {
                // Find the ID column (handling case sensitivity or surrounding quotes)
                const rawId = row['ID'];
                const wpId = parseInt(rawId);

                if (isNaN(wpId)) {
                    // Log for debugging if ID is missing or invalid
                    return;
                }

                const product = {
                    wpId: wpId,
                    type: row['Type'] || 'simple',
                    sku: row['SKU'],
                    name: row['Name'],
                    isFeatured: row['Is featured?'] === '1',
                    short_description: row['Short description'] || '',
                    description: row['Description'] || '',
                    regular_price: row['Regular price'],
                    sale_price: row['Sale price'],
                    price: row['Sale price'] || row['Regular price'],
                    weight: parseFloat(row['Weight (kg)']) || 0,
                    dimensions: {
                        length: parseFloat(row['Length (cm)']) || 0,
                        width: parseFloat(row['Width (cm)']) || 0,
                        height: parseFloat(row['Height (cm)']) || 0,
                        unit: 'cm'
                    },
                    categories: row['Categories'] ? row['Categories'].split('>').map(c => c.trim()) : [],
                    tags: row['Tags'] ? row['Tags'].split(',').map(t => t.trim()) : [],
                    images: row['Images'] ? row['Images'].split(',').map(i => i.trim()) : [],
                    stock_status: row['In stock?'] === '1' ? 'instock' : 'outofstock',
                    stock_quantity: parseInt(row['Stock']) || 0,
                    parent_id: parseInt(row['Parent']) || 0,
                    meta: {
                        features_desc: row['Meta: product_features_desc'] || '',
                        lumise_customize: row['Meta: lumise_customize'] || '',
                        specifications: row['Description'] ? row['Description'].split('\n').find(l => l.includes('Specifications')) : ''
                    }
                };

                // Extract attributes if any
                const attrs = [];
                for (let i = 1; i <= 5; i++) {
                    const attrName = row[`Attribute ${i} name`];
                    const attrValue = row[`Attribute ${i} value(s)`];
                    if (attrName && attrValue) {
                        attrs.push({
                            name: attrName,
                            options: attrValue.split(',').map(v => v.trim())
                        });
                    }
                }
                product.attributes = attrs;

                products.push(product);
            })
            .on('end', async () => {
                console.log(`📦 Parsed ${products.length} items. Starting import...`);

                let count = 0;
                for (const p of products) {
                    try {
                        p.images = [...new Set(p.images)];
                        p.categories = [...new Set(p.categories)];

                        await Product.findOneAndUpdate(
                            { wpId: p.wpId },
                            p,
                            { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
                        );
                        count++;
                        if (count % 20 === 0) console.log(`👉 Imported ${count} products...`);
                    } catch (err) {
                        console.error(`❌ Error importing product "${p.name}" (ID: ${p.wpId}):`, err.message);
                    }
                }

                console.log(`✨ Successfully imported ${count} products!`);
                await mongoose.disconnect();
                console.log('🔌 Disconnected from MongoDB');
                process.exit(0);
            })
            .on('error', (err) => {
                console.error('❌ CSV Stream Error:', err);
                process.exit(1);
            });

    } catch (error) {
        console.error('❌ Import failed:', error);
        process.exit(1);
    }
}

importCSV();
