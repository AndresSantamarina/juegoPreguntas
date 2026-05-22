import {
  Clipboard,
  PersonFill,
  ArrowRightCircle,
  XCircle,
} from "react-bootstrap-icons";
import { motion } from "framer-motion";

const LobbyView = ({
  gameState,
  roomId,
  user,
  isHost,
  canStartGame,
  handleCopyRoomId,
  handleStartGame,
  handleCancelGame,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-xl mx-auto py-10 px-4"
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black text-center text-gray-800 mb-6">
          Sala: <span className="text-blue-600">{roomId}</span>
        </h1>

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-6">
          <span className="font-semibold text-gray-600">Compartir sala:</span>
          <button
            onClick={handleCopyRoomId}
            className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold hover:bg-blue-200 transition"
          >
            <Clipboard size={18} /> Copiar ID
          </button>
        </div>

        <h3 className="text-lg font-bold mb-4 text-gray-700">
          Jugadores ({gameState.players.length}/8)
        </h3>
        <ul className="space-y-3 mb-8">
          {gameState.players.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-xl shadow-sm"
            >
              <span className="flex items-center gap-2 font-bold">
                <PersonFill className="text-blue-500" /> {p.name}{" "}
                {p.id === user?.id && "(Tú)"}
              </span>
              {p.isHost && (
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase font-bold">
                  Anfitrión
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3">
          {isHost ? (
            <>
              <button
                onClick={handleStartGame}
                disabled={!canStartGame}
                className={`w-full py-4 rounded-xl font-black text-lg transition ${canStartGame ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-200 text-gray-400"}`}
              >
                {canStartGame
                  ? "COMENZAR PARTIDA"
                  : "Faltan jugadores (Mín. 3)"}
              </button>
              <button
                onClick={handleCancelGame}
                className="w-full py-3 rounded-xl text-red-500 font-bold hover:bg-red-50 transition"
              >
                Cancelar Sala
              </button>
            </>
          ) : (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-center font-bold">
              Esperando al anfitrión...
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default LobbyView;
