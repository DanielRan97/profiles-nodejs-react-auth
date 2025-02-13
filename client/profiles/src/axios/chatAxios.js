import axios from "axios";
import { socket } from "../socket/socket";
export const API = axios.create({
  baseURL: "http://localhost:4000/chat",
});

// Request interceptor to attach the token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("profilesAuthToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const sendMessage = async (senderId, receiverId, message) => {
  try {
    const response = await API.post("/send", {
      senderId,
      receiverId,
      message,
    });
    if (response.status === 201) {
      socket.emit("private-message", { senderId, receiverId, message });
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getMessagesHistory = async (user2Id) => {
  try {
    const response = await API.get(`/chatHistory/${user2Id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

//Mark messages with user as "read"
export const markMessagesAsRead = async (senderId, receiverId) => {
  try {
    const response = await API.put(`/readAllMessages/${senderId}/${receiverId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

