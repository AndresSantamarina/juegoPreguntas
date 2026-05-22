import { motion } from "framer-motion";
import { HeartFill, ClockFill } from "react-bootstrap-icons";

const GamePhaseView = ({
  gameState,
  playerState,
  remainingTime,
  isInGame,
  isVoting,
  isImpostorChoosing,
  isImpostorGuessing,
  isMyTurn,
  handleVote,
  handleImpostorTarget,
  registerClue,
  handleSubmitClue,
  onSubmitClue,
  myClue,
  myVoteTarget,
  onSubmitGuess,
}) => {
  const isInnocent = playerState && !playerState.isImpostor;
  const secretWord = gameState.secretWord?.trim().toUpperCase();

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow mb-6">
        <div className="flex items-center gap-2 font-bold text-red-600">
          <HeartFill /> Vidas: {playerState?.lives}
        </div>
        <div className="flex items-center gap-2 font-bold text-blue-600">
          <ClockFill /> {remainingTime}s
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-8">
        {gameState.words?.map((w, i) => {
          const currentWord = w.trim().toUpperCase();
          const isSecret = currentWord === secretWord;
          const showHighlight = isSecret && isInnocent;

          return (
            <div
              key={i}
              className={`p-3 rounded-lg text-center font-bold transition-all ${showHighlight ? "bg-green-500 text-white shadow-md scale-105" : "bg-gray-100 text-gray-700"}`}
            >
              {w}
            </div>
          );
        })}
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">
          Pistas de la ronda
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {gameState.players
            .filter((p) => p.isAlive)
            .map((p) => (
              <div
                key={p.id}
                className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col justify-center items-center text-center"
              >
                <span className="font-bold text-sm text-gray-800 mb-1">
                  {p.name}
                </span>
                {p.clueGiven ? (
                  <span className="text-blue-600 font-black text-lg">
                    {p.clueGiven}
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs italic mt-1">
                    Pensando...
                  </span>
                )}
              </div>
            ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-2xl shadow-xl"
      >
        {isInGame && isMyTurn && !myClue && (
          <form
            onSubmit={handleSubmitClue(onSubmitClue)}
            className="flex gap-2"
          >
            <input
              {...registerClue("clue", { required: true })}
              className="flex-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Escribe tu pista aquí..."
              autoComplete="off"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-bold transition-colors">
              Enviar
            </button>
          </form>
        )}
        {isVoting && (
          <div className="grid gap-2">
            {gameState.players
              .filter((p) => p.isAlive)
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleVote(p.id)}
                  disabled={myVoteTarget}
                  className={`p-4 rounded-xl border-2 font-bold transition-all ${myVoteTarget === p.id ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:bg-gray-50"}`}
                >
                  {p.name}
                </button>
              ))}
          </div>
        )}
        {isImpostorChoosing && !isInnocent && (
          <div className="grid gap-2">
            <h3 className="text-xl font-bold text-center text-red-600 mb-2">
              Empate. Elige a quién eliminar:
            </h3>
            {gameState.players
              .filter((p) => p.isAlive && p.id !== playerState.id)
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleImpostorTarget(p.id)}
                  className="p-4 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200 transition-colors"
                >
                  Eliminar a {p.name}
                </button>
              ))}
          </div>
        )}
        {isImpostorGuessing && (
          <div className="mt-2 border-t pt-4">
            {!isInnocent ? (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-black text-center text-yellow-600">
                  ¡ÚLTIMA OPORTUNIDAD!
                </h3>
                <p className="text-center font-bold text-gray-600 mb-2">
                  Toca la palabra clave para ganar la partida:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {gameState.words?.map((w, i) => (
                    <button
                      key={i}
                      onClick={() => onSubmitGuess({ guess: w })}
                      className="p-3 bg-yellow-100 hover:bg-yellow-500 border border-transparent hover:border-yellow-600 hover:text-white text-yellow-800 rounded-lg font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-200">
                <h3 className="text-lg font-bold text-gray-700">
                  El impostor ha sido descubierto y está intentando adivinar la
                  palabra clave...
                </h3>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GamePhaseView;
