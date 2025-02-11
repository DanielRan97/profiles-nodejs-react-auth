const express = require("express");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_dev_secret";
require("dotenv").config();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Upload directory to be inside `server/profileImgs`**
const uploadDir = path.join(
  __dirname,
  "..",
  "..",
  "/profiles/assets/images/profileImgs"
);

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve images statically
router.use("/profiles/assets/images/profileImgs", express.static(uploadDir));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Register a new user
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    const { fullName, email, nickName, password } = req.body;
    const profileImage = req.file
      ? `/profiles/assets/images/profileImgs/${req.file.filename}`
      : null;
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: `${email} already in use. Try to Login` });
    }

    const existingUser = await User.findOne({ nickName });
    if (existingUser) {
      return res.status(400).json({ message: `${nickName} already in use` });
    }

    const user = new User({
      fullName,
      email,
      nickName,
      password,
      profileImage,
    });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      profileImageUrl: profileImage
        ? `http://localhost:4000${profileImage}`
        : null,
      user,
    });
  } catch (error) {
    res.status(500).json({ error });
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
    res.status(500).json({ error });
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
    return res.status(500).json({ error: error.message });
  }
});

//Edit User
router.put(
  "/user/:id",
  verifyToken,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { fullName, email, nickName, password } = req.body;
      const profileImage = req.file
        ? `/profiles/assets/images/profileImgs/${req.file.filename}`
        : undefined;

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          fullName,
          email,
          nickName,
          password,
          ...(profileImage && { profileImage }),
        },
        { new: true }
      );

      if (!updatedUser)
        return res.status(404).json({ message: "User not found" });
      res
        .status(200)
        .json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

//Get user by id
router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User Found", user });
  } catch (error) {
    res.status(500).json({ error });
  }
});

//Get All connected User
router.post("/get-connected-users", verifyToken, async (req, res) => {
  try {
    const { connectedUsers } = req.body;

    if (!Array.isArray(connectedUsers) || connectedUsers.length === 0) {
      return res
        .status(200)
        .json({ message: "No connected users provided", connectedUsers: [] });
    }

    const users = await User.find(
      { _id: { $in: connectedUsers } },
      "userName fullName profileImage nickName"
    );

    if (!users || users.length === 0) {
      return res
        .status(200)
        .json({ message: "Users not found", connectedUsers: [] });
    }

    res.status(200).json({ message: "Users found", connectedUsers: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete User
router.delete("/user/:id", verifyToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
