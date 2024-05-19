import { Button, Container } from "react-bootstrap";
import CardPregunta from "../CardPregunta";
import { useNavigate, useParams } from "react-router-dom";
import { listarPreguntasPorNivel, obtenerNiveles } from "../../helpers/queries";
import { useEffect, useState } from "react";
import winSound from "../../assets/win.mp3";
import loseSound from "../../assets/lose.mp3";

const Jugar = () => {
  const { nivel } = useParams();
  const navigate = useNavigate();

  const [preguntas, setPreguntas] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(null);
  const [mostrarLoader, setMostrarLoader] = useState(true);
  const [nivelSeleccionado, setNivelSeleccionado] = useState(false);

  useEffect(() => {
    listarPreguntas();
  }, [nivel]);

  useEffect(() => {
    cargarNiveles();
  }, [nivel]);

  const listarPreguntas = async () => {
    try {
      setMostrarLoader(true);
      const respuesta = await listarPreguntasPorNivel(nivel);
      setPreguntas(respuesta);
      setMostrarLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarNiveles = async () => {
    try {
      const respuesta = await obtenerNiveles();
      setNiveles(respuesta);
    } catch (error) {
      console.error(error);
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
            key={pregunta._id}
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
