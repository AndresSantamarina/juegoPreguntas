import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  eliminarPreguntaAPI,
  listarPreguntasPorNivelUsuario,
} from "../helpers/queries";

const CardPreguntaEditDelete = ({ pregunta, setPreguntas, nivel }) => {
  const borrarPregunta = async () => {
    if (
      window.confirm(
        "¿Estás seguro de eliminar esta pregunta? Esta acción no se puede deshacer.",
      )
    ) {
      try {
        await eliminarPreguntaAPI(pregunta._id);
        toast.success("Pregunta eliminada");
        const actualizadas = await listarPreguntasPorNivelUsuario(nivel);
        setPreguntas(actualizadas);
      } catch (error) {
        toast.error(error.message || "Error al eliminar");
      }
    }
  };

  const opciones = [
    pregunta.opcionUno,
    pregunta.opcionDos,
    pregunta.opcionTres,
    pregunta.opcionCorrecta,
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-100">
        <p className="font-bold text-xl text-center text-gray-800 mb-6">
          {pregunta.pregunta}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {opciones.map((op, i) => (
            <div
              key={i}
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
            >
              <span className="font-bold mr-2">{i + 1}.</span>
              {op}
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <Link
            to={`/preguntas/editar/${pregunta._id}`}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Editar
          </Link>
          <button
            onClick={borrarPregunta}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CardPreguntaEditDelete;
