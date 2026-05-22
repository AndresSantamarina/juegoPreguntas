import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { editarPreguntaAPI, obtenerPreguntaAPI } from "../helpers/queries";

const Editar = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerPreguntaAPI(id);
        reset(data);
      } catch (error) {
        toast.error("Error al cargar la pregunta");
      }
    };
    if (id) cargarDatos();
  }, [id, reset]);

  const onSubmit = async (pregunta) => {
    try {
      await editarPreguntaAPI(pregunta, id);
      toast.success("Pregunta editada correctamente");
      navigate("/preguntas");
    } catch (error) {
      toast.error(error.message || "No se pudo editar la pregunta");
    }
  };

  const inputClass =
    "w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all";
  const labelClass = "block text-sm font-semibold text-gray-700";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto py-8"
    >
      <h1 className="text-3xl font-black text-center text-gray-800 mb-8 uppercase tracking-wide">
        EDITAR PREGUNTA
      </h1>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className={labelClass}>Nivel</label>
            <select
              className={inputClass}
              {...register("nivel", { required: true })}
            >
              <option value="">Seleccione el nivel...</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  Nivel {n}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Pregunta</label>
            <input
              type="text"
              className={inputClass}
              {...register("pregunta", { required: true })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Opción 1</label>
              <input
                type="text"
                className={inputClass}
                {...register("opcionUno", { required: true })}
              />
            </div>
            <div>
              <label className={labelClass}>Opción 2</label>
              <input
                type="text"
                className={inputClass}
                {...register("opcionDos", { required: true })}
              />
            </div>
            <div>
              <label className={labelClass}>Opción 3</label>
              <input
                type="text"
                className={inputClass}
                {...register("opcionTres", { required: true })}
              />
            </div>
            <div>
              <label className={labelClass}>Respuesta Correcta</label>
              <input
                type="text"
                className={`w-full px-4 py-2 mt-1 border-2 border-green-400 bg-green-50 rounded-lg`}
                {...register("opcionCorrecta", { required: true })}
              />
            </div>
          </div>
          <div className="pt-4 text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-transform hover:scale-105 w-full md:w-auto"
            >
              Actualizar Cambios
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Editar;
