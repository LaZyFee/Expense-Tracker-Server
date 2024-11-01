// External imports
import bcrypt from "bcrypt";
import crypto from "crypto";

// Internal imports
import { UserModel } from "../Model/UserModel.js";
import { generateTokenAndSetCookie } from "../Utils/generateTokenAndSetCookies.js";
// Import email utility functions
// import { sendPasswordResetEmail, sendResetSuccessEmail } from "../Utils/email.js";

export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        // Check all fields are provided
        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(1000 + Math.random() * 900000).toString();
        const user = new UserModel({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });
        await user.save();

        // Generate JWT token
        const token = generateTokenAndSetCookie(res, user._id);
        res.status(201).json({
            token,
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = generateTokenAndSetCookie(res, user._id);
        user.lastlogin = Date.now();
        await user.save();

        res.status(200).json({
            token,
            success: true,
            message: "Login successful",
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successfully" });
};

export const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        // Uncomment and implement the email function if you have it
        // await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/reset-password/${resetToken}`);

        res.status(200).json({ message: "Reset token sent to your email" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        // Uncomment and implement the email function if you have it
        // await sendResetSuccessEmail(user.email);

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const checkAuth = async (req, res) => {
    try {
        console.log("Authenticated user:", req.user); // Add logging for debugging
        const user = await UserModel.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    try {
        const { name, currentPassword, newPassword } = req.body;
        let updateFields = {}; // Initialize an empty object for updates

        // Fetch the user from the database
        const user = await UserModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the current password matches if newPassword is provided
        if (newPassword) {
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: 'Incorrect current password.' });
            }

            // Hash the new password and add it to the update fields
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateFields.password = hashedPassword; // Update password
        }

        // Update name only if it's provided and different from the current
        if (name && name !== user.name) {
            updateFields.name = name; // Update name
        }

        // Update the user details in the database
        const updateUser = await UserModel.updateOne(
            { _id: req.user._id }, // Query by user ID
            { $set: updateFields } // Use $set to update only the provided fields
        );

        if (updateUser.modifiedCount > 0) {
            const updatedUser = await UserModel.findById(req.user._id).select('-password');
            return res.status(200).json({
                message: 'Profile updated successfully.',
                user: updatedUser, // Send back the updated user data
            });
        } else {
            return res.status(400).json({
                message: 'No changes were made.',
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
