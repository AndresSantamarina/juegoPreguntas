import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { useGameSocket } from "../hooks/useGameSocket";

import LoadingView from "./LoadingView";
import LobbyView from "./LobbyView";
import GuessingView from "./GuessingView";
import GamePhaseView from "./GamePhaseView";

const ImpostorGame = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  const {
    gameState,
    loading,
    error,
    isConnected,
    remainingTime,
    playerState,
    isHost,
    canStartGame,
    myClue,
    myVoteTarget,
    myGuessSubmitted,
    impostorTarget,

    emitStartGame,
    emitCancelGame,
    emitSubmitClue,
    emitSubmitVote,
    emitChooseTarget,
    emitSubmitGuess,
    emitImpostorSubmitGuess,
    handleCopyRoomId,
  } = useGameSocket(roomId, userId, navigate);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: errorsClue },
  } = useForm();

  const {
    register: registerGuess,
    handleSubmit: handleSubmitGuess,
    reset: resetGuess,
    formState: { errors: errorsGuess },
  } = useForm();

  const onSubmitClue = (data) => {
    if (playerState?.clueGiven) return;
    emitSubmitClue(data.clue, (response) => {
      if (response.success) reset();
    });
  };

  const onSubmitGuess = (data) => {
    if (myGuessSubmitted || !playerState?.isAlive) return;

    if (gameState.status === "IMPOSTOR_GUESSING") {
      emitImpostorSubmitGuess(data.guess, (response) => {
        if (response.success) resetGuess();
      });
    } else if (gameState.status === "GUESSING") {
      emitSubmitGuess(data.guess, (response) => {
        if (response.success) resetGuess();
      });
    }
  };
  const isLobby = gameState.status === "LOBBY";
  const isGuessingMode = gameState.status === "GUESSING";
  const isInGame = gameState.status === "IN_GAME";
  const isVoting = gameState.status === "VOTING";
  const isImpostorChoosing = gameState.status === "IMPOSTOR_CHOOSING";
  const isImpostorGuessing = gameState?.status === "IMPOSTOR_GUESSING";
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
        handleStartGame={emitStartGame}
        handleCancelGame={emitCancelGame}
      />
    );
  }

  if (isGuessingMode) {
    return (
      <GuessingView
        gameState={gameState}
        playerState={playerState}
        isAlive={playerState?.isAlive ?? true}
        handleSubmitGuess={handleSubmitGuess}
        onSubmitGuess={onSubmitGuess}
        registerGuess={registerGuess}
        errorsGuess={errorsGuess}
        myGuessSubmitted={myGuessSubmitted}
      />
    );
  }

  if (isInGame || isVoting || isImpostorChoosing || isImpostorGuessing) {
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
        isInGame={isInGame}
        isVoting={isVoting}
        isImpostorChoosing={isImpostorChoosing}
        isImpostorGuessing={isImpostorGuessing}
        currentTurnPlayer={currentTurnPlayer}
        isMyTurn={isMyTurn}
        handleVote={emitSubmitVote}
        handleImpostorTarget={emitChooseTarget}
        handleSubmitClue={handleSubmit}
        onSubmitClue={onSubmitClue}
        registerClue={register}
        errorsClue={errorsClue}
        myClue={myClue}
        myVoteTarget={myVoteTarget}
        impostorTarget={impostorTarget}
        handleSubmitGuess={handleSubmitGuess}
        onSubmitGuess={onSubmitGuess}
        registerGuess={registerGuess}
        errorsGuess={errorsGuess}
        myGuessSubmitted={myGuessSubmitted}
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
