import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Error404 = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <h1 className="text-8xl font-black text-gray-200 mb-4">404</h1>
      <p className="text-2xl font-bold text-gray-700 mb-8">
        Página no encontrada
      </p>
      <p className="text-gray-500 mb-8">
        La página que estás buscando no existe o fue movida.
      </p>
      <Link
        to="/"
        className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-transform hover:scale-105"
      >
        Volver al inicio
      </Link>
    </motion.div>
  );
};

export default Error404;
