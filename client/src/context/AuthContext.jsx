import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore auth from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);

      // Optional token check
      API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          console.warn("Token verify failed, keeping user logged in");
        });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setIsLoggedIn(true);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || "Login failed",
      };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
