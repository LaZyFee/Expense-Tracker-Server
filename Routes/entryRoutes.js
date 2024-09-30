import express from "express";
import {
    getEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    getExpenseSummary
} from "../Controller/entryController.js"; // A new controller that handles all entry types
import { verifyToken } from '../Middlewares/verifyToken.js';

const router = express.Router();

// Route for getting all entries
router.get("/entries", verifyToken, getEntries);

// Route for adding an entry
router.post("/add-entry", verifyToken, addEntry);

// Route for updating an entry
router.put("/entries/:id", verifyToken, updateEntry);

// Route for deleting an entry
router.delete("/entries/:id", verifyToken, deleteEntry);

// Route for getting expense summary
router.get("/summary", verifyToken, getExpenseSummary);

export default router;
