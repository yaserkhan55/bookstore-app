// backend/index.js
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import razorpayInstance from "./config/razorpay.js";

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

/* -------------------------------------------------------
   ✅ Connect Database
------------------------------------------------------- */
connectDB()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  });

/* -------------------------------------------------------
   ✅ CORS Setup (Vercel + Local)
------------------------------------------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://bookstore-app-frontend-v1.vercel.app",
  "https://bookstore-app-xhjc-git-main-yaser-ahmed-khans-projects.vercel.app",
  "https://bookstore-app-xhjc.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.status(200).end();

  next();
});

/* -------------------------------------------------------
   ✅ Middleware
------------------------------------------------------- */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Attach Razorpay instance
app.use((req, res, next) => {
  req.razorpay = razorpayInstance;
  next();
});

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

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

// Debug route for Vercel runtime inspection
app.get("/api/debug", (req, res) => {
  res.json({
    node_env: process.env.NODE_ENV,
    mongoURI: process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing",
    razorpayKey: process.env.RAZORPAY_KEY_ID ? "✅ Loaded" : "❌ Missing",
    razorpaySecret: process.env.RAZORPAY_KEY_SECRET ? "✅ Loaded" : "❌ Missing",
    time: new Date().toISOString()
  });
});


/* -------------------------------------------------------
   ✅ Serve Frontend in Production
------------------------------------------------------- */
if (process.env.NODE_ENV === "production") {
  const clientPath = path.resolve(__dirname, "../Frontend/dist");
  app.use(express.static(clientPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("🟢 API running in Development mode");
  });
}

/* -------------------------------------------------------
   ✅ Export for Vercel (Serverless)
------------------------------------------------------- */
export default app;

/* -------------------------------------------------------
   ✅ Local Development (Manual Server Start)
------------------------------------------------------- */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}
