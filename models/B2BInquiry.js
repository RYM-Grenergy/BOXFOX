import mongoose from 'mongoose';

const B2BInquirySchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    boxType: { type: String, required: true },
    quantity: { type: Number, required: true },
    timeline: { type: String, required: true },
    printing: { type: String, required: true },
    finish: { type: String, required: true },
    sustainability: { type: String, required: true },
    requirements: { type: String },
    status: { type: String, default: 'pending', enum: ['pending', 'reviewed', 'completed'] }
}, { timestamps: true });

export default mongoose.models.B2BInquiry || mongoose.model('B2BInquiry', B2BInquirySchema);
