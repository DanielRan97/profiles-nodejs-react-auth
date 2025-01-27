const express = require("express");
const User = require("../modles/users");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_dev_secret";

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, nickName, password } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const existingUser = await User.findOne({ nickName });
    if (existingUser) {
      return res.status(400).json({ message: "NickName already in use" });
    }

    const user = new User({ fullName, email, nickName, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    
    res.status(500).json({ message: "Server error", error });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { nickName, password } = req.body;

    const user = await User.findOne({ nickName });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    
    res.status(500).json({ message: "Server error", error });
  }
});

// Protected route
router.post("/protected", verifyToken, async (req, res) => {
  try {
    // Access the authenticated user's data from req.user set by the verifyToken middleware
    const userId = req.body.user && req.body.user.id;
    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Protected route accessed", user });
  } catch (error) {
    console.error("Error accessing protected route:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
