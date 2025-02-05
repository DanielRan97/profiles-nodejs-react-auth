const express = require("express");
const Message = require("../models/message");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

// Save message (Protected Route)
router.post("/send", verifyToken, async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id; // ✅ Get senderId from `req.user`, NOT `req.body`

    if (!receiverId || !message) {
      return res
        .status(400)
        .json({ error: "Receiver ID and message are required" });
    }
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Could not send message" });
  }
});

// Get chat history (Protected Route)
router.get("/chatHistory/:user2", verifyToken, async (req, res) => {
  try {
    const user1 = req.user.id;
    const { user2 } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch messages" });
  }
});

module.exports = router;
