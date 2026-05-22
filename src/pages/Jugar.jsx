import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import winSound from "../assets/win.mp3";
import loseSound from "../assets/lose.mp3";
import CardPregunta from "../components/CardPregunta";
import {
  listarPreguntasPorNivelUsuario,
  obtenerNiveles,
} from "../helpers/queries";
import { useAuth } from "../context/AuthContext";

const Jugar = () => {
  const { nivel: nivelParam } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [preguntas, setPreguntas] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [mostrarLoader, setMostrarLoader] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error("Debes iniciar sesión para jugar");
      navigate("/login");
      return;
    }
    const cargar = async () => {
      setMostrarLoader(true);
      try {
        const niv = await obtenerNiveles();
        setNiveles(niv);
        if (nivelParam) {
          const preg = await listarPreguntasPorNivelUsuario(nivelParam);
          setPreguntas(preg);
        }
      } catch (err) {
        toast.error("Error cargando los datos");
      } finally {
        setMostrarLoader(false);
      }
    };
    cargar();
  }, [nivelParam, user, navigate]);

  const handleSelectOption = (opcion) => {
    const audio = new Audio(opcion.correcta ? winSound : loseSound);
    audio.play().catch((e) => console.log("Audio play failed:", e));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-black text-center text-blue-600 mb-4 tracking-wide">
        MODO TRIVIA
      </h1>
      <h4 className="text-center text-gray-500 font-medium mb-8">
        Elige tu nivel y demuestra lo que sabes
      </h4>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {niveles.map((nivel) => (
          <button
            key={nivel}
            onClick={() => navigate(`/jugar/${nivel}`)}
            className={`px-6 py-2 font-bold rounded-full transition-transform hover:scale-105 ${nivelParam === nivel.toString() ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-gray-800 text-white hover:bg-gray-700"}`}
          >
            Nivel {nivel}
          </button>
        ))}
      </div>

      {mostrarLoader ? (
        <div className="flex justify-center py-10">
          <span className="loader-custom"></span>
        </div>
      ) : nivelParam ? (
        preguntas.length === 0 ? (
          <p className="text-center text-gray-500 text-xl font-medium py-10">
            No hay preguntas para este nivel.
          </p>
        ) : (
          <div className="space-y-6">
            {preguntas.map((pregunta, index) => (
              <CardPregunta
                key={pregunta._id || index}
                pregunta={pregunta}
                onSelectOption={handleSelectOption}
              />
            ))}
          </div>
        )
      ) : (
        <p className="text-center text-gray-500 text-xl font-medium py-10">
          Selecciona un nivel de la parte superior para empezar a jugar.
        </p>
      )}
    </div>
  );
};

export default Jugar;
