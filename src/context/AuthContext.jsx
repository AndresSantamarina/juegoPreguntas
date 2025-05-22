// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";
const URL_API = import.meta.env.VITE_API_URI;


export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (credentials) => {
    try {
        console.log("Credenciales que se envían al backend:", credentials);
      const res = await axios.post(`${URL_API}/login`, credentials);
    
      setUser(res.data.user);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      sessionStorage.setItem("token", res.data.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al iniciar sesión" };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${URL_API}/register`, userData);
      setUser(res.data.user);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      sessionStorage.setItem("token", res.data.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error al registrar" };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
