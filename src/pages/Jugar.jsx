import { Button, Container } from "react-bootstrap";
import CardPregunta from "../components/CardPregunta";
import { useNavigate, useParams } from "react-router-dom";
import {
  listarPreguntasPorNivelUsuario,
  obtenerNiveles,
} from "../helpers/queries.js";
import { useEffect, useState } from "react";
import winSound from "../assets/win.mp3";
import loseSound from "../assets/lose.mp3";
import { useAuth } from "../../src/context/AuthContext.jsx";
import Swal from "sweetalert2";

const Jugar = () => {
  const { nivel: nivelParam } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [preguntas, setPreguntas] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(null);
  const [mostrarLoader, setMostrarLoader] = useState(true);
  const [nivelSeleccionado, setNivelSeleccionado] = useState(!!nivelParam);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setMostrarLoader(true);

        if (!user?.id) {
          throw new Error("Por favor inicia sesión");
        }

        const [nivelesData, preguntasData] = await Promise.all([
          obtenerNiveles(),
          nivelParam
            ? listarPreguntasPorNivelUsuario(nivelParam)
            : Promise.resolve([]),
        ]);

        setNiveles(nivelesData);
        if (nivelParam) setPreguntas(preguntasData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        if (
          error.message.includes("401") ||
          error.message.includes("autenticado")
        ) {
          Swal.fire({
            title: "Sesión expirada",
            text: "Por favor, inicia sesión nuevamente",
            icon: "warning",
          });
          navigate("/login");
        } else {
          Swal.fire({
            title: "Error",
            text: error.message || "Error al cargar datos",
            icon: "error",
          });
        }
        setNiveles([]);
        setPreguntas([]);
      } finally {
        setMostrarLoader(false);
      }
    };

    cargarDatos();
  }, [nivelParam, user?.id]);

  const listarPreguntas = async (nivel) => {
    try {
      setMostrarLoader(true);

      if (!user || !user.id) {
        throw new Error("Usuario no autenticado");
      }

      if (!nivel) {
        throw new Error("Nivel no especificado");
      }

      const respuesta = await listarPreguntasPorNivelUsuario(nivel);
      setPreguntas(respuesta);
    } catch (error) {
      console.error("Error al listar preguntas:", error);
      if (error.message.includes("401")) {
        Swal.fire({
          title: "Sesión expirada",
          text: "Por favor, inicia sesión nuevamente",
          icon: "warning",
        });
        navigate("/login");
      } else {
        setPreguntas([]);
      }
    } finally {
      setMostrarLoader(false);
    }
  };

  const cargarNiveles = async () => {
    try {
      if (!user || !user.id) return;

      const respuesta = await obtenerNiveles();
      setNiveles(respuesta);
    } catch (error) {
      console.error("Error al cargar niveles:", error);
      setNiveles([]);
    }
  };

  const handleSelectOption = (opcion, index) => {
    if (opcion.correcta) {
      setRespuestaCorrecta(index);
      const audioCorrecto = new Audio(winSound);
      audioCorrecto.play();
    } else {
      const audioIncorrecto = new Audio(loseSound);
      audioIncorrecto.play();
    }
  };

  const mostrarComponente = mostrarLoader ? (
    <div className="text-center m-5 p-5">
      <span className="loader"></span>
    </div>
  ) : nivelSeleccionado ? (
    preguntas.length === 0 ? (
      <p className="text-center lead">No hay preguntas en este nivel.</p>
    ) : (
      <section className="my-5">
        {preguntas.map((pregunta, index) => (
          <CardPregunta
            key={pregunta.id}
            pregunta={pregunta}
            respuestaCorrecta={respuestaCorrecta === index ? index : null}
            onSelectOption={(opcion) => handleSelectOption(opcion, index)}
          ></CardPregunta>
        ))}
      </section>
    )
  ) : (
    <p className="text-center lead">Por favor, seleccione un nivel.</p>
  );

  return (
    <Container className="mainSection">
      <section className="my-5">
        <h1 className="text-center my-5">JUGAR</h1>
        <h4 className="text-center my-3">
          Elija el nivel en el que quiere jugar
        </h4>
        <article className="my-5 text-center">
          {niveles.map((nivel) => (
            <Button
              className="btn btn-dark m-2"
              key={nivel}
              onClick={() => {
                navigate(`/jugar/${nivel}`);
                setNivelSeleccionado(true);
              }}
            >
              Nivel {nivel}
            </Button>
          ))}
        </article>
      </section>
      {mostrarComponente}
    </Container>
  );
};

export default Jugar;
