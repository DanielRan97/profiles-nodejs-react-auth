const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const cors = require("cors");
const http = require("http");
const chalk = require("chalk");
const app = express();
const PORT = 4000;

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
const initializeSocket = require("./socketIo/socketIo");
initializeSocket(server);

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json()); // ✅ Use ONLY express.json() for parsing JSON

// Database connection
const MONGO_URI = "mongodb://localhost:27017/profiles";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log(chalk.black.bold.bgGreen("Connected to MongoDB"));
});

// Routes
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

// ✅ Start server correctly
server.listen(PORT, () => {
  console.log(chalk.black.bold.bgWhite(`Server running on http://localhost:${PORT}`));
});
