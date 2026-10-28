import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import API from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session after refreshing the browser.
  const refreshUser = useCallback(async () => {
    try {
      const response = await API.get("/Auth/Me");

      setUser(response.data?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Login
  const login = useCallback(async (credentials) => {
    const response = await API.post(
      "/Auth/Login",
      credentials
    );

    if (!response.data?.user) {
      throw new Error(
        "Login response did not include a user."
      );
    }

    setUser(response.data.user);

    return response.data.user;
  }, []);

  // Signup
  const signup = useCallback(async (details) => {
    const response = await API.post(
      "/Auth/SignUp",
      details
    );

    return response.data;
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await API.post("/Auth/Logout");
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      refreshUser,
    }),
    [
      user,
      loading,
      login,
      signup,
      logout,
      refreshUser,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}