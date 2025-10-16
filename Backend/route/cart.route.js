import express from "express";
import Cart from "../models/cart.model.js";

const router = express.Router();

async function addItemToCart(req, res) {
  try {
    console.log("POST /cart payload:", req.body);
    const { userId, bookId, courseId, quantity = 1 } = req.body;

    if (!userId || (!bookId && !courseId)) {
      return res
        .status(400)
        .json({ success: false, error: "User ID and either Book ID or Course ID are required" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const key = bookId ? "bookId" : "courseId";
    const value = bookId || courseId;

    const existingIndex = cart.items.findIndex((item) => {
      const v = item[key];
      return v && v.toString() === value.toString();
    });

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({ [key]: value, quantity });
    }

    await cart.save();
    await cart.populate([
      { path: "items.bookId" },
      { path: "items.courseId" }
    ]);

    console.log("Saved cart:", cart);
    return res.json({ success: true, cart, items: cart.items });
  } catch (err) {
    console.error("Error adding to cart:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}

router.post("/", addItemToCart);
router.post("/add", addItemToCart); // compatibility if frontend still uses /add

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    console.log("GET /cart?userId=", userId);
    if (!userId) return res.status(400).json({ success: false, error: "User ID is required" });

    const cart = await Cart.findOne({ userId })
      .populate("items.bookId")
      .populate("items.courseId");

    if (!cart) return res.json({ success: true, items: [] });

    return res.json({ success: true, cart, items: cart.items });
  } catch (err) {
    console.error("Error fetching cart:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.delete("/:itemId", async (req, res) => {
  try {
    const { userId } = req.body;
    const { itemId } = req.params;
    if (!userId) return res.status(400).json({ success: false, error: "User ID is required" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.bookId?.toString() !== itemId && item.courseId?.toString() !== itemId
    );

    await cart.save();
    await cart.populate([
      { path: "items.bookId" },
      { path: "items.courseId" }
    ]);

    return res.json({ success: true, cart, items: cart.items });
  } catch (err) {
    console.error("Error removing from cart:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
