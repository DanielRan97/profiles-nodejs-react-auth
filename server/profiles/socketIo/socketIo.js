const chalk = require("chalk");
const socketIo = require("socket.io");
const onlineUsers = new Map();

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*", // Adjust this for security
    },
  });

  io.on("connection", (socket) => {
    console.log(chalk.bold.bgBlue.black("A user connected:", socket.id));

    // Save user when they join
    socket.on("user-join", (userId) => {
      console.log(chalk.bold.bgBlue.black(`User joined with ID: ${userId}`));

      onlineUsers.set(userId, socket.id);

      // Broadcast updated user list to all connected clients
      io.emit("online-users", Array.from(onlineUsers.keys()));

      console.log("Current online users:", Array.from(onlineUsers.keys())); // Debugging
  });

    // Handle private messages
    socket.on("private-message", ({ senderId, receiverId, message }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("new-message", { senderId, message });
      }
    });

    // users onLine list
    socket.on("get-online-users", () => {
      const onlineUserList = Array.from(onlineUsers.keys());
      socket.emit("online-users", onlineUserList);
    });

    // Remove user on disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });
  });

  return io;
};
