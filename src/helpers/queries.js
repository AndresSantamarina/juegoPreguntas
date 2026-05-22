import axios from "axios";

const URL_PREGUNTAS = import.meta.env.VITE_API_PREGUNTAS;
const apiPreguntas = axios.create({
  baseURL: URL_PREGUNTAS,
});

apiPreguntas.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const leerPreguntasUsuarioAPI = async () => {
  try {
    const { data } = await apiPreguntas.get('/');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al leer las preguntas');
  }
};

export const obtenerPreguntaAPI = async (id) => {
  try {
    const { data } = await apiPreguntas.get(`/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al obtener la pregunta`);
  }
};

export const crearPreguntaAPI = async (preguntaNueva) => {
  try {
    const { data } = await apiPreguntas.post('/', preguntaNueva);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear la pregunta');
  }
};

export const editarPreguntaAPI = async (preguntaModificada, id) => {
  try {
    const { data, status } = await apiPreguntas.put(`/${id}`, preguntaModificada);
    return { data, status };
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al editar la pregunta`);
  }
};

export const eliminarPreguntaAPI = async (id) => {
  try {
    const { data, status } = await apiPreguntas.delete(`/${id}`);
    return { message: data.message || "Pregunta eliminada", status };
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al eliminar la pregunta`);
  }
};

export const obtenerNiveles = async () => {
  try {
    const { data } = await apiPreguntas.get('/niveles');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener los niveles");
  }
};

export const listarPreguntasPorNivelUsuario = async (nivel) => {
  try {
    if (!nivel) throw new Error('Nivel no especificado');
    const { data } = await apiPreguntas.get(`/nivel/${nivel}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Error al listar preguntas del nivel ${nivel}`);
  }
};