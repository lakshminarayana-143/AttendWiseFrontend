import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Restore the authenticated user from the server.
  const refreshUser = useCallback(async () => {
    try {
      const response = await API.get("/Auth/Me");

      const currentUser = response.data?.user;

      if (!currentUser) {
        setUser(null);
        return null;
      }

      setUser(currentUser);

      return currentUser;
    } catch (err) {
      setUser(null);

      if (err.response?.status !== 401) {
        console.error(
          "Unable to restore session:",
          err.response?.data?.message || err.message,
        );
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Student registration.
  const signup = async (formData) => {
    setError("");

    try {
      const response = await API.post("/Auth/SignUp", {
        ...formData,
        role: "student",
      });

      return {
        success: true,
        message: response.data.message || "Student registration successful.",
        user: response.data.user,
      };
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to register. Please try again.";

      setError(message);

      return {
        success: false,
        message,
      };
    }
  };

  // Faculty registration.
  const facultySignup = async (formData) => {
    setError("");

    try {
      const response = await API.post("/Auth/FacultySignUp", formData);

      return {
        success: true,
        message:
          response.data.message ||
          "Faculty registration submitted successfully.",
        user: response.data.user,
      };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to register faculty. Please try again.";

      setError(message);

      return {
        success: false,
        message,
      };
    }
  };

  // Login.
  const login = async (email, password) => {
    setError("");

    try {
      const response = await API.post("/Auth/Login", {
        email: email.trim(),
        password,
      });

      const loggedInUser = response.data?.user;

      if (!loggedInUser) {
        throw new Error("The server did not return the logged-in user.");
      }

      setUser(loggedInUser);

      return {
        success: true,
        user: loggedInUser,
        message: response.data.message || "Login successful.",
      };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";

      setError(message);

      return {
        success: false,
        message,
      };
    }
  };

  // Logout.
  const logout = async () => {
    setError("");

    try {
      await API.post("/Auth/Logout");
    } catch (err) {
      console.error(
        "Logout request failed:",
        err.response?.data?.message || err.message,
      );
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    facultySignup,
    login,
    logout,
    refreshUser,
    isAuthenticated: Boolean(user),
    isStudent: user?.role === "student",
    isFaculty: user?.role === "faculty",
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
