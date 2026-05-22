import { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const URL_API = import.meta.env.VITE_API_URI;

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (credentials) => {
    try {
      const res = await axios.post(`${URL_API}/login`, credentials);

      if (!res.data.user || !res.data.user.id) {
        throw new Error(
          "La respuesta del servidor no incluye datos de usuario válidos",
        );
      }

      const userData = {
        id: res.data.user.id,
        name: res.data.user.name,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", res.data.token);
      toast.success("¡Bienvenido de nuevo!");
      return { success: true };
    } catch (error) {
      console.error("Error en login:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Error al iniciar sesión";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${URL_API}/register`, userData);
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      toast.success("Cuenta creada correctamente");
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Error al registrar";
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    toast.success("Sesión cerrada");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
