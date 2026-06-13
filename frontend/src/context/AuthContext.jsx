import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api.js";

const AuthContext = createContext(null);

// Provides authentication state and actions to the entire app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On initial load, check if a valid session cookie exists
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await API.get("/auth/me");
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    setUser(data);
    return data;
  };

  const register = async (username, email, password) => {
    const { data } = await API.post("/auth/register", { username, email, password });
    setUser(data);
    return data;
  };

  const logout = async () => {
    await API.post("/auth/logout");
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming auth context
export const useAuth = () => useContext(AuthContext);
