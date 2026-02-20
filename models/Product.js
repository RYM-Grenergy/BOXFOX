import mongoose from 'mongoose';

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
    categories: [String],
    tags: [String],
    images: [String],
    stock_status: String,
    stock_quantity: Number,
    parent_id: { type: Number, default: 0 },

    // New Enhanced Fields
    weight: Number,
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: { type: String, default: 'cm' }
    },
    attributes: [{
        name: String,
        options: [String]
    }],
    meta: {
        features_desc: String,
        lumise_customize: String,
        specifications: String
    },

    lastSynced: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
