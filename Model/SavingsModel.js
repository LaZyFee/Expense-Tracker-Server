import mongoose from "mongoose";

const savingsSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    purpose: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    note: {
        type: String,
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

export const SavingsModel = mongoose.model('Savings', savingsSchema)