
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
  const [activeWorkspace, setActiveWorkspace] = useState(null);

  // Determine available workspaces for the authenticated user.
  const getAvailableWorkspaces = (currentUser) => {
    if (!currentUser) return [];

    // OG Admin has permanent admin access.
    if (currentUser.adminAccess?.type === "owner") {
      return ["admin"];
    }

    const workspaces = [];

    if (["student", "faculty"].includes(currentUser.role)) {
      workspaces.push(currentUser.role);
    }

    // Temporary admin receives an additional workspace.
    if (
      currentUser.adminAccess?.type === "temporary" &&
      currentUser.adminAccess?.isActive
    ) {
      workspaces.push("admin");
    }

    return workspaces;
  };

  // Restore authenticated user from the server.
  const refreshUser = useCallback(async () => {
    try {
      const response = await API.get("/Auth/Me");

      const currentUser = response.data?.user;

      if (!currentUser) {
        setUser(null);
        setActiveWorkspace(null);
        return null;
      }

      setUser(currentUser);

      const workspaces = getAvailableWorkspaces(currentUser);

      // Always ask temporary admins to select a workspace after refresh.
      if (
        currentUser.adminAccess?.type === "temporary" &&
        workspaces.length > 1
      ) {
        setActiveWorkspace(null);
      } else {
        setActiveWorkspace(workspaces[0] || null);
      }

      return currentUser;
    } catch (err) {
      setUser(null);
      setActiveWorkspace(null);

      if (err.response?.status !== 401) {
        console.error(
          "Unable to restore session:",
          err.response?.data?.message || err.message
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
        message:
          response.data.message || "Student registration successful.",
        user: response.data.user,
      };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to register. Please try again.";

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

      const workspaces = getAvailableWorkspaces(loggedInUser);

      // Temporary admins must select their workspace after login.
      if (
        loggedInUser.adminAccess?.type === "temporary" &&
        workspaces.length > 1
      ) {
        setActiveWorkspace(null);
      } else {
        setActiveWorkspace(workspaces[0] || null);
      }

      return {
        success: true,
        user: loggedInUser,
        workspaces,
        needsWorkspaceSelection: workspaces.length > 1,
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

  // Select workspace.
  const selectWorkspace = (workspace) => {
    const workspaces = getAvailableWorkspaces(user);

    if (!workspaces.includes(workspace)) {
      return {
        success: false,
        message: "You do not have permission to access this workspace.",
      };
    }

    setActiveWorkspace(workspace);

    return {
      success: true,
      workspace,
    };
  };

  // Logout.
  const logout = async () => {
    setError("");

    try {
      await API.post("/Auth/Logout");
    } catch (err) {
      console.error(
        "Logout request failed:",
        err.response?.data?.message || err.message
      );
    } finally {
      setUser(null);
      setActiveWorkspace(null);
    }
  };

  const availableWorkspaces = getAvailableWorkspaces(user);

  const needsWorkspaceSelection =
    availableWorkspaces.length > 1 && !activeWorkspace;

  const value = {
    user,
    loading,
    error,

    signup,
    facultySignup,
    login,
    logout,
    refreshUser,

    activeWorkspace,
    selectWorkspace,
    availableWorkspaces,
    needsWorkspaceSelection,

    isAuthenticated: Boolean(user),

    // Original account roles.
    isStudent: user?.role === "student",
    isFaculty: user?.role === "faculty",

    // Admin access depends on the selected workspace.
    isAdmin:
      user?.adminAccess?.type === "owner" ||
      (activeWorkspace === "admin" &&
        availableWorkspaces.includes("admin")),

    hasAdminAccess: availableWorkspaces.includes("admin"),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
