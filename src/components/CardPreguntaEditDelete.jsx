import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  eliminarPreguntaAPI,
  listarPreguntasPorNivel,
} from "../helpers/queries";

const CardPreguntaEditDelete = ({ pregunta, setPreguntas }) => {
  const borrarPregunta = () => {
    Swal.fire({
      title: "Estás seguro de eliminar la pregunta?",
      text: "No se puede revertir este proceso",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Borrar",
      cancelButtonText: "Salir",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const respuesta = await eliminarPreguntaAPI(pregunta._id);
        if (respuesta.status === 200) {
          Swal.fire({
            title: "Pregunta eliminada!",
            text: `La pregunta fue eliminada correctamente`,
            icon: "success",
          });
          const listarPreguntas = await listarPreguntasPorNivel();
          setPreguntas(listarPreguntas);
        } else {
          Swal.fire({
            title: "Ocurrió un error",
            text: `La pregunta no pudo ser eliminada`,
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div className="my-5">
      <div className="cardContainer">
        <p className="fw-bold">{pregunta.pregunta}</p>
        <Container>
          <Row className="text-center justify-content-center align-content-center">
            <Col className="my-4 h-100 col-6">
              <p><span className="fw-bold">1- </span>{pregunta.opcionUno}</p>
            </Col>
            <Col className="my-4 h-100 col-6">
              <p><span className="fw-bold">2- </span>{pregunta.opcionDos}</p>
            </Col>
            <Col className="my-4 h-100 col-6">
              <p><span className="fw-bold">3- </span>{pregunta.opcionTres}</p>
            </Col>
            <Col className="my-4 h-100 col-6">
              <p><span className="fw-bold">4- </span>{pregunta.opcionCorrecta}</p>
            </Col>
          </Row>
          <div className="text-center">
            <Link
              className="m-2 btn btn-warning"
              to={"/preguntas/editar/" + pregunta._id}
            >
              Editar
            </Link>
            <Button className="m-2" variant="danger" onClick={borrarPregunta}>
              Eliminar
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default CardPreguntaEditDelete;
