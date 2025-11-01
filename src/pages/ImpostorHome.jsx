import { useState } from "react";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const ImpostorHome = () => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  // --- Lógica para CREAR PARTIDA ---
  const handleCreateRoom = async (categoryName) => {
    if (!isConnected) {
      Swal.fire("Error", "No conectado al servidor de juego.", "error");
      return;
    }
    setLoading(true);

    socket.emit(
      "createRoom",
      {
        categoryName: categoryName,
      },
      (response) => {
        setLoading(false);
        if (response.success) {
          Swal.fire("Sala Creada", `ID: ${response.roomId}`, "success");
          navigate(`/impostor/room/${response.roomId}`);
        } else {
          Swal.fire(
            "Error",
            response.message || "No se pudo crear la sala.",
            "error"
          );
        }
      }
    );
  };

  // --- Lógica para UNIRSE a PARTIDA ---
  const handleJoinRoom = async (data) => {
    const { roomId } = data;

    if (!isConnected) {
      Swal.fire("Error", "No conectado al servidor de juego.", "error");
      return;
    }
    setLoading(true);

    socket.emit(
      "joinRoom",
      {
        roomId: roomId,
      },
      (response) => {
        setLoading(false);
        if (response.success) {
          navigate(`/impostor/room/${response.roomId}`);
        } else {
          Swal.fire(
            "Error",
            response.message || "No se pudo unir a la sala.",
            "error"
          );
        }
      }
    );
  };

  return (
    <Container className="mainSection my-5">
      <h1 className="text-center mb-4">
        El Impostor: El Juego de las Palabras
      </h1>

      <Card className="shadow-lg p-4 mb-5">
        <Card.Title className="text-center h3 mb-4">
          Reglas del Juego
        </Card.Title>
        <div className="text-start">
          <p>
            <strong>Objetivo:</strong> Descubrir quién es el Impostor (o si eres
            el Impostor, evitar ser descubierto).
          </p>
          <ul>
            <li>
              Cada jugador, excepto uno, recibirá la misma **Palabra Clave**.
            </li>
            <li>El **Impostor** no recibe ninguna palabra clave.</li>
            <li>
              Por turnos, cada jugador dirá una **palabra de una sola palabra**
              que esté relacionada con la Palabra Clave.
            </li>
            <li>
              Los jugadores "normales" deben decir una palabra que demuestre que
              conocen la clave sin ser demasiado obvios.
            </li>
            <li>
              El Impostor debe improvisar una palabra relacionada para mezclarse
              con el resto.
            </li>
            <li>
              Si un jugador dice una palabra que no tiene relación o parece
              sospechosa, puede ser votado.
            </li>
            <li>
              El juego termina cuando el Impostor es descubierto o cuando los
              jugadores "normales" pierden todas sus vidas por votar
              incorrectamente o se les acaba el tiempo.
            </li>
          </ul>
        </div>
      </Card>

      <Row className="g-4">
        {/* Componente Crear Partida */}
        <Col md={6}>
          <Card className="h-100 shadow-sm border-success">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center p-4">
              <Card.Title className="h4">Crear Partida Nueva</Card.Title>
              <Card.Text className="text-center mb-4">
                Sé el anfitrión y genera un ID de sala único para invitar a tus
                amigos.
              </Card.Text>
              <Button
                variant="success"
                onClick={() => handleCreateRoom("random")}
                disabled={!user || loading || !isConnected}
                className="w-75 fw-bold"
              >
                {loading ? "Creando..." : "Crear Partida"}
              </Button>
              {!isConnected && (
                <small className="text-danger mt-2">
                  Conectando al servidor...
                </small>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Componente Unirse a Partida */}
        <Col md={6}>
          <Card className="h-100 shadow-sm border-primary">
            <Card.Body className="p-4">
              <Card.Title className="h4 text-center">
                Unirse a Partida
              </Card.Title>
              <Form onSubmit={handleSubmit(handleJoinRoom)}>
                <Form.Group className="mb-3">
                  <Form.Label>Ingresa el ID de la Sala</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: A1B2C3"
                    {...register("roomId", {
                      required: "El ID de la sala es obligatorio",
                      pattern: {
                        value: /^[A-Z]{4}$/,
                        message: "El ID debe ser de 4 letras mayúsculas.",
                      },
                    })}
                    isInvalid={!!errors.roomId}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.roomId?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={!user || loading || !isConnected}
                  className="w-100 fw-bold"
                >
                  {loading ? "Uniéndose..." : "Unirse a Partida"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center mt-5">
        <p className="text-muted">
          Estado del Servidor: {isConnected ? "Conectado" : "Desconectado"}
        </p>
        {!user && (
          <p className="text-warning fw-bold">
            ¡Recuerda iniciar sesión para jugar!
          </p>
        )}
      </div>
    </Container>
  );
};

export default ImpostorHome;
