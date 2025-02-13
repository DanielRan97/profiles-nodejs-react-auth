import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  register,
  login,
  API,
  editUser,
  getConnectedUsers,
} from "../axios/authAxios";
import { jwtDecode } from "jwt-decode";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("profilesAuthToken")
  );
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const navigate = useNavigate();

  const authContextLogout = useCallback(() => {
    localStorage.removeItem("profilesAuthToken");
    socket.disconnect();
    setUserData(null);
    setIsLoggedIn(false);
    setIsLoading(false);
    navigate("/auth")
  }, [navigate]);

  useEffect(() => {
    const checkTokenValidity = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("profilesAuthToken");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          authContextLogout();
        } else {
          const response = await API.post("/protected", { user: decodedToken });
          setIsLoggedIn(true);
          setUserData({
            fullName: response.data.user.fullName,
            email: response.data.user.email,
            profileImage: response.data.user.profileImage,
            nickName: response.data.user.nickName,
            _id: response.data.user._id,
          });

          if (!socket.connected) {
            socket.connect();
            socket.emit("user-join", response.data.user._id);
            socket.emit("get-online-users");

          }
        }
      } catch (error) {
        console.error("Invalid token, logging out.", error);
        authContextLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkTokenValidity();

    return () => {
      socket.off("online-users");
      socket.disconnect();
    };
  }, [authContextLogout]);

  useEffect(() => {
    socket.on("online-users", async (users) => {
      const connectedUsers = await getConnectedUsers(users);
      setUsersList(
        connectedUsers.connectedUsers.filter(
          (user) => user._id !== userData._id
        )
      );
    });

    return () => {
      socket.off("online-users");
    };
  }, [userData]);

  const authContextRegister = async (user) => {
    setIsLoading(true);
    try {
      const res = await register(user);
      return res;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const authContextEditUser = async (userData) => {
    setIsLoading(true);
    let token = localStorage.getItem("profilesAuthToken");
    const user = {
      ...userData,
      token,
    };
    try {
      const response = await editUser(user);
      setUserData({
        fullName: response.updatedUser.fullName,
        email: response.updatedUser.email,
        profileImage: response.updatedUser.profileImage,
        nickName: response.updatedUser.nickName,
        _id: response.updatedUser._id,
      });
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const authContextLogin = async (user) => {
    setIsLoading(true);
    try {
      const response = await login(user);
      localStorage.setItem("profilesAuthToken", response.token);
      setUserData({
        _id: response.user._id,
        fullName: response.user.fullName,
        email: response.user.email,
        profileImage: response.user.profileImage,
        nickName: response.user.nickName,
      });

      setIsLoggedIn(true);

      if (!socket.connected) {
        socket.connect();
        socket.emit("user-join", response.user._id);
        socket.emit("get-online-users");

        return () => {
          socket.off("online-users");
        };
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        authContextLogin,
        authContextRegister,
        authContextLogout,
        authContextEditUser,
        userData,
        isLoading,
        usersList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
