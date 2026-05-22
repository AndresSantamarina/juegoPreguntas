import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import CardPreguntaEditDelete from "../components/CardPreguntaEditDelete";
import {
  listarPreguntasPorNivelUsuario,
  obtenerNiveles,
} from "../helpers/queries";

const Preguntas = () => {
  const { nivel } = useParams();
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [mostrarLoader, setMostrarLoader] = useState(true);

  useEffect(() => {
    obtenerNiveles()
      .then(setNiveles)
      .catch(() => toast.error("Error al cargar niveles"));
  }, []);

  useEffect(() => {
    if (nivel) {
      setMostrarLoader(true);
      listarPreguntasPorNivelUsuario(nivel)
        .then(setPreguntas)
        .catch(() => toast.error("Error al cargar preguntas"))
        .finally(() => setMostrarLoader(false));
    } else {
      setPreguntas([]);
      setMostrarLoader(false);
    }
  }, [nivel]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-black text-center text-gray-800 mb-4 tracking-wide">
        GESTOR DE PREGUNTAS
      </h1>
      <h4 className="text-center text-gray-500 font-medium mb-8">
        Selecciona un nivel para editar o eliminar
      </h4>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-10">
        {niveles.map((n) => {
          const isSelected = nivel === n.toString();
          return (
            <button
              key={n}
              onClick={() => navigate(`/preguntas/${n}`)}
              className={`py-3 rounded-xl font-black text-lg transition-all border-b-4 active:border-b-0 active:translate-y-1
                ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-800 shadow-md"
                    : "bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300"
                }`}
            >
              Nivel {n}
            </button>
          );
        })}
      </div>

      {mostrarLoader ? (
        <div className="flex justify-center py-10">
          <span className="loader-custom"></span>
        </div>
      ) : nivel ? (
        preguntas.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No hay preguntas creadas en el Nivel {nivel}.
          </p>
        ) : (
          <div className="space-y-6">
            {preguntas.map((pregunta) => (
              <CardPreguntaEditDelete
                key={pregunta._id}
                pregunta={pregunta}
                setPreguntas={setPreguntas}
                nivel={nivel}
              />
            ))}
          </div>
        )
      ) : (
        <p className="text-center text-gray-500 text-lg">
          Aún no has seleccionado un nivel.
        </p>
      )}
    </div>
  );
};

export default Preguntas;
