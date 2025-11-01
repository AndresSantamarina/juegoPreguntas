import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Alert,
} from "react-bootstrap";
import { Clipboard, PersonFill, ArrowRightCircle } from "react-bootstrap-icons";

const LobbyView = ({
  gameState,
  roomId,
  user,
  isHost,
  canStartGame,
  handleCopyRoomId,
  handleStartGame,
  handleCancelGame,
}) => {
  const hostPlayer = gameState.players.find((p) => p.isHost);

  return (
    <Container className="mainSection py-5">
      <h1 className="text-center mb-4 text-primary fw-bold">
        Sala de Espera: {roomId}
      </h1>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-primary rounded-4">
            <Card.Header className="bg-primary text-white text-center fw-bold fs-4">
              Invitá a tus amigos
              <Button
                variant="outline-light"
                size="sm"
                className="ms-3"
                onClick={handleCopyRoomId}
              >
                <Clipboard size={18} />
              </Button>
            </Card.Header>
            <Card.Body>
              <h5 className="text-center mb-3 text-secondary">
                Jugadores Conectados: ({gameState.players.length} / Mínimo: 3)
              </h5>

              <ListGroup className="mb-4">
                {gameState.players.map((p) => (
                  <ListGroup.Item
                    key={p.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <PersonFill size={20} className="me-2 text-primary" />
                    <span className="fw-bold">
                      {p.name} {p.id === user?.id && "(Tú)"}
                    </span>
                    {p.isHost && (
                      <span className="badge bg-success">Anfitrión</span>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="d-grid gap-2">
                {isHost ? (
                  <>
                    <Button
                      variant="success"
                      size="lg"
                      onClick={handleStartGame}
                      disabled={!canStartGame}
                      className="fw-bold py-2 shadow"
                    >
                      <ArrowRightCircle size={20} className="me-2" />
                      {canStartGame
                        ? "Comenzar Partida"
                        : `Faltan ${3 - gameState.players.length} jugadores...`}
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={handleCancelGame}
                      className="py-2"
                    >
                      Cancelar Sala
                    </Button>
                  </>
                ) : (
                  <Alert variant="info" className="text-center">
                    Esperando a que el Anfitrión ({hostPlayer?.name || "..."})
                    inicie el juego.
                  </Alert>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LobbyView;
