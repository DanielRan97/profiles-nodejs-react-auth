const chalk = require("chalk");
const socketIo = require("socket.io");
const onlineUsers = new Map();

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*", // Adjust this for security
    },
  });

  io.on("connection", async (socket) => {

    socket.on("user-join", (userId) => {
      console.log(chalk.bgBlue.white(`${userId} connected`));
      onlineUsers.set(userId, socket.id);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });

    socket.on("private-message", ({ senderId, receiverId, message }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        try {
          io.to(receiverSocketId).emit("new-message", {
            senderId,
            receiverId,
            message,
            time: new Date().toString(),
          });
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    });

    socket.on("get-online-users", () => {
      const onlineUserList = Array.from(onlineUsers.keys());
      socket.emit("online-users", onlineUserList);
    });

    socket.on("disconnect", () => {
      for (const [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          console.log(chalk.bgRed.white(`${userId} disconnected`));
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });
  });

  return io;
};
