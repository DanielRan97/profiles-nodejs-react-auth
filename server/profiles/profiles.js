const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");


const app = express();
const PORT = 4000;

// Middleware
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Database connection
const MONGO_URI = "mongodb://localhost:27017/profiles";
mongoose.connect(MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

// Routes
app.use("/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
