import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true },
    customer: {
        name: String,
        email: String,
        phone: String,
        address: String
    },
    items: [
        {
            productId: Number, // wpId
            name: String,
            quantity: Number,
            price: String
        }
    ],
    total: Number,
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paid: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
