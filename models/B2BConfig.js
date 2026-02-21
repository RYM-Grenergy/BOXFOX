import mongoose from 'mongoose';

const B2BConfigSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['boxTypes', 'printingOptions', 'finishOptions', 'sustainabilityOptions', 'timelines']
    },
    value: { type: String, required: true },
    label: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.B2BConfig || mongoose.model('B2BConfig', B2BConfigSchema);
