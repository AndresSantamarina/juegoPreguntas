import { Button, Container } from "react-bootstrap";
import CardPreguntaEditDelete from "../CardPreguntaEditDelete";
import { useNavigate, useParams } from "react-router-dom";
import { listarPreguntasPorNivel, obtenerNiveles } from "../../helpers/queries";
import { useEffect, useState } from "react";

const Preguntas = () => {
  const { nivel } = useParams();
  const navigate = useNavigate();

  const [preguntas, setPreguntas] = useState([]);
  const [niveles, setNiveles] = useState([]);

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

  return (
    <Container className="mainSection">
      <section className="my-5">
        <h1 className="text-center">Listado de preguntas</h1>
        <h4 className="text-center my-3">
          Editar o eliminar preguntas según el nivel
        </h4>
        {niveles.map((nivel) => (
          <Button
            className="btn btn-dark m-2"
            key={nivel}
            onClick={() => navigate(`/preguntas/${nivel}`)}
          >
            Nivel {nivel}
          </Button>
        ))}
      </section>
      <section className="my-5">
        {preguntas.map((pregunta) => (
          <CardPreguntaEditDelete
            key={pregunta._id}
            pregunta={pregunta}
            setPreguntas={setPreguntas}
          ></CardPreguntaEditDelete>
        ))}
      </section>
    </Container>
  );
};

export default Preguntas;
