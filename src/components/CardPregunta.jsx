import { Button, Col, Container, Row } from "react-bootstrap";

const CardPregunta = ({pregunta}) => {
  return (
    <div className="my-5">
      <div className="cardContainer">
        <p>{pregunta.pregunta}</p>
        <Container>
          <Row className="text-center">
            <Col>
              <p>{pregunta.opcionUno}</p>
              <Button variant="success">Elegir</Button>
            </Col>
            <Col>
              <p>{pregunta.opcionDos}</p>
              <Button variant="success">Elegir</Button>
            </Col>
            <Col>
              <p>{pregunta.opcionTres}</p>
              <Button variant="success">Elegir</Button>
            </Col>
            <Col>
              <p>{pregunta.opcionCorrecta}</p>
              <Button variant="success">Elegir</Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default CardPregunta;
