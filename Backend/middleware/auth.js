import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id }; // ✅ user id available for enrollments
    next();
  } catch (err) {
    console.error("❌ Auth error:", err);
    return res.status(401).json({ success: false, message: "Session expired. Please login again." });
  }
};
