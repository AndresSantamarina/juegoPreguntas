import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  eliminarPreguntaAPI,
  listarPreguntasPorNivelUsuario,
} from "../helpers/queries.js";

const CardPreguntaEditDelete = ({ pregunta, setPreguntas, nivel }) => {
  const borrarPregunta = () => {
    Swal.fire({
      title: "¿Estás seguro de eliminar la pregunta?",
      text: "No se puede revertir este proceso",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Borrar",
      cancelButtonText: "Salir",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const respuesta = await eliminarPreguntaAPI(pregunta._id);

          Swal.fire({
            title: "Pregunta eliminada!",
            text: respuesta.message || "La pregunta fue eliminada correctamente",
            icon: "success",
          });

          // Listar nuevamente con el nivel que se recibe como prop
          const preguntasActualizadas = await listarPreguntasPorNivelUsuario(nivel);
          setPreguntas(preguntasActualizadas);

        } catch (error) {
          Swal.fire({
            title: "Ocurrió un error",
            text: error.message || "La pregunta no pudo ser eliminada",
            icon: "error",
          });
        }
      }
    });
  };

  console.log("Pregunta ID:", pregunta._id);


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
