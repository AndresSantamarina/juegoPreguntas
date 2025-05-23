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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Borrar",
      cancelButtonText: "Salir",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const respuesta = await eliminarPreguntaAPI(pregunta._id);

          Swal.fire({
            title: "Pregunta eliminada!",
            text:
              respuesta.message || "La pregunta fue eliminada correctamente",
            icon: "success",
          });

          const preguntasActualizadas = await listarPreguntasPorNivelUsuario(
            nivel
          );
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

  return (
    <div className="my-5">
      <div className="cardContainer">
        <p className="fw-bold fs-4 text-center">{pregunta.pregunta}</p>
        <Container>
          <Row className="text-center justify-content-center align-items-stretch">
            {[
              pregunta.opcionUno,
              pregunta.opcionDos,
              pregunta.opcionTres,
              pregunta.opcionCorrecta,
            ].map((op, i) => (
              <Col key={i} className="my-3 col-sm-6 col-md-6">
                <div className="opcion h-100">
                  <p>
                    <span className="fw-bold">{i + 1}- </span>
                    {op}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-3">
            <Link
              className="btn btn-warning mx-2"
              to={`/preguntas/editar/${pregunta._id}`}
            >
              Editar
            </Link>
            <Button variant="danger" className="mx-2" onClick={borrarPregunta}>
              Eliminar
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default CardPreguntaEditDelete;
