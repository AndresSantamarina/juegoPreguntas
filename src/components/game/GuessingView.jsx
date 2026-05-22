import { motion } from "framer-motion";

const GuessingView = ({ gameState, playerState, isAlive, onSubmitGuess }) => {
  const isMyTurn =
    gameState.turnOrder?.[gameState.currentTurnIndex] === playerState?.id;
  const wrongGuesses = gameState.wrongGuesses || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto py-10 px-4"
    >
      <h1 className="text-3xl font-black text-center text-yellow-600 mb-6">
        Modo Adivinanza 🧠
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
        <p className="text-center font-bold text-xl mb-6">
          {isMyTurn && isAlive
            ? "¡Es tu turno! Toca la palabra secreta:"
            : "Espera tu turno..."}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gameState.words?.map((w, i) => {
            const isGuessed = wrongGuesses.includes(w.toUpperCase());

            return (
              <button
                key={i}
                disabled={!isMyTurn || !isAlive || isGuessed}
                onClick={() => onSubmitGuess({ guess: w })}
                className={`p-4 rounded-xl text-center font-bold transition-all shadow-sm ${
                  isGuessed
                    ? "bg-gray-200 text-gray-400 line-through opacity-50 cursor-not-allowed"
                    : !isMyTurn || !isAlive
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-yellow-100 text-yellow-800 border-2 border-transparent hover:border-yellow-400 hover:bg-yellow-500 hover:text-white hover:scale-105 active:scale-95"
                }`}
              >
                {w}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default GuessingView;
