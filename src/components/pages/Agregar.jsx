import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import CardPregunta from "../CardPregunta";

const Agregar = () => {
  return (
    <Container className="mainSection">
      <h1 className="text-center my-5">Configurar el juego</h1>
      <section>
        <h3 className="my-3">Agregar preguntas</h3>
        <div className="d-flex justify-content-center my-5">
          <Form className="w-50">
          <Form.Select aria-label="Default select example">
            <option>Seleccione el nivel al que quiere agregar la pregunta</option>
            <option value="1">Uno</option>
            <option value="2">Dos</option>
            <option value="3">Tres</option>
            <option value="4">Cuatro</option>
            <option value="5">Cinco</option>
            <option value="6">Seis</option>
            <option value="7">Siete</option>
            <option value="8">Ocho</option>
            <option value="9">Nueve</option>
            <option value="10">Diez</option>
          </Form.Select>
            <Form.Group className="mb-3" controlId="formPregunta">
              <Form.Label>Pregunta</Form.Label>
              <Form.Control type="text" placeholder="Ingrese una pregunta" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formOpcionUno">
              <Form.Label>Opción 1</Form.Label>
              <Form.Control type="text" placeholder="Opción uno" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formOpcionDos">
              <Form.Label>Opción 2</Form.Label>
              <Form.Control type="text" placeholder="Opción dos" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formOpcionTres">
              <Form.Label>Opción 3</Form.Label>
              <Form.Control type="text" placeholder="Opción tres" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formOpcionCorrecta">
              <Form.Label>Opción Correcta</Form.Label>
              <Form.Control type="text" placeholder="Opción correcta" />
            </Form.Group>
            <div className="text-center">
              <Button variant="primary" type="submit">
                Agregar
              </Button>
            </div>
          </Form>
        </div>
      </section>
      <section>
        <CardPregunta></CardPregunta>
        <CardPregunta></CardPregunta>
        <CardPregunta></CardPregunta>
      </section>
    </Container>
  );
};

export default Agregar;
