import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

const CardPregunta = ({ pregunta, respuestaCorrecta, onSelectOption }) => {
  const [opciones, setOpciones] = useState([]);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [opcionIncorrectaSeleccionada, setOpcionIncorrectaSeleccionada] =
    useState(false);

  useEffect(() => {
    setOpciones(shuffleOptions());
  }, [pregunta]);

  const shuffleOptions = () => {
    const opcionesArray = [
      { text: pregunta.opcionUno, correcta: false },
      { text: pregunta.opcionDos, correcta: false },
      { text: pregunta.opcionTres, correcta: false },
      { text: pregunta.opcionCorrecta, correcta: true },
    ];
    return opcionesArray.sort(() => Math.random() - 0.5);
  };

  const handleSelectOption = (opcion) => {
    setOpcionSeleccionada(opcion);
    onSelectOption(opcion);
    if (!opcion.correcta) {
      setOpcionIncorrectaSeleccionada(true);
    }
  };

  const getButtonVariant = (opcion) => {
    if (opcionSeleccionada !== null) {
      if (opcion.correcta) {
        return "success";
      } else if (
        opcionIncorrectaSeleccionada &&
        opcion === opcionSeleccionada
      ) {
        return "danger";
      }
    }
    return "dark";
  };

  return (
    <div className="my-5">
      <div className="cardContainer">
        <p className="fw-bold fs-4 text-center">{pregunta.pregunta}</p>
        <Container>
          <Row className="text-center justify-content-center align-items-stretch">
            {opciones.map((opcion, index) => (
              <Col key={index} className="my-3 col-sm-6 col-md-6">
                <div className="opcion h-100 d-flex flex-column justify-content-between">
                  <p>
                    <span className="fw-bold">{index + 1 + ")"}</span>{" "}
                    {opcion.text}
                  </p>
                  <Button
                    variant={getButtonVariant(opcion)}
                    onClick={() => handleSelectOption(opcion, index)}
                  >
                    Elegir
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default CardPregunta;
