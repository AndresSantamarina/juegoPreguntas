import { Button, Col, Container, Row } from "react-bootstrap";

const CardPregunta = () => {
  return (
    <div className="my-5">
      <div className="cardContainer">
        <p>¿Pregunta de prueba?</p>
        <Container>
          <Row className="text-center">
            <Col>
              <p>Respuesta uno</p>
              <Button variant="success">Elegir</Button>
            </Col>
            <Col>
              <p>Respuesta dos</p>
              <Button variant="success">Elegir</Button>
            </Col>
            <Col>
              <p>Respuesta tres</p>
              <Button variant="success">Elegir</Button>
            </Col>
            <Col>
              <p>Respuesta cuatro</p>
              <Button variant="success">Elegir</Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default CardPregunta;
