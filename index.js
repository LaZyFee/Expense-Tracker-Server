import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./DB/connectDB.js";

// Routes
import authRoutes from "./Routes/authRoutes.js";
import expenseRoutes from "./Routes/expenseRoutes.js";
import incomeRoutes from "./Routes/incomeRoute.js";
import savingRoutes from "./Routes/savingRoutes.js";


const app = express();
dotenv.config();

// List of allowed origins
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, origin);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Hello World! from expense tracker backend");
});

app.use("/", authRoutes);
app.use("/", expenseRoutes);
app.use("/", incomeRoutes);
app.use("/", savingRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Example app listening at http://localhost:${PORT}`);
});
