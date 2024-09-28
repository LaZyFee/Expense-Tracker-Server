import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    category: {
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

export const ExpenseModel = mongoose.model('Expense', expenseSchema);