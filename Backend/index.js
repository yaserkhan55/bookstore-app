// backend/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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

import { authMiddleware } from "./middleware/auth.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connect Database
connectDB()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  });

// ✅ Enhanced CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://bookstore-app-frontend-v1.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      console.warn("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Attach Razorpay instance
app.use((req, res, next) => {
  req.razorpay = razorpayInstance;
  next();
});

// ✅ API Routes
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

// ✅ Health check (for debugging)
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

// ✅ Serve frontend (only in production)
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../Frontend/dist");
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res) =>
    res.sendFile(path.join(clientBuildPath, "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("🟢 API running (Development mode)"));
}

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
