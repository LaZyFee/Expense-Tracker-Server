import { ExpenseModel } from "../Model/ExpenseModel.js";

// Get all expenses
export const getExpenses = async (req, res) => {
    try {
        const expenses = await ExpenseModel.find({ userId: req.user._id });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expenses', error });
    }
};

// Add a new expense entry
export const addExpense = async (req, res) => {
    try {
        const expense = new ExpenseModel({ ...req.body, userId: req.user._id });
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: 'Error adding expense', error });
    }
};

// Update an existing expense entry
export const updateExpense = async (req, res) => {
    try {
        const expense = await ExpenseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(expense);
    } catch (error) {
        res.status(400).json({ message: 'Error updating expense', error });
    }
};

// Delete an expense entry
export const deleteExpense = async (req, res) => {
    try {
        await ExpenseModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting expense', error });
    }
};
