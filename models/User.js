import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['user', 'admin', 'staff_fulfillment'], default: 'user' },
    phone: { type: String },
    businessName: { type: String },
    address: String,
    shippingAddress: {
        street: String,
        apartment: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: 'India' }
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    lastLogin: { type: Date, default: Date.now },
    aiGenerationCount: { type: Number, default: 0 },
    lastAiGenerationDate: { type: Date },
    aiUnlimitedUntil: { type: Date },
    aiPatterns: [{
        url: String,
        prompt: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true,
    strict: false
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
