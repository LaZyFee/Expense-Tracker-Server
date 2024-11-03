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
router.get("/entries/:id", getEntries);

// Route for adding an entry
router.post("/add-entry", addEntry);

// Route for updating an entry
router.put("/entries/:id", updateEntry);

// Route for deleting an entry
router.delete("/entries/:id", deleteEntry);

// Route for getting expense summary
router.get("/summary", getExpenseSummary);

export default router;
