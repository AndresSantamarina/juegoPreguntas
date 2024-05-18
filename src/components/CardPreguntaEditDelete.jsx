import { Button, Col, Container, Row } from "react-bootstrap";

const CardPreguntaEditDelete = () => {
    return (
        <div className="my-5">
        <div className="cardContainer">
          <p>¿Pregunta de prueba?</p>
          <Container>
            <Row className="text-center">
              <Col>
                <p>Respuesta uno</p>
              </Col>
              <Col>
                <p>Respuesta dos</p>
              </Col>
              <Col>
                <p>Respuesta tres</p>
              </Col>
              <Col>
                <p>Respuesta cuatro</p>
              </Col>
            </Row>
            <div className="text-center">
            <Button className="m-2" variant="warning">Editar</Button>
            <Button className="m-2" variant="danger">Eliminar</Button>
            </div>
           
          </Container>
        </div>
      </div>
    );
};

export default CardPreguntaEditDelete;