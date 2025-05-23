import axios from "axios";

const URL_Preguntas = import.meta.env.VITE_API_PREGUNTAS;

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.error("No se encontró token en sessionStorage");
    throw new Error("No autenticado");
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const leerPreguntasUsuarioAPI = async () => {
    try {
        const respuesta = await fetch(`${URL_Preguntas}`, {
            headers: getAuthHeaders()
        });
        if (!respuesta.ok) throw new Error('Error al leer las preguntas del usuario');
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const obtenerPreguntaAPI = async (id) => {
    try {
        const token = sessionStorage.getItem('token');
        const respuesta = await fetch(`${URL_Preguntas}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!respuesta.ok) throw new Error(`Error al obtener la pregunta con id ${id}`);
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const crearPreguntaAPI = async (preguntaNueva) => {
    try {
        const token = sessionStorage.getItem('token');
        
        const respuesta = await fetch(URL_Preguntas, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(preguntaNueva)
        });

        const data = await respuesta.json();
        
        if (!respuesta.ok) {
            throw new Error(data.message || 'Error al crear la pregunta');
        }
        
        return data;
    } catch (error) {
        console.error("Error en crearPreguntaAPI:", error);
        throw error;
    }
};

export const editarPreguntaAPI = async (preguntaModificada, id) => {
  try {
    const respuesta = await fetch(`${URL_Preguntas}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(preguntaModificada)
    });
    if (!respuesta.ok) throw new Error(`Error al editar la pregunta con id ${id}`);
    return respuesta; 
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const eliminarPreguntaAPI = async (id) => {
  try {
    const token = sessionStorage.getItem("token");

    const respuesta = await fetch(`${URL_Preguntas}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!respuesta.ok) {
      let errorMsg = `Error al eliminar la pregunta con id ${id}`;
      try {
        const errorData = await respuesta.json();
        errorMsg = errorData.message || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }

    if (respuesta.status === 204) return { message: "Pregunta eliminada correctamente", status: 204 };

    return await respuesta.json();

  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const obtenerNiveles = async () => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.get(`${URL_Preguntas}/niveles`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error en obtenerNiveles:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(error.response?.data?.message || "Error al obtener los niveles");
  }
};

export const listarPreguntasPorNivelUsuario = async (nivel) => {
    try {
        if (!nivel) throw new Error('Nivel no especificado');
        
        const respuesta = await fetch(`${URL_Preguntas}/nivel/${nivel}`, {
            headers: getAuthHeaders()
        });
        
        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(errorData.message || `Error al listar preguntas del nivel ${nivel}`);
        }
        
        return await respuesta.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};