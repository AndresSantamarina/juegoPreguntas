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
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-4xl md:text-5xl font-black text-center text-blue-600 mb-2 tracking-widest drop-shadow-sm">
        MODO TRIVIA
      </h1>
      <h4 className="text-center text-gray-500 font-medium mb-10 text-lg">
        Elige tu nivel y demuestra lo que sabes
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12">
        {niveles.map((nivel) => {
          const isSelected = nivelParam === nivel.toString();
          return (
            <button
              key={nivel}
              onClick={() => navigate(`/jugar/${nivel}`)}
              className={`relative flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-1 overflow-hidden group
                ${
                  isSelected
                    ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white border-blue-800 shadow-lg shadow-blue-300 scale-105"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm"
                }`}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-white opacity-20 group-hover:opacity-30 transition-opacity"></div>
              )}
              <span className="text-sm font-bold tracking-widest uppercase mb-1 opacity-80">
                Nivel
              </span>
              <span className="text-4xl font-black drop-shadow-sm">
                {nivel}
              </span>
            </button>
          );
        })}
      </div>

      {mostrarLoader ? (
        <div className="flex justify-center py-10">
          <span className="loader-custom"></span>
        </div>
      ) : nivelParam ? (
        preguntas.length === 0 ? (
          <div className="bg-gray-100 p-8 rounded-2xl text-center border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-xl font-bold">
              No hay preguntas para este nivel todavía.
            </p>
          </div>
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
        <div className="bg-blue-50 p-10 rounded-3xl text-center border border-blue-100 shadow-inner">
          <p className="text-blue-600 text-xl font-black uppercase tracking-wide">
            👆 Selecciona un nivel arriba para comenzar 👆
          </p>
        </div>
      )}
    </div>
  );
};

export default Jugar;
