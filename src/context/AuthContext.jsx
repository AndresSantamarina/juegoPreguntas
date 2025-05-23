import { createContext, useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
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
      const res = await axios.post(`${URL_API}/login`, credentials);

      if (!res.data.user || !res.data.user.id) {
        throw new Error(
          "La respuesta del servidor no incluye datos de usuario válidos"
        );
      }

      const userData = {
        id: res.data.user.id,
        name: res.data.user.name,
      };

      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("token", res.data.token);
      return { success: true };
    } catch (error) {
      console.error("Error en login:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Error al iniciar sesión",
      };
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
      return {
        success: false,
        message: error.response?.data?.message || "Error al registrar",
      };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
    Swal.fire({
      title: "Éxito",
      text: "Sesión cerrada",
      icon: "success",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
