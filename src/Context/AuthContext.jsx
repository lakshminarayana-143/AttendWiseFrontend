import { createContext, useContext, useEffect, useMemo, useState } from "react";

import API from "./services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    API.get("/Auth/Me")
      .then((response) => {
        if (active) {
          setUser(response.data.user || null);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const login = async (credentials) => {
    const response = await API.post("/Auth/Login", credentials);

    if (!response.data.user) {
      throw new Error("User information was not returned.");
    }

    setUser(response.data.user);

    return response.data.user;
  };

  const signup = async (details) => {
    const response = await API.post("/Auth/SignUp", details);

    return response.data;
  };

  const logout = async () => {
    try {
      await API.post("/Auth/Logout");
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
