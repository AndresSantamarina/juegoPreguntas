import imgPregunta from "../assets/question-mark.png";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Inicio = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-10 px-4"
    >
      <h1 className="text-4xl md:text-5xl font-black text-center text-gray-800 mb-8 uppercase tracking-wide">
        BIENVENIDO{user ? `, ${user.name}!` : "!"}
      </h1>

      <section className="text-center max-w-2xl text-lg text-gray-600 space-y-4">
        <p>
          ¡Bienvenido al{" "}
          <span className="font-bold text-blue-600">Juego de Preguntas</span>!
          Aquí podrás disfrutar de un emocionante juego en donde tendrás que
          elegir la respuesta correcta.
        </p>
        <p>
          ¡Demuestra tus conocimientos y desafía a tus amigos para ver quién es
          el mejor!
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
          ¡QUE TE DIVIERTAS!
        </h2>
      </section>
    </motion.div>
  );
};

export default Inicio;
