import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  // Initialize userId from localStorage
  const [userId, setUserId] = useState(localStorage.getItem("user_id"));

  // Login function
  const login = (newToken, newUserId) => {
    localStorage.setItem("access_token", newToken);
    localStorage.setItem("user_id", newUserId); // Save ID
    setToken(newToken);
    setUserId(newUserId);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    setToken(null);
    setUserId(null);
  };

  // Check if user is logged in
  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ token, userId, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth anywhere
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};