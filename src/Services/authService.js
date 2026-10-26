import API from "./api";

// Student signup
export const signupUser = async (userData) => {
  const response = await API.post("/Auth/SignUp", userData);
  return response.data;
};

// Login
export const loginUser = async (credentials) => {
  const response = await API.post("/Auth/Login", credentials);
  return response.data;
};

// Logout
export const logoutUser = async () => {
  const response = await API.post("/Auth/Logout");
  return response.data;
};

// Get currently logged-in user
export const getCurrentUser = async () => {
  const response = await API.get("/Auth/Me");
  return response.data;
};