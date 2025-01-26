import axios from 'axios';

// Set up the base URL for your API
export const API = axios.create({
  baseURL: 'http://localhost:4000/auth', // Replace with your API base URL
});

// Request interceptor to attach the token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('profilesAuthToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
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
      console.error("Unauthorized or token expired.");
      // Clear localStorage and redirect to login
      localStorage.removeItem("profilesAuthToken");
      window.location.href = "/auth"; // Adjust routing
    }
    return Promise.reject(error);
  }
);

// Register function
export const register = async ({ fullName, nickName, password }) => {
  try {
    const response = await API.post('/register', {
      fullName,
      nickName,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

// Login function
export const login = async ({ nickName, password }) => {
  try {
    const response = await API.post('/login', {
      nickName,
      password,
    });
    localStorage.setItem('profilesAuthToken', response.data.token);
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};


