import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

const ImpostorHome = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async (categoryName) => {
    if (!isConnected) {
      toast.error("No conectado al servidor de juego.");
      return;
    }
    setLoading(true);

    socket.emit("createRoom", { categoryName: categoryName }, (response) => {
      setLoading(false);
      if (response.success) {
        toast.success(`Sala Creada - ID: ${response.roomId}`);
        navigate(`/impostor/room/${response.roomId}`);
      } else {
        toast.error(response.message || "No se pudo crear la sala.");
      }
    });
  };

  const handleJoinRoom = async (data) => {
    const { roomId } = data;

    if (!isConnected) {
      toast.error("No conectado al servidor de juego.");
      return;
    }
    setLoading(true);

    socket.emit("joinRoom", { roomId: roomId.toUpperCase() }, (response) => {
      setLoading(false);
      if (response.success) {
        toast.success(`Te has unido a la sala ${response.roomId}`);
        navigate(`/impostor/room/${response.roomId}`);
      } else {
        toast.error(response.message || "No se pudo unir a la sala.");
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto py-10 px-4"
    >
      <h1 className="text-4xl md:text-5xl font-black text-center text-gray-800 mb-8 tracking-wide">
        EL IMPOSTOR 🕵️‍♂️
      </h1>
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 mb-10">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reglas del Juego
        </h3>
        <div className="text-gray-700 space-y-4">
          <p className="text-lg">
            <strong className="text-red-600">Objetivo:</strong> Descubrir al
            impostor o sobrevivir sin ser descubierto.
          </p>
          <ul className="list-none space-y-3">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">🔹</span>
              <span>
                Cada jugador, excepto uno, recibirá la misma{" "}
                <strong>palabra clave</strong>.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">🔺</span>
              <span>
                El Impostor <strong>no recibe</strong> ninguna palabra clave.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">🔹</span>
              <span>
                Por turnos, cada jugador dirá una palabra que esté relacionada
                con la Palabra Clave.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">🔹</span>
              <span>
                Los jugadores "normales" deben decir una palabra que demuestre
                que conocen la clave sin ser demasiado obvios.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">🔺</span>
              <span>
                El Impostor debe <strong>improvisar</strong> una palabra
                relacionada para mezclarse con el resto.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-500 mr-2">⚖️</span>
              <span>
                Si un jugador dice una palabra que no tiene relación o parece
                sospechosa, será <strong>votado</strong> en la fase de
                eliminación.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500 flex flex-col justify-center items-center text-center">
          <h4 className="text-2xl font-bold text-gray-800 mb-3">
            Crear Partida
          </h4>
          <p className="text-gray-500 mb-8">
            Sé el anfitrión y genera un ID de sala único para invitar a tus
            amigos.
          </p>
          <button
            onClick={() => handleCreateRoom("random")}
            disabled={!user || loading || !isConnected}
            className="w-full max-w-xs bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-1"
          >
            {loading ? "Creando..." : "CREAR PARTIDA"}
          </button>
          {!isConnected && (
            <p className="text-red-500 text-sm mt-4 font-semibold animate-pulse">
              Conectando al servidor...
            </p>
          )}
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-500 flex flex-col justify-center">
          <h4 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Unirse a Partida
          </h4>
          <form onSubmit={handleSubmit(handleJoinRoom)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ingresa el ID de la Sala
              </label>
              <input
                type="text"
                placeholder="Ej: ABCD"
                className={`w-full p-4 border-2 rounded-xl text-center text-2xl font-black uppercase tracking-widest outline-none transition-all ${
                  errors.roomId
                    ? "border-red-400 focus:border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                }`}
                {...register("roomId", {
                  required: "El ID de la sala es obligatorio",
                  pattern: {
                    value: /^[A-Za-z]{4}$/,
                    message: "El ID debe ser de 4 letras exactas.",
                  },
                })}
              />
              {errors.roomId && (
                <p className="text-red-500 text-sm font-medium mt-2 text-center">
                  {errors.roomId.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!user || loading || !isConnected}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-1"
            >
              {loading ? "Uniéndose..." : "UNIRSE A PARTIDA"}
            </button>
          </form>
        </div>
      </div>
      <div className="text-center mt-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-600 shadow-inner">
          <span
            className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
          ></span>
          Servidor: {isConnected ? "Conectado" : "Desconectado"}
        </div>

        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-yellow-100 text-yellow-800 p-4 rounded-xl font-bold max-w-md mx-auto border border-yellow-200"
          >
            ⚠️ ¡Recuerda iniciar sesión para poder jugar!
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ImpostorHome;
