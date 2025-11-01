import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useSocket } from '../../context/SocketContext.jsx';

const TURN_TIME_MS = 30000;

const initialGameState = {
    status: "LOBBY",
    players: [],
    currentRound: 0,
    turnOrder: [],
    currentTurnIndex: -1,
    turnStartTime: null,
    turnDuration: TURN_TIME_MS,
    words: [],
    myRole: null,
    myKeyword: null,
};

export const useGameSocket = (roomId, userId, navigate) => {
    const { socket, isConnected } = useSocket();
    const [gameState, setGameState] = useState(initialGameState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [myClue, setMyClue] = useState("");
    const [myVoteTarget, setMyVoteTarget] = useState(null);
    const [myGuessSubmitted, setMyGuessSubmitted] = useState(false);
    const [impostorTarget, setImpostorTarget] = useState(null);

    const calculateRemainingTime = useCallback(() => {
        if (gameState.turnStartTime) {
            const startTime = new Date(gameState.turnStartTime).getTime();
            const now = new Date().getTime();
            const elapsed = now - startTime;
            const remaining = Math.max(0, gameState.turnDuration - elapsed);
            return Math.ceil(remaining / 1000);
        }
        return Math.ceil(gameState.turnDuration / 1000);
    }, [gameState.turnStartTime, gameState.turnDuration]);

    const maxTimeSeconds = Math.ceil(gameState.turnDuration / 1000);
    const [remainingTime, setRemainingTime] = useState(maxTimeSeconds);

    useEffect(() => {
        let timerId;
        if (gameState.status === "IN_GAME" && gameState.turnStartTime) {
            timerId = setInterval(() => {
                const time = calculateRemainingTime();
                setRemainingTime(time);
                if (time <= 0) {
                    clearInterval(timerId);
                }
            }, 500);
        } else {
            setRemainingTime(maxTimeSeconds);
        }
        return () => clearInterval(timerId);
    }, [
        gameState.status,
        gameState.turnStartTime,
        gameState.turnDuration,
        calculateRemainingTime,
        maxTimeSeconds
    ]);

    const handleRoomUpdate = useCallback((data, isInitialLoad = false) => {
        console.log('[LOG STATE] Antes de actualizar. Turn Index PREVIO:', gameState.currentTurnIndex);
        const { room: roomData, myRole, myKeyword } = data;

        setGameState(prev => {
            const newGameState = {
                ...prev,
                status: roomData.status,
                players: roomData.players || prev.players,
                currentRound: roomData.currentRound || prev.currentRound,
                turnOrder: roomData.turnOrder || prev.turnOrder,
                currentTurnIndex: roomData.currentTurnIndex ?? -1,
                turnStartTime: roomData.turnStartTime || null,
                turnDuration: roomData.turnDuration || TURN_TIME_MS,
                words: roomData.words || prev.words || [],
                myRole: myRole || prev.myRole,
                myKeyword: myKeyword || prev.myKeyword,
            };
            console.log('[LOG STATE] Después de actualizar. Turn Index NUEVO:', newGameState.currentTurnIndex);
            return newGameState;
        });

        if (isInitialLoad && roomData.players) {
            const currentPlayer = roomData.players.find((p) => p.id === userId);
            if (currentPlayer?.clueGiven) setMyClue(currentPlayer.clueGiven);
            if (currentPlayer?.vote) setMyVoteTarget(currentPlayer.vote);
            if (currentPlayer?.guessGiven) setMyGuessSubmitted(currentPlayer.guessGiven);
        }

    }, [userId]);

    useEffect(() => {
        if (!socket || !isConnected || !userId || !roomId) {
            if (!userId) navigate("/login");
            return;
        }

        emitGetGameState();

        const handlers = {
            'player_update': (data) => {
                handleRoomUpdate({ room: data });
            },
            'game_started_update': () => {
                emitGetGameState();
            },
            'turn_advanced': (data) => {
                console.log('[LOG TURN] Turno avanzado. Index:', data.currentTurnIndex, 'Jugador:', data.nextTurnUsername);
                setGameState(prev => ({
                    ...prev,
                    ...data,
                    currentTurnUsername: data.nextTurnUsername,
                }));
            },
            'voting_started': (data) => {
                Swal.fire({ title: "¡Votación!", text: data.message, icon: "info", timer: 3000, showConfirmButton: false });
                setGameState(prev => ({ ...prev, ...data }));
                setMyClue(""); setMyVoteTarget(null); setImpostorTarget(null);
            },
            'impostor_choosing': (data) => {
                setGameState(prev => {
                    const isImpostor = prev.myRole === "IMPOSTOR";
                    Swal.fire({
                        title: "¡Ataque del Impostor!",
                        text: data.message,
                        icon: isImpostor ? "warning" : "error",
                        timer: isImpostor ? null : 5000,
                        showConfirmButton: isImpostor
                    });
                    return ({ ...prev, ...data });
                });
            },
            'guessing_started': (data) => {
                Swal.fire({ title: "¡Modo de 2 Jugadores!", text: data.message, icon: "warning", confirmButtonText: "Entendido" });
                setGameState(prev => ({ ...prev, ...data, words: data.words }));
            },
            'guessing_impostor_started': (data) => {
                setMyGuessSubmitted(false);
                Swal.fire({
                    title: "¡Última Oportunidad del Impostor! 🧐",
                    text: data.message || "El Impostor tiene una chance de adivinar la palabra clave para salvarse.",
                    icon: "warning",
                    confirmButtonText: "Entendido"
                });
                setGameState(prev => ({
                    ...prev,
                    ...data,
                    words: data.words || [],
                    status: 'IMPOSTOR_GUESSING'
                }));
            },
            'guess_submitted': (data) => {
                const isGuessingRestart = data.currentTurnIndex === 0 && gameState.currentTurnIndex === 1;

                if (isGuessingRestart) {
                    setMyGuessSubmitted(false);
                }

                setGameState(prev => ({
                    ...prev,
                    players: data.players || prev.players,
                    ...data
                }));
                Swal.fire({ title: "Adivinanza Recibida", text: data.message, icon: "info", timer: 2000, showConfirmButton: false });
            },
            'round_new': (data) => {
                Swal.fire({
                    title: "¡Nueva Ronda!", text: data.message || `Comienza la Ronda ${data.currentRound}.`,
                    icon: "info", timer: 3000, showConfirmButton: false
                });
                setMyClue(""); setMyVoteTarget(null); setMyGuessSubmitted(false); setImpostorTarget(null);
                setGameState(prev => ({ ...prev, ...data }));
            },
            'turn_skipped_timeout': (data) => {
                Swal.fire({ title: "¡Turno Perdido!", text: data.message, icon: "warning", timer: 2000, showConfirmButton: false });
            },
            'guessing_next_attempt': (data) => {
                Swal.fire({ title: "¡Ambos Fallaron!", text: `La palabra correcta era: ${data.secretWord}. Tienen otra oportunidad.`, icon: "error", confirmButtonText: "¡Adivinar de Nuevo!", });
                setMyGuessSubmitted(false);
                setGameState(prev => ({ ...prev, players: prev.players.map(p => ({ ...p, guessGiven: false })), ...data }));
            },
            'game_finished': (data) => {
                const myRole = gameState.myRole;
                const winnerRole = data.winner;
                let icon = (winnerRole === "Innocents" && myRole === "INNOCENT") || (winnerRole === "Impostor" && myRole === "IMPOSTOR") ? "success" : "error";
                Swal.fire({
                    title: "¡Juego Terminado! 🎉", html: `Ganador: <strong>${data.winner}</strong><br/>${data.message}`,
                    icon: icon, confirmButtonText: "Volver a la Home",
                }).then(() => navigate("/impostor"));
                setGameState(prev => ({ ...prev, status: "FINISHED" }));
            },
            'room_closed': (data) => {
                Swal.fire({ title: "Sala Cerrada", text: data.message || "El anfitrión ha cancelado la partida.", icon: "info", confirmButtonText: "Volver a Impostor Home" }).then(() => navigate("/impostor"));
            },
            'game_status_update': (data) => handleRoomUpdate({ room: data }),
        };
        const listenerKeys = Object.keys(handlers);
        listenerKeys.forEach(eventName => socket.on(eventName, handlers[eventName]));
        return () => {
            listenerKeys.forEach(eventName => socket.off(eventName, handlers[eventName]));
        };
    }, [socket, isConnected, userId, roomId, navigate]);

    const emitEvent = (eventName, data, callback) => {
        const responseCallback = typeof callback === 'function' ? callback : () => { };

        if (socket && socket.connected) {
            const payload = { ...data, roomId, userId };
            socket.emit(eventName, payload, responseCallback);
        } else {
            console.warn(`Intento de enviar ${eventName} con socket desconectado.`);
            responseCallback({ success: false, message: "Socket no conectado." });
        }
    };

    const emitGetGameState = (callback = () => { }) => {
        setLoading(true);
        emitEvent('getGameState', {}, (response) => {
            setLoading(false);
            if (!response.success) {
                setError(response.message || "No se pudo cargar la sala.");
                Swal.fire("Error", response.message || "No se pudo cargar la sala.", "error")
                    .then(() => navigate("/impostor"));
            }
            handleRoomUpdate(response, true);
            callback(response);
        });
    };

    const emitStartGame = (callback = () => { }) => {
        emitEvent('startGame', {}, (response) => {
            if (!response.success) {
                Swal.fire("Error", response.message || "Error al iniciar el juego.", "error");
                callback(response);
            } else {
                emitGetGameState(() => {
                    callback(response);
                });
            }
        });
    };

    const emitCancelGame = () => {
        Swal.fire({
            title: "¿Cancelar Partida? ❌", text: "Esto cerrará la sala y desconectará a todos los jugadores.", icon: "warning",
            showCancelButton: true, confirmButtonText: "Sí, Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                emitEvent("cancelGame", {});
            }
        });
    };

    const emitSubmitClue = (clue, callback) => {
        const clueText = clue.toUpperCase().trim();
        emitEvent('submitClue', { clue: clueText }, (response) => {
            if (response.success) {
                setMyClue(clueText);
            } else {
                Swal.fire("Error", response.message || "No se pudo enviar la pista.", "error");
            }
            if (callback) callback(response);
        });
    };

    const emitSubmitVote = (targetUserId, callback) => {
        Swal.fire({
            title: `¿Votar por ${gameState.players.find((p) => p.id === targetUserId)?.name}?`,
            text: "Tu voto es definitivo.", icon: "question", showCancelButton: true, confirmButtonText: "Sí, Votar",
        }).then((result) => {
            if (result.isConfirmed) {
                emitEvent('submitVote', { targetId: targetUserId }, (response) => {
                    if (response.success) {
                        if (response.room) {
                            setMyVoteTarget(targetUserId);
                        } else {
                            setMyVoteTarget(null);
                        }
                    } else {
                        Swal.fire("Error", response.message || "No se pudo registrar tu voto.", "error");
                    }
                    if (callback) callback(response);
                });
            }
        });
    };

    const emitChooseTarget = (targetUserId, callback) => {
        Swal.fire({
            title: `¿Eliminar a ${gameState.players.find((p) => p.id === targetUserId)?.name}?`,
            text: "El jugador perderá 1 vida.", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, Atacar",
        }).then((result) => {
            if (result.isConfirmed) {
                emitEvent('chooseTarget', { targetId: targetUserId }, (response) => {
                    if (response.success) {
                        setImpostorTarget(targetUserId);
                        Swal.fire({ title: "¡Ataque Enviado!", text: response.message, icon: "success", timer: 2000, showConfirmButton: false });
                    } else {
                        Swal.fire("Error", response.message || "No se pudo elegir el objetivo.", "error");
                    }
                    if (callback) callback(response);
                });
            }
        });
    };

    const emitSubmitGuess = (guessedWord, callback) => {
        const guessText = guessedWord.toUpperCase().trim();
        emitEvent('submitGuess', { guessedWord: guessText }, (response) => {
            if (response.success) {

                if (!response.isFinished) {
                    Swal.fire({ title: "Adivinanza Enviada", text: "Esperando el broadcast del juego...", icon: "info", timer: 2000, showConfirmButton: false });
                }
            } else {
                Swal.fire("Error", response.message || "No se pudo enviar la adivinanza.", "error");
            }
            if (callback) callback(response);
        });
    };

    const emitImpostorSubmitGuess = (guessedWord, callback) => {
        const guessText = guessedWord.toUpperCase().trim();
        emitEvent('impostorSubmitGuess', { guess: guessText }, (response) => {
            if (response.success) {
                setMyGuessSubmitted(true);
                if (response.currentStatus !== 'FINISHED') {
                    Swal.fire({ title: "Adivinanza Enviada", text: response.message, icon: "info", timer: 2000, showConfirmButton: false });
                }
            } else {
                Swal.fire("Error", response.message || "No se pudo enviar la adivinanza.", "error");
            }
            if (callback) callback(response);
        });
    };

    return {
        gameState,
        loading,
        error,
        isConnected,
        remainingTime,

        playerState: gameState.players?.find((p) => p.id?.toString() === userId.toString()),
        isHost: gameState.players.find((p) => p.id === userId)?.isHost || false,
        canStartGame: gameState.players.length >= 3,

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
        emitGetGameState,

        handleCopyRoomId: () => {
            navigator.clipboard.writeText(roomId).then(() =>
                Swal.fire({ title: "Copiado ✅", text: `ID de sala (${roomId}) copiado.`, icon: "success", timer: 1500, showConfirmButton: false })
            );
        },
    };
};