const URL_Preguntas = import.meta.env.VITE_API_PREGUNTAS;
const URL_Pregunta = import.meta.env.VITE_API_PREGUNTA_INDIVIDUAL;

export const leerPreguntasAPI = async () => {
    try {
        const respuesta = await fetch(URL_Preguntas, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!respuesta.ok) {
            throw new Error('Error al leer las preguntas');
        }
        return respuesta;
    } catch (error) {
        console.error(error);
    }
}

export const obtenerPreguntaAPI = async (id) => {
    try {
        const respuesta = await fetch(`${URL_Pregunta}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!respuesta.ok) {
            throw new Error(`Error al obtener la pregunta con id ${id}`);
        }
        return respuesta
    } catch (error) {
        console.error(error);
    }
}

export const crearPreguntaAPI = async (preguntaNueva) => {
    try {
        const respuesta = await fetch(URL_Preguntas, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(preguntaNueva)
        })
        return respuesta
    } catch (error) {
        console.error(error)
    }
}

export const editarPreguntaAPI = async (preguntaModificada, id) => {
    try {
        const respuesta = await fetch(`${URL_Pregunta}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(preguntaModificada)
        })
        return respuesta
    } catch (error) {
        console.error(error)
    }
}

export const eliminarPreguntaAPI = async (id) => {
    try {
        const respuesta = await fetch(`${URL_Pregunta}/${id}`, {
            method: "DELETE"
        })
        return respuesta
    } catch (error) {
        console.error(error)
    }
}

export const obtenerNiveles = async () => {
    try {
        const respuesta = await fetch(`${URL_Preguntas}/niveles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!respuesta.ok) {
            throw new Error('Error al obtener los niveles');
        }
        const listaNiveles = await respuesta.json();
        return listaNiveles;
    } catch (error) {
        console.error(error);
    }
}

export const listarPreguntasPorNivel = async (nivel) => {
    try {
        const respuesta = await fetch(`${URL_Preguntas}/nivel/${nivel}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!respuesta.ok) {
            throw new Error(`Error al listar preguntas del nivel ${nivel}`);
        }
        return await respuesta.json()
    } catch (error) {
        console.error(error);
    }
}