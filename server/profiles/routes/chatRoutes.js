const express = require("express");
const Message = require("../models/message");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

// Save message (Protected Route)
router.post("/send", verifyToken, async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !message) {
      return res
        .status(400)
        .json({ error: "Receiver ID and message are required" });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      read: false,
    });
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

//Mark messages as "read"
router.put("/readAllMessages/:senderId/:receiverId", verifyToken, async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    console.log(receiverId, receiverId);

    // Update all messages where senderId matches
    const updatedMessages = await Message.updateMany(
      { senderId: senderId ,receiverId: receiverId },
      { $set: { read: true } },
      { new: true }
    );

    if (updatedMessages.matchedCount === 0) {
      return res
        .status(200)
        .json({ message: "No messages found for this sender" });
    }

    res
      .status(200)
      .json({ message: "Messages updated successfully", updatedMessages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
