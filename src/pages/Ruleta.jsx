import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const COLORES = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
];

const Ruleta = () => {
  const [opciones, setOpciones] = useState([
    { id: 1, text: "Opción 1", color: COLORES[0] },
    { id: 2, text: "Opción 2", color: COLORES[1] },
    { id: 3, text: "Opción 3", color: COLORES[2] },
  ]);
  const [nuevaOpcion, setNuevaOpcion] = useState("");
  const [eliminarAlGanar, setEliminarAlGanar] = useState(false);

  const [girando, setGirando] = useState(false);
  const [rotacion, setRotacion] = useState(0);
  const [ganador, setGanador] = useState(null);

  const agregarOpcion = (e) => {
    e.preventDefault();
    if (!nuevaOpcion.trim()) return;

    const nuevoColor = COLORES[opciones.length % COLORES.length];
    setOpciones([
      ...opciones,
      { id: Date.now(), text: nuevaOpcion.trim(), color: nuevoColor },
    ]);
    setNuevaOpcion("");
  };

  const eliminarOpcion = (id) => {
    setOpciones(opciones.filter((op) => op.id !== id));
  };

  const girarRuleta = () => {
    if (opciones.length < 2) {
      toast.error("Agrega al menos 2 opciones para girar la ruleta.");
      return;
    }

    setGirando(true);
    setGanador(null);

    const girosExtra = Math.floor(Math.random() * 5) + 5;
    const anguloAleatorio = Math.floor(Math.random() * 360);
    const nuevaRotacion = rotacion + girosExtra * 360 + anguloAleatorio;

    setRotacion(nuevaRotacion);
    setTimeout(() => {
      setGirando(false);
      const gradosNormalizados = nuevaRotacion % 360;
      const tamanoPorcion = 360 / opciones.length;
      const anguloApuntado = (360 - gradosNormalizados) % 360;
      const indiceGanador = Math.floor(anguloApuntado / tamanoPorcion);

      const opcionGanadora = opciones[indiceGanador];
      setGanador(opcionGanadora.text);
      toast.success(`¡El ganador es: ${opcionGanadora.text}!`, {
        duration: 4000,
      });

      if (eliminarAlGanar) {
        setTimeout(() => {
          eliminarOpcion(opcionGanadora.id);
          toast("Opción eliminada de la ruleta", { icon: "🗑️" });
        }, 1500);
      }
    }, 5000);
  };

  const generarConicGradient = () => {
    const tamano = 360 / opciones.length;
    return opciones
      .map((op, i) => `${op.color} ${i * tamano}deg ${(i + 1) * tamano}deg`)
      .join(", ");
  };
  const offsetInicial = opciones.length > 0 ? -(360 / opciones.length) / 2 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-10 px-4"
    >
      <h1 className="text-4xl md:text-5xl font-black text-center text-gray-800 mb-10 tracking-wide">
        RULETA DE LA SUERTE 🎡
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Configuración
          </h3>
          <form onSubmit={agregarOpcion} className="flex gap-2 mb-6">
            <input
              type="text"
              value={nuevaOpcion}
              onChange={(e) => setNuevaOpcion(e.target.value)}
              placeholder="Nueva opción..."
              className="flex-1 p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={girando}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              Agregar
            </button>
          </form>
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
            <div>
              <p className="font-bold text-gray-700">Modo Eliminación</p>
              <p className="text-sm text-gray-500">
                Quitar la opción al salir elegida
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={eliminarAlGanar}
                onChange={() => setEliminarAlGanar(!eliminarAlGanar)}
                disabled={girando}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
          <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {opciones.length === 0 && (
                <p className="text-center text-gray-500 italic mt-4">
                  No hay opciones en la ruleta.
                </p>
              )}
              {opciones.map((op, i) => (
                <motion.div
                  key={op.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between bg-white border border-gray-100 shadow-sm p-3 rounded-lg mb-2"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: op.color }}
                    ></span>
                    <span className="font-bold text-gray-700 truncate max-w-[200px]">
                      {op.text}
                    </span>
                  </div>
                  <button
                    onClick={() => eliminarOpcion(op.id)}
                    disabled={girando}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center pt-8">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="#1e293b"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
              >
                <path d="M12 24L2.47372 7.5L21.5263 7.5L12 24Z" />
              </svg>
            </div>
            <div
              className="w-full h-full rounded-full border-8 border-gray-800 shadow-2xl relative overflow-hidden"
              style={{
                background:
                  opciones.length > 0
                    ? `conic-gradient(${generarConicGradient()})`
                    : "#e2e8f0",
                transform: `rotate(${rotacion + offsetInicial}deg)`,
                transition: "transform 5s cubic-bezier(0.15, 0.85, 0.15, 1)",
              }}
            >
              {opciones.length > 0 &&
                opciones.map((op, i) => {
                  const tamano = 360 / opciones.length;
                  const anguloText = i * tamano + tamano / 2;

                  return (
                    <div
                      key={`text-${op.id}`}
                      className="absolute top-1/2 left-1/2 w-[50%] h-10 -mt-5 origin-left"
                      style={{ transform: `rotate(${anguloText - 90}deg)` }}
                    >
                      <div className="w-full h-full flex items-center justify-end pr-8 sm:pr-12 text-white font-black drop-shadow-md truncate text-sm sm:text-base">
                        {op.text}
                      </div>
                    </div>
                  );
                })}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800 rounded-full border-4 border-white shadow-inner z-10"></div>
            </div>
          </div>

          <button
            onClick={girarRuleta}
            disabled={girando || opciones.length < 2}
            className="mt-12 bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-black text-2xl px-12 py-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {girando ? "GIRANDO..." : "¡GIRAR RULETA!"}
          </button>
          <AnimatePresence>
            {ganador && !girando && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="mt-8 bg-green-100 border-2 border-green-500 text-green-800 px-8 py-4 rounded-2xl shadow-xl text-center"
              >
                <p className="text-sm font-bold uppercase tracking-widest mb-1">
                  Ganador
                </p>
                <p className="text-3xl font-black">{ganador}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Ruleta;
