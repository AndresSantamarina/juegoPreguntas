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

  useEffect(() => {
    listarPreguntas();
  }, [nivel]);

  useEffect(() => {
    cargarNiveles();
  }, [nivel]);

  const listarPreguntas = async () => {
    try {
      const respuesta = await listarPreguntasPorNivel(nivel);
      setPreguntas(respuesta);
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
      // Reproducir sonido de respuesta correcta
      const audioCorrecto = new Audio(winSound);
      audioCorrecto.play();
    } else {
      // Reproducir sonido de respuesta incorrecta
      const audioIncorrecto = new Audio(loseSound);
      audioIncorrecto.play();
    }
  };

  return (
    <Container className="mainSection">
      <section className="my-5">
        <h1 className="text-center my-3">Juego</h1>
        <h4 className="text-center my-3">
          Elija el nivel en el que quiere jugar
        </h4>
        {niveles.map((nivel) => (
          <Button
            className="btn btn-dark m-2"
            key={nivel}
            onClick={() => navigate(`/jugar/${nivel}`)}
          >
            Nivel {nivel}
          </Button>
        ))}
        <section>
          {preguntas.map((pregunta, index) => (
            <CardPregunta
              key={pregunta._id}
              pregunta={pregunta}
              respuestaCorrecta={respuestaCorrecta === index ? index : null}
              onSelectOption={(opcion) => handleSelectOption(opcion, index)}
            ></CardPregunta>
          ))}
        </section>
      </section>
    </Container>
  );
};

export default Jugar;
