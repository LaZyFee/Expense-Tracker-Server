import { SavingsModel } from "../Model/SavingsModel.js";
// Get all savings entries
export const getSavings = async (req, res) => {
    try {
        const savings = await SavingsModel.find({ userId: req.user._id });
        res.status(200).json(savings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching savings', error });
    }
};

// Add a new savings entry
export const addSavings = async (req, res) => {
    try {
        const savings = new SavingsModel({ ...req.body, userId: req.user._id });
        await savings.save();
        res.status(201).json(savings);
    } catch (error) {
        res.status(400).json({ message: 'Error adding savings', error });
    }
};

// Update an existing savings entry
export const updateSavings = async (req, res) => {
    try {
        const savings = await SavingsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(savings);
    } catch (error) {
        res.status(400).json({ message: 'Error updating savings', error });
    }
};

// Delete a savings entry
export const deleteSavings = async (req, res) => {
    try {
        await SavingsModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Savings deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting savings', error });
    }
};