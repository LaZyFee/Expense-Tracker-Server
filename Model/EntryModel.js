import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    note: { type: String, default: '' },
    date: { type: Date, required: true },
    type: { type: String, enum: ['expense', 'income', 'savings'], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const EntryModel = mongoose.model('Entry', entrySchema);
