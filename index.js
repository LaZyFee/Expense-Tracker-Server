import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./DB/connectDB.js";

// Routes
import authRoutes from "./Routes/authRoutes.js";
import entryRoutes from "./Routes/entryRoutes.js";

const app = express();
app.use(express.json());
dotenv.config();

// CORS configuration
app.use(cors({
    origin: ["http://localhost:3000", "https://expensetrackerwebappx.netlify.app"],
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

app.use("/", entryRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});
console.log("Server cold start at", new Date().toISOString());
app.use((req, res, next) => {
    console.time(`${req.method} ${req.url}`);
    res.on('finish', () => {
        console.timeEnd(`${req.method} ${req.url}`);
    });
    next();
});

export default app;