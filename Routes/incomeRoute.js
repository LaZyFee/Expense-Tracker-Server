import express from "express";
import { getIncomes, addIncome, updateIncome, deleteIncome } from "../Controller/incomeController.js";
import { verifyToken } from '../Middlewares/verifyToken.js';

const router = express.Router();


router.get("/", verifyToken, getIncomes);
router.post("/", verifyToken, addIncome);
router.put("/:id", verifyToken, updateIncome);
router.delete("/:id", verifyToken, deleteIncome);

export default router;
