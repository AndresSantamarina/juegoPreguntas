// src/pages/ImpostorGame.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { useGameSocket } from "../hooks/useGameSocket";
import Swal from "sweetalert2";

// Vistas Modularizadas
import LoadingView from "./LoadingView";
import LobbyView from "./LobbyView";
import GuessingView from "./GuessingView";
import GamePhaseView from "./GamePhaseView";

// ⚠️ Este componente DEBE estar envuelto por AuthProvider y SocketProvider.
const ImpostorGame = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  // 1. Obtener todo el estado, datos derivados y funciones del hook
  const {
    gameState,
    loading,
    error,
    isConnected,
    remainingTime,

    // Datos derivados
    playerState,
    isHost,
    canStartGame,

    // Estados locales simulados (para formularios)
    myClue,
    myVoteTarget,
    myGuessSubmitted,
    impostorTarget,

    // Funciones de emisión con lógica
    emitStartGame,
    emitCancelGame,
    emitSubmitClue,
    emitSubmitVote,
    emitChooseTarget,
    emitSubmitGuess,

    // Función de utilidad
    handleCopyRoomId,
  } = useGameSocket(roomId, userId, navigate);

  // 2. Hooks de formulario (se mantienen aquí ya que manejan el input local)
  // Para la PISTA (GamePhaseView)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: errorsClue },
  } = useForm();

  // Para la ADIVINANZA (GuessingView)
  const {
    register: registerGuess,
    handleSubmit: handleSubmitGuess,
    reset: resetGuess,
    formState: { errors: errorsGuess },
  } = useForm();

  // 3. Handlers de formularios que usan las funciones de emisión del hook

  const onSubmitClue = (data) => {
    if (playerState?.clueGiven) return;
    emitSubmitClue(data.clue, (response) => {
      if (response.success) reset();
    });
  };

  const onSubmitGuess = (data) => {
    if (myGuessSubmitted || !playerState?.isAlive) return;
    emitSubmitGuess(data.guess, (response) => {
      if (response.success) resetGuess();
    });
  };

  // 4. Variables de Renderizado
  const isLobby = gameState.status === "LOBBY";
  const isGuessingMode = gameState.status === "GUESSING";
  const isInGame = gameState.status === "IN_GAME";
  const isVoting = gameState.status === "VOTING";
  const isImpostorChoosing = gameState.status === "IMPOSTOR_CHOOSING";

  // --- RENDERIZADO ---
  if (!userId) {
    navigate("/login");
    return null;
  }
  if (error)
    return <div className="text-danger p-4 text-center">Error: {error}</div>;

  if (loading || !isConnected || gameState.status === "LOADING") {
    return <LoadingView loading={loading} isConnected={isConnected} />;
  }

  if (isLobby) {
    return (
      <LobbyView
        gameState={gameState}
        roomId={roomId}
        user={user}
        isHost={isHost}
        canStartGame={canStartGame}
        handleCopyRoomId={handleCopyRoomId}
        handleStartGame={emitStartGame} // Usamos emitStartGame
        handleCancelGame={emitCancelGame} // Usamos emitCancelGame
      />
    );
  }

  if (isGuessingMode) {
    return (
      <GuessingView
        gameState={gameState}
        playerState={playerState}
        isAlive={playerState?.isAlive ?? true}
        // Formulario Guessing
        handleSubmitGuess={handleSubmitGuess}
        onSubmitGuess={onSubmitGuess}
        registerGuess={registerGuess}
        errorsGuess={errorsGuess}
        myGuessSubmitted={myGuessSubmitted}
      />
    );
  }

  if (isInGame || isVoting || isImpostorChoosing) {
    // Variables calculadas para GamePhaseView
    const currentTurnPlayerId = gameState.turnOrder[gameState.currentTurnIndex];
    const currentTurnPlayer = currentTurnPlayerId
      ? gameState.players.find((p) => p.id === currentTurnPlayerId)
      : undefined;
    const isMyTurn = currentTurnPlayerId === userId;
    const maxTimeSeconds = Math.ceil(gameState.turnDuration / 1000);

    return (
      <GamePhaseView
        gameState={gameState}
        user={user}
        playerState={playerState}
        isHost={isHost}
        remainingTime={remainingTime}
        maxTimeSeconds={maxTimeSeconds}
        // Fases de juego
        isInGame={isInGame}
        isVoting={isVoting}
        isImpostorChoosing={isImpostorChoosing}
        // Turno
        currentTurnPlayer={currentTurnPlayer}
        isMyTurn={isMyTurn}
        // Emisiones
        handleVote={emitSubmitVote} // Renombrado a handleVote en la vista para mantener la semántica
        handleImpostorTarget={emitChooseTarget} // Renombrado para la vista
        // Formulario Clue
        handleSubmitClue={handleSubmit}
        onSubmitClue={onSubmitClue}
        registerClue={register}
        errorsClue={errorsClue}
        myClue={myClue}
        myVoteTarget={myVoteTarget}
        impostorTarget={impostorTarget}
      />
    );
  }

  if (gameState.status === "FINISHED") {
    return (
      <div className="text-center py-5">
        Partida Finalizada. Redirigiendo...
      </div>
    );
  }

  return (
    <div className="text-center py-5">
      Estado de juego desconocido: {gameState.status}.
    </div>
  );
};

export default ImpostorGame;
