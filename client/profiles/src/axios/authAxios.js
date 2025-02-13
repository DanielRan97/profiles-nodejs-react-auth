import axios from "axios";

// Set up the base URL for your API
export const API = axios.create({
  baseURL: "http://localhost:4000/auth",
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

// Response interceptor to handle token expiration
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear localStorage and redirect to login
      localStorage.removeItem("profilesAuthToken");
      window.location.href = "/auth"; // Adjust routing
    }
    return Promise.reject(error);
  }
);

// Register function
export const register = async ({ fullName, nickName, password, email, profileImage }) => {
  const formData = new FormData();
  formData.append("nickName", nickName);
  formData.append("password", password);
  formData.append("fullName", fullName);
  formData.append("email", email);
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }
  try {
    const response = await API.post("/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

// Login function
export const login = async (user) => {
  try {
    const response = await API.post("/login", {
      nickName: user.nickName,
      password: user.password,
    });
    localStorage.setItem("profilesAuthToken", response.data.token);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Send verified code
export const sendCode = async (email) => {
  try {
    const response = await API.post("/send-code", { email: email });
    return response;
  } catch (error) {
    throw error.response?.data?.message || "Error sending code";
  }
};

//Verified code
export const verifyCode = async (email, code) => {
  try {
    const response = await API.post("/verify-code", {
      email: email,
      code: code,
    });
    return response;
  } catch (error) {
    throw error.response?.data?.message || "Error verifying code";
  }
};

//get User By Id
export const getUserById = async (id) => {
  try {
    const res = await API.get(`/user/${id}`);
    return res.data.user;
  } catch (error) {
    throw error.response?.data?.message || "Error't finding User";
  }
}

//Edit User
export const editUser = async ({ fullName, nickName, email, profileImage, _id, tokem }) => {
  const formData = new FormData();
  formData.append("nickName", nickName);
  formData.append("fullName", fullName);
  formData.append("email", email);
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }
  try {
    const response = await API.put(`/user/${_id}`, formData, {
      headers: { "Content-Type": "multipart/form-data", "Authorization" : `Bearer ${tokem}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

//Get connected users
export const getConnectedUsers = async (connectedUsers) => {

  try {
    const response = await API.post("/get-connected-users/", {connectedUsers});
    return response.data;
  } catch (error) {
    throw error;
  }
}
