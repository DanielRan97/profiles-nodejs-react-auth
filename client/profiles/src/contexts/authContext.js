import React, { createContext, useState, useEffect } from "react";
import { register, login, API } from "../axios/auth";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("profilesAuthToken"));
    const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTokenValidity = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("profilesAuthToken");

      if (!token) {
        console.log("No token found, user not logged in.");
        setIsLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          console.error("Token expired, logging out.");
          authContextLogout();
        } else {
          const response = await API.post("/protected", { user: decodedToken });
          setIsLoggedIn(true);
          setUserData({
            fullName: response.data.user.fullName,
            nickName: response.data.user.nickName,
            _id: response.data.user._id,
            createdAt: "2025-01-26T09:07:20.899Z",
          });
          console.log("User authenticated with valid token.");
        }
      } catch (error) {
        console.error("Invalid token, logging out.", error);
        authContextLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkTokenValidity();
  }, []);
  console.log(userData);
  
  const authContextRegister = async (user) => {
    setIsLoading(true);
    try {
      const res = await register(user);
      console.log("Registered successfully!");
      return res;
    } catch (error) {
      console.error("Registration failed:", error);
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
        fullName: response.user.fullName,
        nickName: response.user.nickName,
        _id: response.user._id,
        createdAt: "2025-01-26T09:07:20.899Z",
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const authContextLogout = () => {
    localStorage.removeItem("profilesAuthToken");
    setUserData(null);
    setIsLoggedIn(false);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        authContextLogin,
        authContextRegister,
        authContextLogout,
        userData,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
