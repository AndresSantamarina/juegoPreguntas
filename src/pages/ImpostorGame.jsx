// import { useState, useEffect, useCallback } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Form,
//   ListGroup,
//   Alert,
//   Spinner,
//   ProgressBar,
// } from "react-bootstrap";
// import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useSocket } from "../context/SocketContext";
// import { useForm } from "react-hook-form";
// import Swal from "sweetalert2";
// import {
//   Clipboard,
//   ArrowRightCircle,
//   PersonFill,
//   HeartFill,
//   ClockFill,
//   XCircleFill,
//   Person,
// } from "react-bootstrap-icons";

// const TURN_TIME_MS = 30000;

// const initialGameState = {
//   status: "LOBBY",
//   players: [],
//   currentRound: 0,
//   turnOrder: [],
//   currentTurnIndex: -1,
//   turnStartTime: null,
//   turnDuration: TURN_TIME_MS,
//   words: [],
//   myRole: null,
//   myKeyword: null,
// };

// const ImpostorGame = () => {
//   const { roomId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { socket, isConnected } = useSocket();
//   const [gameState, setGameState] = useState(initialGameState);
//   const [loading, setLoading] = useState(true);
//   const [isHost, setIsHost] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   const {
//     register: registerGuess,
//     handleSubmit: handleSubmitGuess,
//     reset: resetGuess,
//   } = useForm();

//   const [myClue, setMyClue] = useState("");
//   const [myVoteTarget, setMyVoteTarget] = useState(null);
//   const [myGuessSubmitted, setMyGuessSubmitted] = useState(false);
//   const [impostorTarget, setImpostorTarget] = useState(null);
//   const playerState = gameState.players.find((p) => p.id === user?.id);

//   const currentTurnPlayerId = gameState.turnOrder
//     ? gameState.turnOrder[gameState.currentTurnIndex]
//     : null;
//   const isMyTurn = currentTurnPlayerId === user?.id;
//   const canStartGame = gameState.players.length >= 3;
//   const isLobby = gameState.status === "LOBBY";
//   const isInGame = gameState.status === "IN_GAME";
//   const isVoting = gameState.status === "VOTING";
//   const isImpostorChoosing = gameState.status === "IMPOSTOR_CHOOSING";
//   const isGuessingMode = gameState.status === "GUESSING";
//   const isFinished = gameState.status === "FINISHED";
//   const isAlive = playerState?.isAlive ?? true;
//   const myLives = playerState?.lives ?? 3;

//   const calculateRemainingTime = useCallback(() => {
//     if (gameState.turnStartTime) {
//       const startTime = new Date(gameState.turnStartTime).getTime();
//       const now = new Date().getTime();
//       const elapsed = now - startTime;
//       const remaining = Math.max(0, gameState.turnDuration - elapsed);
//       return Math.ceil(remaining / 1000);
//     }
//     return Math.ceil(gameState.turnDuration / 1000);
//   }, [gameState.turnStartTime, gameState.turnDuration]);

//   const maxTimeSeconds = Math.ceil(gameState.turnDuration / 1000);
//   const [remainingTime, setRemainingTime] = useState(maxTimeSeconds);

//   useEffect(() => {
//     let timerId;
//     const currentMaxTime = Math.ceil(gameState.turnDuration / 1000);

//     if (isInGame && gameState.turnStartTime) {
//       timerId = setInterval(() => {
//         const time = calculateRemainingTime();
//         setRemainingTime(time);
//         if (time <= 0) {
//           clearInterval(timerId);
//         }
//       }, 500);
//     } else {
//       setRemainingTime(currentMaxTime);
//     }

//     return () => clearInterval(timerId);
//   }, [
//     isInGame,
//     gameState.turnStartTime,
//     gameState.turnDuration,
//     calculateRemainingTime,
//   ]);

//   useEffect(() => {
//     if (!user || !roomId || !socket || !isConnected) {
//       if (!user) navigate("/login");
//       return;
//     }

//     socket.emit("getGameState", { roomId, userId: user.id }, (response) => {
//       setLoading(false);
//       if (!response.success) {
//         Swal.fire(
//           "Error",
//           response.message || "No se pudo cargar la sala.",
//           "error"
//         );
//         navigate("/impostor");
//         return;
//       }

//       const { room: roomData, myRole, myKeyword } = response;

//       const newGameState = {
//         status: roomData.status,
//         players: roomData.players || [],
//         currentRound: roomData.currentRound || 0,
//         turnOrder: roomData.turnOrder || [],
//         currentTurnIndex: roomData.currentTurnIndex || -1,
//         turnStartTime: roomData.turnStartTime || null,
//         turnDuration: roomData.turnDuration || TURN_TIME_MS,
//         words: roomData.words || [],
//         myRole: myRole,
//         myKeyword: myKeyword,
//       };

//       setGameState((prev) => {
//         if (prev.status === "IN_GAME" && roomData.status === "IN_GAME") {
//           const finalIndex =
//             roomData.currentTurnIndex === -1
//               ? prev.currentTurnIndex
//               : roomData.currentTurnIndex;
//           return {
//             ...prev,
//             status: roomData.status,
//             players: roomData.players || prev.players,
//             currentRound: roomData.currentRound || 0,
//             turnOrder: roomData.turnOrder || [],
//             currentTurnIndex: finalIndex,
//             turnStartTime: roomData.turnStartTime || null,
//             turnDuration: roomData.turnDuration || TURN_TIME_MS,
//             words: roomData.words || [],
//             myRole: myRole,
//             myKeyword: myKeyword,
//           };
//         }

//         const newGameState = {
//           status: roomData.status,
//           currentTurnIndex: roomData.currentTurnIndex || -1,
//         };

//         return { ...prev, ...newGameState };
//       });

//       const isUserHost =
//         roomData.players.find((p) => p.id === user.id)?.isHost || false;
//       setIsHost(isUserHost);
//       const currentPlayer = roomData.players.find((p) => p.id === user.id);

//       if (currentPlayer?.clueGiven) setMyClue(currentPlayer.clueGiven);
//       if (currentPlayer?.vote) setMyVoteTarget(currentPlayer.vote);
//       if (currentPlayer?.guessGiven)
//         setMyGuessSubmitted(currentPlayer.guessGiven);

//       if (roomData.turnStartTime) {
//         setRemainingTime(calculateRemainingTime());
//       } else {
//         setRemainingTime(Math.ceil(newGameState.turnDuration / 1000));
//       }
//     });

//     const handleStateUpdate = (data) => {
//       console.log("Estado de juego actualizado:", data);

//       setGameState((prev) => ({
//         ...prev,
//         ...data,
//         players: data.players || prev.players,
//         turnDuration: data.turnDuration || TURN_TIME_MS,
//       }));

//       if (data.status && data.status !== gameState.status) {
//         if (data.status === "IN_GAME" || data.status === "VOTING") {
//           setMyClue("");
//           setMyVoteTarget(null);
//           reset();
//           resetGuess();
//           setMyGuessSubmitted(false);
//           setImpostorTarget(null);
//         }
//         if (data.status === "GUESSING") {
//           setMyClue("");
//           setMyVoteTarget(null);
//           reset();
//           setMyGuessSubmitted(playerState?.guessGiven || false);
//           setImpostorTarget(null);
//         }
//       }
//     };

//     const handleTurnAdvanced = (data) => {
//       console.log("Turno avanzado:", data);
//       setGameState((prev) => ({
//         ...prev,
//         ...data,

//         turnDuration: data.turnDuration || TURN_TIME_MS,
//       }));

//       if (data.turnStartTime) {
//         setRemainingTime(calculateRemainingTime(data.turnStartTime));
//       }
//     };

//     const handleVotingStarted = (data) => {
//       Swal.fire({
//         title: "¡Votación!",
//         text: data.message,
//         icon: "info",
//         timer: 3000,
//         showConfirmButton: false,
//       });
//       setGameState((prev) => ({ ...prev, ...data }));
//     };

//     const handleImpostorChoosing = (data) => {
//       Swal.fire({
//         title: "¡Ataque del Impostor!",
//         text: data.message,
//         icon: gameState.myRole === "IMPOSTOR" ? "warning" : "error",
//         timer: gameState.myRole === "IMPOSTOR" ? null : 5000,
//         showConfirmButton: gameState.myRole === "IMPOSTOR" ? true : false,
//       });
//       setGameState((prev) => ({ ...prev, ...data }));
//     };

//     const handleGuessingStarted = (data) => {
//       Swal.fire({
//         title: "¡Modo de 2 Jugadores!",
//         text: data.message,
//         icon: "warning",
//         confirmButtonText: "Entendido",
//       });
//       setGameState((prev) => ({ ...prev, ...data, words: data.words }));
//     };

//     const handleRoundNew = (data) => {
//       Swal.fire({
//         title: "¡Nueva Ronda!",
//         text: data.message || `Comienza la Ronda ${data.currentRound}.`,
//         icon: "info",
//         timer: 3000,
//         showConfirmButton: false,
//       });

//       setMyClue("");
//       setMyVoteTarget(null);
//       reset();
//       resetGuess();
//       setMyGuessSubmitted(false);
//       setImpostorTarget(null);
//     };

//     const handleTurnSkippedTimeout = (data) => {
//       Swal.fire({
//         title: "¡Turno Perdido!",
//         text: data.message,
//         icon: "warning",
//         timer: 2000,
//         showConfirmButton: false,
//       });
//     };

//     const handleGameFinished = (data) => {
//       setGameState((prev) => ({ ...prev, status: "FINISHED" }));

//       const myRole = gameState.myRole;
//       const winnerRole = data.winner;
//       let icon = "info";

//       if (winnerRole === "Innocents") {
//         icon = myRole === "INNOCENT" ? "success" : "error";
//       } else if (winnerRole === "Impostor") {
//         icon = myRole === "IMPOSTOR" ? "success" : "error";
//       }

//       Swal.fire({
//         title: "¡Juego Terminado! 🎉",
//         html: `Ganador: <strong>${data.winner}</strong><br/>${data.message}`,
//         icon: icon,
//         confirmButtonText: "Volver a la Home",
//       }).then(() => navigate("/impostor"));
//     };

//     const handlePlayerUpdate = (data) => {
//       console.log("Jugadores actualizados:", data.players);
//       setGameState((prev) => ({ ...prev, players: data.players }));
//       setIsHost(data.players.find((p) => p.id === user.id)?.isHost || false);
//       console.log(
//         "CLIENTE:",
//         socket.id,
//         "RECIBE actualización. Jugadores:",
//         data.players.map((p) => p.username)
//       );
//     };

//     const handleRoomClosed = (data) => {
//       Swal.fire({
//         title: "Sala Cerrada",
//         text: data.message || "El anfitrión ha cancelado la partida.",
//         icon: "info",
//         confirmButtonText: "Volver a Impostor Home",
//       }).then(() => {
//         navigate("/impostor");
//       });
//     };

//     const handleGuessingNextAttempt = (data) => {
//       Swal.fire({
//         title: "¡Ambos Fallaron!",
//         text: `La palabra correcta era: ${data.secretWord}. Tienen otra oportunidad.`,
//         icon: "error",
//         confirmButtonText: "¡Adivinar de Nuevo!",
//       });
//       setMyGuessSubmitted(false);
//       setGameState((prev) => ({
//         ...prev,
//         players: prev.players.map((p) => ({ ...p, guessGiven: false })),
//         ...data,
//       }));
//     };

//     socket.on("guessing_next_attempt", handleGuessingNextAttempt);
//     socket.on(`state_update_${roomId}`, handleStateUpdate);
//     socket.on(`player_update_${roomId}`, handlePlayerUpdate);
//     socket.on(`game_finished`, handleGameFinished);
//     socket.on(`room_closed`, handleRoomClosed);
//     socket.on("turn_advanced", handleTurnAdvanced);
//     socket.on("voting_started", handleVotingStarted);
//     socket.on("impostor_choosing", handleImpostorChoosing);
//     socket.on("guessing_started", handleGuessingStarted);
//     socket.on("round_new", handleRoundNew);
//     socket.on("turn_skipped_timeout", handleTurnSkippedTimeout);

//     return () => {
//       socket.off(`state_update_${roomId}`, handleStateUpdate);
//       socket.off(`player_update_${roomId}`, handlePlayerUpdate);
//       socket.off(`game_finished`, handleGameFinished);
//       socket.off(`room_closed`, handleRoomClosed);
//       socket.off("turn_advanced", handleTurnAdvanced);
//       socket.off("voting_started", handleVotingStarted);
//       socket.off("impostor_choosing", handleImpostorChoosing);
//       socket.off("guessing_started", handleGuessingStarted);
//       socket.off("round_new", handleRoundNew);
//       socket.off("turn_skipped_timeout", handleTurnSkippedTimeout);
//     };
//   }, [
//     socket,
//     isConnected,
//     user,
//     roomId,
//     navigate,
//     reset,
//     resetGuess,
//     gameState.status,
//     gameState.myRole,
//     calculateRemainingTime,
//   ]);

//   useEffect(() => {
//     let timerId;
//     if (isInGame && gameState.turnStartTime) {
//       timerId = setInterval(() => {
//         const time = calculateRemainingTime();
//         setRemainingTime(time);
//         if (time <= 0) {
//           clearInterval(timerId);
//         }
//       }, 500);
//     } else {
//       setRemainingTime(maxTimeSeconds);
//     }

//     return () => clearInterval(timerId);
//   }, [
//     isInGame,
//     gameState.turnStartTime,
//     gameState.turnDuration,
//     calculateRemainingTime,
//     maxTimeSeconds,
//   ]);

//   useEffect(() => {
//     if (
//       gameState.status === "CLUE_PHASE" ||
//       gameState.status === "VOTING_PHASE"
//     ) {
//     }
//   }, [gameState.status]);

//   const handleCopyRoomId = () => {
//     navigator.clipboard.writeText(roomId).then(() =>
//       Swal.fire({
//         title: "Copiado ✅",
//         text: `ID de sala (${roomId}) copiado.`,
//         icon: "success",
//         timer: 1500,
//         showConfirmButton: false,
//       })
//     );
//   };

//   const handleStartGame = () => {
//     if (!isHost || !canStartGame) {
//       console.error(
//         "No se cumplen los requisitos (no es host o no puede iniciar)."
//       );
//       return;
//     }

//     socket.emit("startGame", { roomId }, (response) => {
//       if (response.success) {
//         console.log("Partida iniciada con éxito. Servidor respondió OK.");
//       } else {
//         Swal.fire(
//           "Error",
//           response.message || "Error al iniciar el juego.",
//           "error"
//         );
//       }
//     });
//   };

//   const handleCancelGame = () => {
//     if (!isHost) return;
//     Swal.fire({
//       title: "¿Cancelar Partida? ❌",
//       text: "Esto cerrará la sala y desconectará a todos los jugadores.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Sí, Cancelar",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         socket.emit("cancelGame", { roomId });
//       }
//     });
//   };

//   const onSubmitClue = (data) => {
//     if (gameState.status !== "IN_GAME" || !isMyTurn || playerState?.clueGiven)
//       return;
//     socket.emit(
//       "submitClue",
//       {
//         roomId,
//         clue: data.clue.toUpperCase().trim(),
//       },
//       (response) => {
//         if (response.success) {
//           setMyClue(data.clue.toUpperCase().trim());
//           setGameState((prev) => ({
//             ...prev,
//             players: prev.players.map((p) =>
//               p.id === user.id
//                 ? {
//                     ...p,
//                     clueGiven: data.clue.toUpperCase().trim(),
//                   }
//                 : p
//             ),
//           }));
//         } else {
//           Swal.fire(
//             "Error",
//             response.message || "No se pudo enviar la pista.",
//             "error"
//           );
//         }
//       }
//     );
//     reset();
//   };

//   const handleVote = (targetUserId) => {
//     if (
//       gameState.status !== "VOTING" ||
//       myVoteTarget ||
//       targetUserId === user?.id ||
//       !isAlive
//     )
//       return;

//     Swal.fire({
//       title: `¿Votar por ${
//         gameState.players.find((p) => p.id === targetUserId)?.name
//       }?`,
//       text: "Tu voto es definitivo.",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "Sí, Votar",
//       cancelButtonText: "Cancelar",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         socket.emit(
//           "submitVote",
//           {
//             roomId,
//             targetId: targetUserId,
//           },
//           (response) => {
//             if (response.success) {
//               setMyVoteTarget(targetUserId);
//               setGameState((prev) => ({
//                 ...prev,
//                 players: prev.players.map((p) =>
//                   p.id === user.id ? { ...p, vote: targetUserId } : p
//                 ),
//               }));
//             } else {
//               Swal.fire(
//                 "Error",
//                 response.message || "No se pudo registrar tu voto.",
//                 "error"
//               );
//             }
//           }
//         );
//       }
//     });
//   };

//   const handleImpostorTarget = (targetUserId) => {
//     if (
//       gameState.status !== "IMPOSTOR_CHOOSING" ||
//       gameState.myRole !== "IMPOSTOR" ||
//       impostorTarget
//     )
//       return;

//     Swal.fire({
//       title: `¿Eliminar a ${
//         gameState.players.find((p) => p.id === targetUserId)?.name
//       }?`,
//       text: "El jugador perderá 1 vida.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Sí, Atacar",
//       cancelButtonText: "Cancelar",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         socket.emit(
//           "chooseTarget",
//           {
//             roomId,
//             targetId: targetUserId,
//           },
//           (response) => {
//             if (response.success) {
//               setImpostorTarget(targetUserId);
//               Swal.fire({
//                 title: "¡Ataque Enviado!",
//                 text: response.message,
//                 icon: "success",
//                 timer: 2000,
//                 showConfirmButton: false,
//               });
//             } else {
//               Swal.fire(
//                 "Error",
//                 response.message || "No se pudo elegir el objetivo.",
//                 "error"
//               );
//             }
//           }
//         );
//       }
//     });
//   };

//   const onSubmitGuess = (data) => {
//     if (gameState.status !== "GUESSING" || myGuessSubmitted || !isAlive) return;

//     socket.emit(
//       "submitGuess",
//       {
//         roomId,
//         guessedWord: data.guess.toUpperCase().trim(),
//       },
//       (response) => {
//         if (response.success) {
//           setMyGuessSubmitted(true);
//           setGameState((prev) => ({
//             ...prev,
//             players: prev.players.map((p) =>
//               p.id === user.id ? { ...p, guessGiven: true } : p
//             ),
//           }));

//           if (!response.isFinished) {
//             Swal.fire({
//               title: "Adivinanza Enviada",
//               text: "Esperando la adivinanza del otro jugador...",
//               icon: "info",
//               timer: 2000,
//               showConfirmButton: false,
//             });
//           }
//         } else {
//           Swal.fire(
//             "Error",
//             response.message || "No se pudo enviar la adivinanza.",
//             "error"
//           );
//         }
//       }
//     );
//     socket.onAny((eventName, data) => {
//       if (
//         eventName === "connect" ||
//         eventName === "disconnect" ||
//         eventName === "ping"
//       )
//         return;
//       console.log(`[FE EVENT DETECTED] EVENTO: ${eventName}`, {
//         index: data.currentTurnIndex,
//         status: data.status,
//       });
//     });
//     resetGuess();
//   };

//   if (loading || !isConnected) {
//     return (
//       <Container className="mainSection text-center py-5">
//         <Spinner animation="border" variant="danger" />
//         <h2 className="mt-3">
//           {!isConnected
//             ? "Conectando al servidor... 🔌"
//             : "Cargando partida... 🎲"}
//         </h2>
//       </Container>
//     );
//   }

//   if (isLobby) {
//     const hostPlayer = gameState.players.find((p) => p.isHost);

//     return (
//       <Container className="mainSection py-5">
//         <h1 className="text-center mb-4 text-primary fw-bold">
//           Sala de Espera: {roomId}
//         </h1>

//         <Row className="justify-content-center">
//           <Col md={8} lg={6}>
//             <Card className="shadow-lg border-primary rounded-4">
//               <Card.Header className="bg-primary text-white text-center fw-bold fs-4">
//                 Invitá a tus amigos
//                 <Button
//                   variant="outline-light"
//                   size="sm"
//                   className="ms-3"
//                   onClick={handleCopyRoomId}
//                 >
//                   <Clipboard size={18} />
//                 </Button>
//               </Card.Header>
//               <Card.Body>
//                 <h5 className="text-center mb-3 text-secondary">
//                   Jugadores Conectados: ({gameState.players.length} / Mínimo: 3)
//                 </h5>

//                 <ListGroup className="mb-4">
//                   {gameState.players.map((p) => (
//                     <ListGroup.Item
//                       key={p.id}
//                       className="d-flex justify-content-between align-items-center"
//                     >
//                       <PersonFill size={20} className="me-2 text-primary" />
//                       <span className="fw-bold">
//                         {p.name} {p.id === user?.id && "(Tú)"}
//                       </span>
//                       {p.isHost && (
//                         <span className="badge bg-success">Anfitrión</span>
//                       )}
//                     </ListGroup.Item>
//                   ))}
//                 </ListGroup>

//                 <div className="d-grid gap-2">
//                   {isHost ? (
//                     <>
//                       <Button
//                         variant="success"
//                         size="lg"
//                         onClick={handleStartGame}
//                         disabled={!canStartGame}
//                         className="fw-bold py-2 shadow"
//                       >
//                         <ArrowRightCircle size={20} className="me-2" />
//                         {canStartGame
//                           ? "Comenzar Partida"
//                           : `Faltan ${
//                               3 - gameState.players.length
//                             } jugadores...`}
//                       </Button>
//                       <Button
//                         variant="outline-danger"
//                         onClick={handleCancelGame}
//                         className="py-2"
//                       >
//                         Cancelar Sala
//                       </Button>
//                     </>
//                   ) : (
//                     <Alert variant="info" className="text-center">
//                       Esperando a que el Anfitrión ({hostPlayer?.name || "..."})
//                       inicie el juego.
//                     </Alert>
//                   )}
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     );
//   }

//   if (isGuessingMode) {
//     const isPlayerGuessed = playerState?.guessGiven;

//     return (
//       <Container className="mainSection py-4">
//         <h1 className="text-center mb-4 fw-bold text-warning">
//           Modo Adivinanza 🧠
//         </h1>
//         <Row className="justify-content-center">
//           <Col md={10} lg={8}>
//             <Card className="shadow-lg border-warning rounded-4">
//               <Card.Header className="bg-warning text-dark text-center fw-bold fs-4">
//                 ¡Solo Quedan 2! Adivina la Palabra Clave
//               </Card.Header>
//               <Card.Body>
//                 <Alert variant="info" className="text-center fw-bold">
//                   El juego ha entrado en la fase de adivinanza. Selecciona la
//                   palabra clave del tablero para ganar.
//                 </Alert>

//                 <Form
//                   onSubmit={handleSubmitGuess(onSubmitGuess)}
//                   className="mb-4"
//                 >
//                   <Form.Group className="mb-3">
//                     <Form.Label className="fw-bold">
//                       Palabra Clave (Elige una del tablero)
//                     </Form.Label>
//                     <Form.Control
//                       type="text"
//                       placeholder="Ingresa la palabra de la lista..."
//                       {...registerGuess("guess", {
//                         required: "Debes ingresar una palabra.",
//                       })}
//                       isInvalid={!!errors.guess}
//                       disabled={isPlayerGuessed || !isAlive}
//                     />
//                     <Form.Control.Feedback type="invalid">
//                       {errors.guess?.message}
//                     </Form.Control.Feedback>
//                   </Form.Group>
//                   <Button
//                     variant="warning"
//                     type="submit"
//                     className="w-100 fw-bold"
//                     disabled={isPlayerGuessed || !isAlive}
//                   >
//                     {isPlayerGuessed
//                       ? "Esperando al Otro Jugador..."
//                       : "Enviar Adivinanza"}
//                   </Button>
//                   {!isAlive && (
//                     <Alert variant="danger" className="text-center mt-2">
//                       Has sido eliminado.
//                     </Alert>
//                   )}
//                 </Form>

//                 <h5 className="text-center fw-bold mb-3">
//                   Tablero de Palabras:
//                 </h5>
//                 <Row className="g-2">
//                   {gameState.words.map((word, index) => (
//                     <Col xs={6} sm={4} lg={3} key={index}>
//                       <div
//                         className={`p-3 border rounded text-center fw-bold shadow-sm h-100 
//                                                         bg-light text-dark border-secondary`}
//                         style={{ minHeight: "60px" }}
//                       >
//                         {word}
//                       </div>
//                     </Col>
//                   ))}
//                 </Row>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     );
//   }

//   const isMyKeyword =
//     gameState.myRole === "INNOCENT" ? gameState.myKeyword : null;
//   const displayedWords = gameState.words.map((word) => ({
//     word: word,
//     isKeyword: word === isMyKeyword,
//   }));

//   const currentTurnPlayer = currentTurnPlayerId
//     ? gameState.players.find((p) => p.id === currentTurnPlayerId)
//     : undefined;

//   return (
//     <Container className="mainSection py-4">
//       <h1 className="text-center mb-4 fw-bold text-danger">
//         IMPOSTOR:
//         {isInGame && " Fase de Pistas 🗣️"}
//         {isVoting && " Fase de Votación 🗳️"}
//         {isImpostorChoosing && " Fase de Ataque 🔪"}
//       </h1>

//       <Row className="mb-4">
//         <Col md={12} lg={4}>
//           <Card
//             className={`shadow-lg border-${
//               gameState.myRole === "IMPOSTOR" ? "danger" : "success"
//             } mb-3`}
//           >
//             <Card.Header
//               className={`text-white bg-${
//                 gameState.myRole === "IMPOSTOR" ? "danger" : "success"
//               } fw-bold`}
//             >
//               Tu Rol:{" "}
//               {gameState.myRole === "IMPOSTOR"
//                 ? "🔴 EL IMPOSTOR"
//                 : "🟢 INOCENTE"}
//             </Card.Header>
//             <Card.Body>
//               <h5 className="mb-3">
//                 {gameState.myRole === "IMPOSTOR" ? (
//                   <>
//                     <span className="text-danger fw-bold">
//                       Tu objetivo es descubrir la palabra clave de los
//                       Inocentes.
//                     </span>
//                   </>
//                 ) : (
//                   <>
//                     <span className="text-success fw-bold">
//                       Tu palabra clave está{" "}
//                       {isMyKeyword ? "resaltada en verde" : "por ser asignada"}{" "}
//                       en el tablero.
//                     </span>
//                   </>
//                 )}
//               </h5>
//               <hr />
//               <div className="d-flex justify-content-between align-items-center">
//                 <span className="fw-bold">
//                   <HeartFill size={20} className="text-danger me-1" /> Vidas
//                   Restantes:
//                 </span>
//                 <div>
//                   {[...Array(3)].map((_, i) => (
//                     <HeartFill
//                       key={i}
//                       size={24}
//                       className={`mx-1 ${
//                         i < myLives
//                           ? "text-danger"
//                           : "text-secondary opacity-50"
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </div>
//               {!isAlive && (
//                 <Alert variant="danger" className="text-center mt-3 fw-bold">
//                   <XCircleFill size={20} className="me-2" /> ¡Eliminado! Estás
//                   fuera de la partida.
//                 </Alert>
//               )}
//             </Card.Body>
//           </Card>
//           <Card className="shadow mb-3">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="fw-bold text-primary">
//                   <ClockFill size={20} className="me-2" />
//                   Tiempo: {remainingTime}s
//                 </span>
//                 <span className="fw-bold text-dark">
//                   <Person size={20} className="me-2" />
//                   Ronda: {gameState.currentRound}
//                 </span>
//               </div>
//               <ProgressBar
//                 now={remainingTime}
//                 max={maxTimeSeconds}
//                 variant={remainingTime < 10 ? "danger" : "primary"}
//                 animated={isInGame}
//               />
//               {isInGame && (
//                 <p className="mt-2 text-center">
//                   Turno de:
//                   <span
//                     className={`fw-bold ms-1 text-${
//                       isMyTurn ? "danger" : "dark"
//                     }`}
//                   >
//                     {currentTurnPlayer?.name || "Esperando..."}
//                   </span>
//                 </p>
//               )}
//               {isVoting && (
//                 <Alert variant="info" className="text-center mt-2">
//                   ¡VOTA AHORA! Elige al Impostor del tablero de la derecha.
//                 </Alert>
//               )}
//             </Card.Body>
//           </Card>
//           {isInGame && (
//             <Card className="shadow border-info mb-3">
//               <Card.Body>
//                 <Card.Title className="text-info">Tu Pista</Card.Title>
//                 {playerState?.clueGiven ? (
//                   <Alert variant="success" className="text-center">
//                     Pista enviada:{" "}
//                     <span className="fw-bold">{playerState.clueGiven}</span>.
//                     Esperando a los demás.
//                   </Alert>
//                 ) : (
//                   <Form onSubmit={handleSubmit(onSubmitClue)}>
//                     <Form.Group className="mb-3">
//                       <Form.Label className="fw-bold">
//                         Ingresa tu pista (una sola palabra)
//                       </Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="Ej: Estrella"
//                         {...register("clue", {
//                           required: "La pista es obligatoria",
//                           pattern: {
//                             value: /^\S+$/,
//                             message: "Debe ser una sola palabra",
//                           },
//                           maxLength: {
//                             value: 15,
//                             message: "Máximo 15 caracteres",
//                           },
//                         })}
//                         isInvalid={!!errors.clue}
//                         disabled={
//                           !isMyTurn || playerState?.clueGiven || !isAlive
//                         }
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {errors.clue?.message}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                     <Button
//                       variant="info"
//                       type="submit"
//                       className="w-100 fw-bold"
//                       disabled={!isMyTurn || playerState?.clueGiven || !isAlive}
//                     >
//                       Enviar Pista
//                     </Button>
//                     {!isMyTurn && !playerState?.clueGiven && isAlive && (
//                       <Alert variant="light" className="text-center mt-2">
//                         Espera tu turno para enviar la pista.
//                       </Alert>
//                     )}
//                   </Form>
//                 )}
//               </Card.Body>
//             </Card>
//           )}
//         </Col>

//         <Col md={12} lg={8}>
//           <Card className="shadow-lg mb-4">
//             <Card.Header className="bg-light fw-bold text-center">
//               Tablero de Palabras ({gameState.words.length})
//             </Card.Header>
//             <Card.Body>
//               <Row className="g-2">
//                 {displayedWords.map((item, index) => (
//                   <Col xs={6} sm={4} lg={3} key={index}>
//                     <div
//                       className={`p-3 border rounded text-center fw-bold shadow-sm h-100 
//                                       ${
//                                         item.isKeyword
//                                           ? "bg-success text-white border-success"
//                                           : "bg-light text-dark border-secondary"
//                                       }`}
//                       style={{ minHeight: "80px" }}
//                     >
//                       {item.word}
//                     </div>
//                   </Col>
//                 ))}
//               </Row>
//             </Card.Body>
//           </Card>

//           <Card className="shadow-lg">
//             <Card.Header className="bg-secondary text-white fw-bold text-center">
//               {isVoting
//                 ? "Vota por el Impostor"
//                 : isImpostorChoosing
//                 ? "El Impostor Elige Víctima 🔪"
//                 : "Pistas de la Ronda Actual"}
//             </Card.Header>
//             <Card.Body>
//               {isVoting ? (
//                 <ListGroup>
//                   {gameState.players
//                     .filter((p) => p.isAlive)
//                     .map((p) => {
//                       const isTarget = myVoteTarget === p.id;
//                       const isDisabled =
//                         myVoteTarget !== null ||
//                         p.id === user?.id ||
//                         !isVoting ||
//                         !isAlive;

//                       return (
//                         <ListGroup.Item
//                           key={p.id}
//                           action
//                           onClick={() => handleVote(p.id)}
//                           active={isTarget}
//                           disabled={isDisabled}
//                           className="d-flex justify-content-between align-items-center"
//                         >
//                           <span className="fw-bold">
//                             {p.name} {p.id === user?.id && "(Tú)"}
//                           </span>
//                           <div>
//                             {p.vote && (
//                               <span className="badge bg-warning text-dark me-2">
//                                 Votó
//                               </span>
//                             )}
//                             {isTarget && (
//                               <span className="badge bg-danger">Tu Voto</span>
//                             )}
//                           </div>
//                         </ListGroup.Item>
//                       );
//                     })}
//                   <Alert variant="warning" className="mt-3 text-center">
//                     {myVoteTarget
//                       ? "Voto enviado. Esperando a los demás..."
//                       : "Elige al jugador que crees que es el Impostor."}
//                   </Alert>
//                 </ListGroup>
//               ) : isImpostorChoosing ? (
//                 <ListGroup>
//                   {gameState.players
//                     .filter((p) => p.isAlive && !p.isImpostor)
//                     .map((p) => {
//                       const isTarget = impostorTarget === p.id;
//                       const isDisabled =
//                         gameState.myRole !== "IMPOSTOR" ||
//                         impostorTarget !== null;

//                       return (
//                         <ListGroup.Item
//                           key={p.id}
//                           action
//                           onClick={() => handleImpostorTarget(p.id)}
//                           active={isTarget}
//                           disabled={isDisabled}
//                           className="d-flex justify-content-between align-items-center"
//                         >
//                           <span className="fw-bold">
//                             <HeartFill size={16} className="text-danger me-1" />
//                             {p.name} (Vidas: {p.lives})
//                           </span>
//                           {isTarget && (
//                             <span className="badge bg-danger">Objetivo</span>
//                           )}
//                         </ListGroup.Item>
//                       );
//                     })}

//                   <Alert
//                     variant={
//                       gameState.myRole === "IMPOSTOR" ? "danger" : "light"
//                     }
//                     className="mt-3 text-center"
//                   >
//                     {gameState.myRole === "IMPOSTOR"
//                       ? impostorTarget
//                         ? "Objetivo elegido. Esperando la siguiente ronda..."
//                         : "Elige un Inocente para atacar."
//                       : "El Impostor está eligiendo una víctima..."}
//                   </Alert>
//                 </ListGroup>
//               ) : (
//                 <ListGroup>
//                   {gameState.players
//                     .filter((p) => p.clueGiven)
//                     .map((p) => (
//                       <ListGroup.Item
//                         key={p.id}
//                         className="d-flex justify-content-between align-items-center"
//                       >
//                         <span className="fw-bold">
//                           {p.name} ({p.id === user?.id && "Tú"}):
//                         </span>{" "}
//                         <span className="text-primary fw-bold fs-5">
//                           {p.clueGiven}
//                         </span>
//                       </ListGroup.Item>
//                     ))}
//                   {gameState.players.filter((p) => p.isAlive && !p.clueGiven)
//                     .length > 0 && (
//                     <Alert variant="light" className="mt-2 text-center">
//                       <Spinner animation="grow" size="sm" className="me-2" />
//                       Esperando pistas de{" "}
//                       <span className="fw-bold">
//                         {
//                           gameState.players.filter(
//                             (p) => p.isAlive && !p.clueGiven
//                           ).length
//                         }
//                       </span>{" "}
//                       jugadores...
//                     </Alert>
//                   )}
//                 </ListGroup>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default ImpostorGame;
