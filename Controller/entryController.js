import { EntryModel } from '../Model/EntryModel.js';

// Get all entries
export const getEntries = async (req, res) => {
    try {
        const entries = await EntryModel.find({ userId: req.user.id }); // Filter by user ID
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
        res.status(200).json(updatedEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an entry
export const deleteEntry = async (req, res) => {
    try {
        await EntryModel.findByIdAndDelete(req.params.id);
        res.status(204).send(); // No content response
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
