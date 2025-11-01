import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { XCircleFill } from "react-bootstrap-icons";

const GuessingView = ({
  gameState,
  playerState,
  isAlive,
  handleSubmitGuess,
  onSubmitGuess,
  registerGuess,
  errorsGuess,
}) => {
  const myUserId = playerState?.id?.toString();
  const currentTurnId =
    gameState.turnOrder?.[gameState.currentTurnIndex]?.toString();
  const isMyTurn = currentTurnId && myUserId && currentTurnId === myUserId;
  const canSubmit = isMyTurn && !playerState?.guessGiven;

  return (
    <Container className="mainSection py-4">
      <h1 className="text-center mb-4 fw-bold text-warning">
        Modo Adivinanza 🧠
      </h1>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-lg border-warning rounded-4">
            <Card.Header className="bg-warning text-dark text-center fw-bold fs-4">
              ¡Solo Quedan 2! Adivina la Palabra Clave
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="text-center fw-bold">
                El juego ha entrado en la fase de adivinanza. Selecciona la
                palabra clave del tablero para ganar.
              </Alert>

              <Form
                onSubmit={handleSubmitGuess(onSubmitGuess)}
                className="mb-4"
              >
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Palabra Clave (Elige una del tablero)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa la palabra de la lista..."
                    {...registerGuess("guess", {
                      required: "Debes ingresar una palabra.",
                    })}
                    isInvalid={!!errorsGuess.guess}
                    disabled={!canSubmit || !isAlive}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorsGuess.guess?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button
                  variant="warning"
                  type="submit"
                  className="w-100 fw-bold"
                  disabled={!canSubmit || !isAlive}
                >
                  {
                    canSubmit
                      ? "Enviar Adivinanza"
                      : playerState?.guessGiven
                      ? "Esperando al Otro Jugador..."
                      : "Espera tu Turno..."
                  }
                </Button>
                {!isAlive && (
                  <Alert variant="danger" className="text-center mt-2">
                    Has sido eliminado.
                  </Alert>
                )}
              </Form>

              <h5 className="text-center fw-bold mb-3">Tablero de Palabras:</h5>
              <Row className="g-2">
                {gameState.words.map((word, index) => (
                  <Col xs={6} sm={4} lg={3} key={index}>
                    <div
                      className={`p-3 border rounded text-center fw-bold shadow-sm h-100 
                                     bg-light text-dark border-secondary`}
                      style={{ minHeight: "60px" }}
                    >
                      {word}
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GuessingView;
