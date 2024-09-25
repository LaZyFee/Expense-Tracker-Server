import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./DB/connectDB.js";
import authRoutes from "./Routes/authRoutes.js";

const app = express();
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dotenv.config();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Hello World! from expense tracker backend");
});

app.use("/", authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Example app listening at http://localhost:${PORT}`);
});
