import { IncomeModel } from "../Model/IncomeModel.js";

// Get all income entries
export const getIncomes = async (req, res) => {
    try {
        const incomes = await IncomeModel.find({ userId: req.user._id });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching incomes', error });
    }
};

// Add a new income entry
export const addIncome = async (req, res) => {
    try {
        const income = new IncomeModel({ ...req.body, userId: req.user._id });
        await income.save();
        res.status(201).json(income);
    } catch (error) {
        res.status(400).json({ message: 'Error adding income', error });
    }
};

// Update an existing income entry
export const updateIncome = async (req, res) => {
    try {
        const income = await IncomeModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(income);
    } catch (error) {
        res.status(400).json({ message: 'Error updating income', error });
    }
};

// Delete an income entry
export const deleteIncome = async (req, res) => {
    try {
        await IncomeModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Income deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting income', error });
    }
};
