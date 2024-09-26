import express from "express";
import { login, logout, signup, forgetPassword, resetPassword, checkAuth, updateProfile } from "../Controller/authController.js";
import { verifyToken } from "../Middlewares/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth)
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
// router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgetPassword)
router.post("/reset-password/:token", resetPassword)

router.put("/update-profile", verifyToken, updateProfile)

export default router;