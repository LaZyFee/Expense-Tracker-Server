import jwt from "jsonwebtoken";
import { UserModel } from "../Model/UserModel.js";

export const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token;
    // console.log(token);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        req.user = await UserModel.findById(decoded.userId).select('-password');
        // console.log(req.user);
        if (!req.user) {
            return res.status(401).json({ error: 'User not found' });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token is not valid' });
    }
}
