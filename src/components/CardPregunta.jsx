import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CardPregunta = ({ pregunta, respuestaCorrecta, onSelectOption }) => {
  const [opciones, setOpciones] = useState([]);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);

  useEffect(() => {
    const opcionesArray = [
      { text: pregunta.opcionUno, correcta: false },
      { text: pregunta.opcionDos, correcta: false },
      { text: pregunta.opcionTres, correcta: false },
      { text: pregunta.opcionCorrecta, correcta: true },
    ].sort(() => Math.random() - 0.5);
    setOpciones(opcionesArray);
  }, [pregunta]);

  const handleSelectOption = (opcion) => {
    if (opcionSeleccionada) return;
    setOpcionSeleccionada(opcion);
    onSelectOption(opcion);
  };

  const getButtonClass = (opcion) => {
    const baseClass =
      "w-full text-left p-4 rounded-lg font-medium transition-all shadow-sm border";
    if (!opcionSeleccionada)
      return `${baseClass} bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md`;

    if (opcion.correcta)
      return `${baseClass} bg-green-500 border-green-600 text-white scale-[1.02]`;
    if (opcionSeleccionada === opcion && !opcion.correcta)
      return `${baseClass} bg-red-500 border-red-600 text-white`;

    return `${baseClass} bg-gray-100 border-gray-200 text-gray-400 opacity-50`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-8"
    >
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
        <p className="font-bold text-2xl text-center text-gray-800 mb-8">
          {pregunta.pregunta}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {opciones.map((opcion, index) => (
            <button
              key={index}
              onClick={() => handleSelectOption(opcion)}
              disabled={!!opcionSeleccionada}
              className={getButtonClass(opcion)}
            >
              <span className="font-bold mr-2 opacity-70">{index + 1})</span>{" "}
              {opcion.text}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CardPregunta;
