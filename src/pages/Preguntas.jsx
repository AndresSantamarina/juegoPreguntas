import { Button, Container } from "react-bootstrap";
import CardPreguntaEditDelete from "../components/CardPreguntaEditDelete";
import { useNavigate, useParams } from "react-router-dom";
import { listarPreguntasPorNivelUsuario, obtenerNiveles } from "../helpers/queries";
import { useEffect, useState } from "react";

const Preguntas = () => {
  const { nivel } = useParams();
  const navigate = useNavigate();

  const [preguntas, setPreguntas] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [mostrarLoader, setMostrarLoader] = useState(true);
  const [nivelSeleccionado, setNivelSeleccionado] = useState(false);

 useEffect(() => {
  if (nivel) {
    listarPreguntas();
    setNivelSeleccionado(true);
  } else {
    setPreguntas([]);           // limpiar preguntas
    setNivelSeleccionado(false);
    setMostrarLoader(false);    // ya no muestres loader porque no hay nivel
  }
}, [nivel]);

  useEffect(() => {
    cargarNiveles();
  }, [nivel]);

 const listarPreguntas = async () => {
  if (!nivel) return;  // no llamar sin nivel

  try {
    setMostrarLoader(true);
    const respuesta = await listarPreguntasPorNivelUsuario(nivel);
    setPreguntas(respuesta);
  } catch (error) {
    console.error(error);
    setPreguntas([]);  // limpiar si falla
  } finally {
    setMostrarLoader(false);
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

  const mostrarComponente = mostrarLoader ? (
    <div className="text-center m-5 p-3">
      <span className="loader"></span>
    </div>
  ) : nivelSeleccionado ? (
    preguntas.length === 0 ? (
      <p className="text-center lead">No hay preguntas en este nivel.</p>
    ) : (
      <section className="my-5">
        {preguntas.map((pregunta) => (
          <CardPreguntaEditDelete
            key={pregunta.id}
            pregunta={pregunta}
            setPreguntas={setPreguntas}
            nivel={nivel}
          ></CardPreguntaEditDelete>
        ))}
      </section>
    )
  ) : (
    <p className="text-center lead">Por favor, seleccione un nivel.</p>
  );

  return (
    <Container className="mainSection">
      <section className="my-5">
        <h1 className="text-center my-5">LISTADO</h1>
        <h4 className="text-center my-3">Editar o eliminar preguntas</h4>
        <article className="my-5 text-center">
          {niveles.map((nivel) => (
            <Button
              className="btn btn-dark m-2"
              key={nivel}
              onClick={() => {
                navigate(`/preguntas/${nivel}`);
                setNivelSeleccionado(true);
              }}
            >
              Nivel {nivel}
            </Button>
          ))}
        </article>
      </section>
      {mostrarComponente}
    </Container>
  );
};

export default Preguntas;
