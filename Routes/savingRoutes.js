import express from "express";
import { getSavings, addSavings, updateSavings, deleteSavings } from "../Controller/savingController.js";
import { verifyToken } from '../Middlewares/verifyToken.js';

const router = express.Router();

// Route declarations
router.get("/", verifyToken, getSavings); // Get all savings
router.post("/", verifyToken, addSavings); // Add a new savings entry
router.put("/:id", verifyToken, updateSavings); // Update an existing savings entry
router.delete("/:id", verifyToken, deleteSavings); // Delete a savings entry

export default router;
