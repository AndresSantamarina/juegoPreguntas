// src/components/impostor/GamePhaseView.jsxasdasd
import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
  Alert,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import {
  HeartFill,
  ClockFill,
  XCircleFill,
  Person,
} from "react-bootstrap-icons";

const GamePhaseView = ({
  gameState,
  user,
  playerState,
  remainingTime,
  maxTimeSeconds,
  isInGame,
  isVoting,
  isImpostorChoosing,
  currentTurnPlayer,
  isMyTurn,
  handleVote, // Función de emisión
  handleImpostorTarget, // Función de emisión
  handleSubmitClue,
  onSubmitClue,
  registerClue,
  errorsClue,
  myVoteTarget,
  impostorTarget,
}) => {
  const isAlive = playerState?.isAlive ?? true;
  const myLives = playerState?.lives ?? 3;

  // Variables calculadas de rol y palabras
  const isMyKeyword =
    gameState.myRole === "INNOCENT" ? gameState.myKeyword : null;
  const displayedWords = gameState.words.map((word) => ({
    word: word,
    isKeyword: word === isMyKeyword,
  }));

  return (
    <Container className="mainSection py-4">
      <h1 className="text-center mb-4 fw-bold text-danger">
        IMPOSTOR:
        {isInGame && " Fase de Pistas 🗣️"}
        {isVoting && " Fase de Votación 🗳️"}
        {isImpostorChoosing && " Fase de Ataque 🔪"}
      </h1>

      <Row className="mb-4">
        <Col md={12} lg={4}>
          <Card
            className={`shadow-lg border-${
              gameState.myRole === "IMPOSTOR" ? "danger" : "success"
            } mb-3`}
          >
            <Card.Header
              className={`text-white bg-${
                gameState.myRole === "IMPOSTOR" ? "danger" : "success"
              } fw-bold`}
            >
              Tu Rol:{" "}
              {gameState.myRole === "IMPOSTOR"
                ? "🔴 EL IMPOSTOR"
                : "🟢 INOCENTE"}
            </Card.Header>
            <Card.Body>
              <h5 className="mb-3">
                {gameState.myRole === "IMPOSTOR" ? (
                  <>
                    <span className="text-danger fw-bold">
                      Tu objetivo es descubrir la palabra clave de los
                      Inocentes.
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-success fw-bold">
                      Tu palabra clave está{" "}
                      {isMyKeyword ? "resaltada en verde" : "por ser asignada"}{" "}
                      en el tablero.
                    </span>
                  </>
                )}
              </h5>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">
                  <HeartFill size={20} className="text-danger me-1" /> Vidas
                  Restantes:
                </span>
                <div>
                  {[...Array(3)].map((_, i) => (
                    <HeartFill
                      key={i}
                      size={24}
                      className={`mx-1 ${
                        i < myLives
                          ? "text-danger"
                          : "text-secondary opacity-50"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {!isAlive && (
                <Alert variant="danger" className="text-center mt-3 fw-bold">
                  <XCircleFill size={20} className="me-2" /> ¡Eliminado! Estás
                  fuera de la partida.
                </Alert>
              )}
            </Card.Body>
          </Card>
          <Card className="shadow mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold text-primary">
                  <ClockFill size={20} className="me-2" />
                  Tiempo: {remainingTime}s
                </span>
                <span className="fw-bold text-dark">
                  <Person size={20} className="me-2" />
                  Ronda: {gameState.currentRound}
                </span>
              </div>
              <ProgressBar
                now={remainingTime}
                max={maxTimeSeconds}
                variant={remainingTime < 10 ? "danger" : "primary"}
                animated={isInGame}
              />
              {isInGame && (
                <p className="mt-2 text-center">
                  Turno de:
                  <span
                    className={`fw-bold ms-1 text-${
                      isMyTurn ? "danger" : "dark"
                    }`}
                  >
                    {currentTurnPlayer?.name || "Esperando..."}
                  </span>
                </p>
              )}
              {isVoting && (
                <Alert variant="info" className="text-center mt-2">
                  ¡VOTA AHORA! Elige al Impostor del tablero de la derecha.
                </Alert>
              )}
            </Card.Body>
          </Card>
          {isInGame && (
            <Card className="shadow border-info mb-3">
              <Card.Body>
                <Card.Title className="text-info">Tu Pista</Card.Title>
                {playerState?.clueGiven ? (
                  <Alert variant="success" className="text-center">
                    Pista enviada:{" "}
                    <span className="fw-bold">{playerState.clueGiven}</span>.
                    Esperando a los demás.
                  </Alert>
                ) : (
                  <Form onSubmit={handleSubmitClue(onSubmitClue)}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Ingresa tu pista (una sola palabra)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ej: Estrella"
                        {...registerClue("clue", {
                          required: "La pista es obligatoria",
                          pattern: {
                            value: /^\S+$/,
                            message: "Debe ser una sola palabra",
                          },
                          maxLength: {
                            value: 15,
                            message: "Máximo 15 caracteres",
                          },
                        })}
                        isInvalid={!!errorsClue.clue}
                        disabled={
                          !isMyTurn || playerState?.clueGiven || !isAlive
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errorsClue.clue?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Button
                      variant="info"
                      type="submit"
                      className="w-100 fw-bold"
                      disabled={!isMyTurn || playerState?.clueGiven || !isAlive}
                    >
                      Enviar Pista
                    </Button>
                    {!isMyTurn && !playerState?.clueGiven && isAlive && (
                      <Alert variant="light" className="text-center mt-2">
                        Espera tu turno para enviar la pista.
                      </Alert>
                    )}
                  </Form>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col md={12} lg={8}>
          <Card className="shadow-lg mb-4">
            <Card.Header className="bg-light fw-bold text-center">
              Tablero de Palabras ({gameState.words.length})
            </Card.Header>
            <Card.Body>
              <Row className="g-2">
                {displayedWords.map((item, index) => (
                  <Col xs={6} sm={4} lg={3} key={index}>
                    <div
                      className={`p-3 border rounded text-center fw-bold shadow-sm h-100 
                                       ${
                                         item.isKeyword
                                           ? "bg-success text-white border-success"
                                           : "bg-light text-dark border-secondary"
                                       }`}
                      style={{ minHeight: "80px" }}
                    >
                      {item.word}
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-lg">
            <Card.Header className="bg-secondary text-white fw-bold text-center">
              {isVoting
                ? "Vota por el Impostor"
                : isImpostorChoosing
                ? "El Impostor Elige Víctima 🔪"
                : "Pistas de la Ronda Actual"}
            </Card.Header>
            <Card.Body>
              {isVoting ? (
                <ListGroup>
                  {gameState.players
                    .filter((p) => p.isAlive)
                    .map((p) => {
                      const isTarget = myVoteTarget === p.id;
                      const isDisabled =
                        myVoteTarget !== null ||
                        p.id === user?.id ||
                        !isVoting ||
                        !isAlive;

                      return (
                        <ListGroup.Item
                          key={p.id}
                          action
                          onClick={() => handleVote(p.id)}
                          active={isTarget}
                          disabled={isDisabled}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <span className="fw-bold">
                            {p.name} {p.id === user?.id && "(Tú)"}
                          </span>
                          <div>
                            {p.vote && (
                              <span className="badge bg-warning text-dark me-2">
                                Votó
                              </span>
                            )}
                            {isTarget && (
                              <span className="badge bg-danger">Tu Voto</span>
                            )}
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                  <Alert variant="warning" className="mt-3 text-center">
                    {myVoteTarget
                      ? "Voto enviado. Esperando a los demás..."
                      : "Elige al jugador que crees que es el Impostor."}
                  </Alert>
                </ListGroup>
              ) : isImpostorChoosing ? (
                <ListGroup>
                  {gameState.players
                    .filter((p) => p.isAlive && p.id !== user?.id) // Filtramos al impostor para que no se elija
                    .map((p) => {
                      const isTarget = impostorTarget === p.id;
                      const isDisabled =
                        gameState.myRole !== "IMPOSTOR" ||
                        impostorTarget !== null;

                      return (
                        <ListGroup.Item
                          key={p.id}
                          action
                          onClick={() => handleImpostorTarget(p.id)}
                          active={isTarget}
                          disabled={isDisabled}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <span className="fw-bold">
                            <HeartFill size={16} className="text-danger me-1" />
                            {p.name} (Vidas: {p.lives})
                          </span>
                          {isTarget && (
                            <span className="badge bg-danger">Objetivo</span>
                          )}
                        </ListGroup.Item>
                      );
                    })}

                  <Alert
                    variant={
                      gameState.myRole === "IMPOSTOR" ? "danger" : "light"
                    }
                    className="mt-3 text-center"
                  >
                    {gameState.myRole === "IMPOSTOR"
                      ? impostorTarget
                        ? "Objetivo elegido. Esperando la siguiente ronda..."
                        : "Elige un Inocente para atacar."
                      : "El Impostor está eligiendo una víctima..."}
                  </Alert>
                </ListGroup>
              ) : (
                <ListGroup>
                  {gameState.players
                    .filter((p) => p.clueGiven)
                    .map((p) => (
                      <ListGroup.Item
                        key={p.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span className="fw-bold">
                          {p.name} ({p.id === user?.id && "Tú"}):
                        </span>{" "}
                        <span className="text-primary fw-bold fs-5">
                          {p.clueGiven}
                        </span>
                      </ListGroup.Item>
                    ))}
                  {gameState.players.filter((p) => p.isAlive && !p.clueGiven)
                    .length > 0 && (
                    <Alert variant="light" className="mt-2 text-center">
                      <Spinner animation="grow" size="sm" className="me-2" />
                      Esperando pistas de{" "}
                      <span className="fw-bold">
                        {
                          gameState.players.filter(
                            (p) => p.isAlive && !p.clueGiven
                          ).length
                        }
                      </span>{" "}
                      jugadores...
                    </Alert>
                  )}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GamePhaseView;
