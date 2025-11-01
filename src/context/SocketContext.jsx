import { createContext, useContext, useState, useEffect, useMemo } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SOCKET_URI = import.meta.env.VITE_SOCKET_URI;

export const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketUrl = useMemo(() => {
    return SOCKET_URI || "http://localhost:4000";
  }, [SOCKET_URI]);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "No se encontró el token para la conexión de socket. Desconectando..."
      );
      setSocket(null);
      setIsConnected(false);
      return;
    }

    const newSocket = io(socketUrl, {
      query: { userId: user.id },
      auth: {
        token: token,
      },
      forceNew: true,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket conectado:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket desconectado.");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Error de conexión de Socket.IO:", error.message);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket && newSocket.connected) {
        newSocket.disconnect();
      }
    };
  }, [user, socketUrl]);

  const contextValue = useMemo(
    () => ({
      socket,
      isConnected,
    }),
    [socket, isConnected]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
