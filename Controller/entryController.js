import { EntryModel } from '../Model/EntryModel.js';
import mongoose from 'mongoose';

// Get all entries
export const getEntries = async (req, res) => {
    try {
        console.log("User ID:", req.params.id); // Log from req.params
        const entries = await EntryModel.find({ userId: req.params.id }); // Filter by userId
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Add a new entry
export const addEntry = async (req, res) => {
    const newEntry = new EntryModel(req.body);

    try {
        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an entry
export const updateEntry = async (req, res) => {
    try {
        const updatedEntry = await EntryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.status(200).json(updatedEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an entry
export const deleteEntry = async (req, res) => {
    try {
        const deletedEntry = await EntryModel.findByIdAndDelete(req.params.id);
        if (!deletedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.status(204).send(); // No content response
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get expense summary
export const getExpenseSummary = async (req, res) => {
    try {
        console.log("User ID:", req.user.id);

        // Convert user ID to ObjectId
        const userId = new mongoose.Types.ObjectId(req.user.id);

        // Step 1: Get summary totals
        const summary = await EntryModel.aggregate([
            {
                $match: { userId: userId }  // Ensure correct type for ObjectId
            },
            {
                $group: {
                    _id: '$type',  // Group by type (expense, income, savings)
                    totalAmount: { $sum: '$amount' }  // Sum the amounts for each type
                }
            }
        ]);

        console.log("Grouped Summary:", summary);

        // Step 2: Get detailed entries for each type
        const details = await EntryModel.find({ userId: userId }).lean();

        // Organize detailed data by type
        const detailedData = {
            income: details.filter(entry => entry.type === 'income'),
            expense: details.filter(entry => entry.type === 'expense'),
            savings: details.filter(entry => entry.type === 'savings')
        };

        // Combine summary and detailed data into one response
        res.status(200).json({
            summary: summary,
            details: detailedData
        });
    } catch (error) {
        console.error("Error fetching summary:", error.message);
        res.status(500).json({ message: error.message });
    }
};
