import React from "react";
import { Container } from "react-bootstrap";

const Inicio = () => {
  return (
    <Container className="mainSection">
      <h1 className="text-center mt-5">Bienvenido!</h1>
      <section className="text-center my-5">
        <p>Se pueden agregar, editar y eliminar las preguntas que quieras.</p>
        <h2 className="mt-5">Que te diviertas!</h2>
      </section>
    </Container>
  );
};

export default Inicio;
