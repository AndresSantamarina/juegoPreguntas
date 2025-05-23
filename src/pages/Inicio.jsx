import { Container } from "react-bootstrap";
import imgPregunta from "../assets/question-mark.png";

const Inicio = () => {
  return (
    <Container className="mainSection">
      <h1 className="text-center mt-5">BIENVENIDO!</h1>
      <section className="text-center my-5">
        <p>
          ¡Bienvenido al <span className="fw-bold">Juego de Preguntas</span>!
          Aquí podrás disfrutar de un emocionante juego en donde tendrás que
          elegir la respuesta correcta.
        </p>
        <p>
          ¡Demuestra tus conocimientos y desafía a tus amigos para ver quién es
          el mejor!
        </p>
        <h2 className="mt-5">QUE TE DIVIERTAS!</h2>
        <div className="text-center my-3">
          <img
            src={imgPregunta}
            alt="signo de pregunta"
            className="img-fluid"
          />
        </div>
      </section>
    </Container>
  );
};

export default Inicio;
