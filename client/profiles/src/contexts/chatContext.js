import { createContext, useState, useCallback } from "react";
import {
  getMessagesHistory,
  sendMessage,
  markMessagesAsRead,
} from "../axios/chatAxios";
import { socket } from "../socket/socket";
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [unreadCounts, setUnreadCounts] = useState({});
  const [messagesList, setMessagesList] = useState([]);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [empytChatAlert, setEmpytChatAlert] = useState("");
  const [selectUser, setSelectUser] = useState({});

  const fetchUnreadCounts = async (usersList, receiverId) => {
    const counts = {};
    for (const user of usersList) {
      const messages = await getMessagesHistory(user._id);
      counts[user._id] = Object.values(messages.data).reduce(
        (count, message) =>
          !message.read && message.senderId !== receiverId ? count + 1 : count,
        0
      );
    }
    setUnreadCounts(counts);
  };

  const listenAndgetNewMessage = useCallback((userData, selectUser) => {
    setMessageError("");
    // Remove any existing listeners to prevent duplicates
    socket.off("new-message");
    socket.on("new-message", async (newMsg) => {
      if (
        userData &&
        selectUser?._id &&
        newMsg.senderId === selectUser._id &&
        userData._id === newMsg.receiverId
      ) {
        setMessagesList((prev) => [...prev, newMsg]);
      }
    });
    return () => {
      // Cleanup when component unmounts or dependencies change
      socket.off("new-message");
    };
  }, []);

  const sendMessageHandler = async (userData) => {
    if (!message.trim()) {
      setMessageError("Message cannot be empty!");
      return;
    }

    setMessageError("");
    setMessage("");
    try {
      const res = await sendMessage(userData._id, selectUser._id, message);
      setMessagesList((prev) => [...prev, res]);
      setEmpytChatAlert("");
    } catch (error) {
      console.log(error);
      setMessageError(error.message);
    }
  };

  const messageHandler = (message) => {
    setMessage(message);
  };

  const selectUserHandler = async (user, userData) => {
    setEmpytChatAlert("");
    setMessageError("");
    if (selectUser === user) {
      setSelectUser({});
      setMessagesList([]);
      setEmpytChatAlert("");
    } else {
      setSelectUser(user);
      try {
        const res = await getMessagesHistory(user._id);
        await markMessagesAsRead(user._id, userData._id);
        setMessagesList(res.data);
      } catch (error) {
        console.log(error);
        setMessageError(error.message);
      }
    }
  };

  return (
    <ChatContext.Provider
      value={{
        unreadCounts,
        fetchUnreadCounts,
        messagesList,
        message,
        messageError,
        empytChatAlert,
        listenAndgetNewMessage,
        selectUser,
        sendMessageHandler,
        messageHandler,
        selectUserHandler,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
