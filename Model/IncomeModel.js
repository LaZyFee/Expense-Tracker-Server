import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    source: {
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

export const IncomeModel = mongoose.model('Income', incomeSchema);