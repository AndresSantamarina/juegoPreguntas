import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { crearPreguntaAPI } from "../helpers/queries";
import { useAuth } from "../context/AuthContext";

const Agregar = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (pregunta) => {
    try {
      if (!user || !user.id) {
        toast.error("Debes iniciar sesión para crear preguntas");
        return;
      }
      const preguntaConUsuario = { ...pregunta, usuario: user.id };
      await crearPreguntaAPI(preguntaConUsuario);
      toast.success("Pregunta creada correctamente");
      reset();
    } catch (error) {
      toast.error(error.message || "Error al crear la pregunta");
    }
  };

  const inputClass =
    "w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all";
  const labelClass = "block text-sm font-semibold text-gray-700";
  const errorClass = "text-red-500 text-xs font-medium mt-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-8"
    >
      <h1 className="text-3xl font-black text-center text-gray-800 mb-8 uppercase tracking-wide">
        AGREGAR PREGUNTA
      </h1>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className={labelClass}>Nivel</label>
            <select
              className={inputClass}
              {...register("nivel", { required: "Seleccione un nivel" })}
            >
              <option value="">Seleccione el nivel...</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  Nivel {n}
                </option>
              ))}
            </select>
            {errors.nivel && (
              <p className={errorClass}>{errors.nivel.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Pregunta</label>
            <input
              type="text"
              placeholder="¿Cuál es el río más largo del mundo?"
              className={inputClass}
              {...register("pregunta", {
                required: "La pregunta es obligatoria",
                minLength: { value: 5, message: "Mínimo 5 caracteres" },
                maxLength: { value: 150, message: "Máximo 150 caracteres" },
              })}
            />
            {errors.pregunta && (
              <p className={errorClass}>{errors.pregunta.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Opción 1</label>
              <input
                type="text"
                className={inputClass}
                {...register("opcionUno", { required: "Obligatorio" })}
              />
              {errors.opcionUno && (
                <p className={errorClass}>{errors.opcionUno.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Opción 2</label>
              <input
                type="text"
                className={inputClass}
                {...register("opcionDos", { required: "Obligatorio" })}
              />
              {errors.opcionDos && (
                <p className={errorClass}>{errors.opcionDos.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Opción 3</label>
              <input
                type="text"
                className={inputClass}
                {...register("opcionTres", { required: "Obligatorio" })}
              />
              {errors.opcionTres && (
                <p className={errorClass}>{errors.opcionTres.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Respuesta Correcta</label>
              <input
                type="text"
                className={`w-full px-4 py-2 mt-1 border-2 border-green-400 bg-green-50 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all`}
                {...register("opcionCorrecta", { required: "Obligatorio" })}
              />
              {errors.opcionCorrecta && (
                <p className={errorClass}>{errors.opcionCorrecta.message}</p>
              )}
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-transform hover:scale-105 w-full md:w-auto"
            >
              Guardar Pregunta
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Agregar;
