// Backend/index.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
// import razorpayInstance from "./config/razorpay.js"; // Not used directly here, but ensures config load

// Routes
import userRoutes from "./route/users.route.js";
import authRoutes from "./route/auth.route.js";
import bookRoutes from "./route/book.route.js";
import courseRoutes from "./route/course.route.js";
import enrollmentRoutes from "./route/enrollment.route.js";
import paymentRoutes from "./route/paymentRoutes.js";
import dashboardRoutes from "./route/dashboardRoutes.js";
import paidBookRoutes from "./route/paidBook.route.js";
import purchaseRoutes from "./route/purchase.route.js";
import bookPurchaseRoutes from "./route/bookPurchase.route.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standardize Port
const PORT = process.env.PORT || 10000;

/* -------------------------------------------------------
   ✅ Connect Database
------------------------------------------------------- */
// Connect to DB immediately
connectDB();

/* -------------------------------------------------------
   ✅ CORS Setup
------------------------------------------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://bookstore-app-frontend-v1.vercel.app",
  "https://bookstore-app-frontend-v1-git-main-yaser-ahmed-khans-projects.vercel.app",
  "https://bookstore-app-xhjc.vercel.app",
  "https://bookstore-app-rfir.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    // Optional: Allow all during debugging if needed, or stick to strict whitelist
    // res.header("Access-Control-Allow-Origin", "*");
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

// Middleware for parsing JSON
app.use(express.json());

/* -------------------------------------------------------
   ✅ API Routes
------------------------------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/paidBooks", paidBookRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/book-purchase", bookPurchaseRoutes);

/* -------------------------------------------------------
   ✅ Health & Debug Routes (Render Requirement)
------------------------------------------------------- */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

/* -------------------------------------------------------
   ✅ Start Server (Unconditional)
------------------------------------------------------- */
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Log Env Var Status (Safety Check)
    const requiredVars = ["MONGO_URI", "RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"];
    requiredVars.forEach(key => {
        if (!process.env[key]) {
            console.warn(`⚠️  WARNING: Missing environment variable: ${key}`);
        } else {
             console.log(`✅ ${key} loaded`);
        }
    });
});
