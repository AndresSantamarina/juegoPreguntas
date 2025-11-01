// src/hooks/useGameSocket.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import Swal from 'sweetalert2';
import { useSocket } from '../../context/SocketContext.jsx'; // Usamos el socket global

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
    // 1. Obtener socket del contexto global
    const { socket, isConnected } = useSocket();

    // 2. Estados principales del juego
    const [gameState, setGameState] = useState(initialGameState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados locales simulados del componente (necesarios para el renderizado/botones)
    // El componente ImpostorGame usará estos para los formularios, pero los devolvemos para info
    const [myClue, setMyClue] = useState("");
    const [myVoteTarget, setMyVoteTarget] = useState(null);
    const [myGuessSubmitted, setMyGuessSubmitted] = useState(false);
    const [impostorTarget, setImpostorTarget] = useState(null);

    // Lógica del Timer (Modularizada)
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

    // Función central para actualizar el estado del juegoasdasdasdaasd
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

        // Lógica de estados locales que estaban en tu useEffect inicial
        if (isInitialLoad && roomData.players) {
            const currentPlayer = roomData.players.find((p) => p.id === userId);
            if (currentPlayer?.clueGiven) setMyClue(currentPlayer.clueGiven);
            if (currentPlayer?.vote) setMyVoteTarget(currentPlayer.vote);
            if (currentPlayer?.guessGiven) setMyGuessSubmitted(currentPlayer.guessGiven);
        }

    }, [userId]);


    // 3. Efecto de Conexión, Inicialización y Listeners
    useEffect(() => {
        if (!socket || !isConnected || !userId || !roomId) {
            if (!userId) navigate("/login");
            return;
        }

        // 3.1 Inicialización: Obtener el estado del juegoasdasdsadasdasdasda
        emitGetGameState();

        // const onPlayerUpdate = (data) => {
        //     // Usar la función de actualización de estado para garantizar la frescura
        //     setGameState(prev => ({
        //         ...prev,
        //         players: data.players || prev.players // Asegúrate que data.players existe
        //     }));
        // };
        // socket.on('player_update', onPlayerUpdate);

        // 3.2 Handlers de Eventos de Juego (extraídos de tu componente original)
        const handlers = {
            // 'room_state_update': (data) => handleRoomUpdate(data),
            'player_update': (data) => {
                // Asumimos que 'data' contiene la estructura de 'room' completa.asdasdasdasd
                handleRoomUpdate({ room: data });
            },
            'game_started_update': () => {
                // ⏳ PAUSA CRÍTICA: Permite que el evento 'turn_advanced' (que lleva la info del turno)
                // se procese y actualice el estado del turno antes de llamar a emitGetGameState.
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
                setMyClue(""); setMyVoteTarget(null); setImpostorTarget(null); // Resetear estados locales
            },
            'impostor_choosing': (data) => {
                // Usa gameState.myRole para la lógica de Swal
                setGameState(prev => {
                    const isImpostor = prev.myRole === "IMPOSTOR"; // 👈 Obtener el rol del estado PREVIO o actual
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
                // 🔑 ACLARACIÓN: Esta fase ocurre cuando el Impostor es el más votado.
                setMyGuessSubmitted(false);
                Swal.fire({
                    title: "¡Última Oportunidad del Impostor! 🧐",
                    text: data.message || "El Impostor tiene una chance de adivinar la palabra clave para salvarse.",
                    icon: "warning",
                    confirmButtonText: "Entendido"
                });
                // setMyGuessSubmitted(false); 
                setGameState(prev => ({
                    ...prev,
                    ...data,
                    words: data.words || [],
                    status: 'IMPOSTOR_GUESSING' // Asumo que este es el estado del backendasd
                }));
            },
            'guess_submitted': (data) => {

                // 🔑 NUEVA LÓGICA: Si el turno se ha reseteado al índice 0
                // (y no era el primer turno), es una señal de que AMBOS FALLARON
                const isGuessingRestart = data.currentTurnIndex === 0 && gameState.currentTurnIndex === 1; // Ajusta el 1 a la cantidad de jugadores -1 que tengas

                if (isGuessingRestart) {
                    setMyGuessSubmitted(false); // <--- REINICIA ESTADO LOCAL
                }

                setGameState(prev => ({
                    ...prev,
                    // Sobrescribir el estado con los nuevos datos de la sala
                    players: data.players || prev.players,
                    ...data // Esto sobrescribe otras propiedades (currentTurnIndex)
                }));
                Swal.fire({ title: "Adivinanza Recibida", text: data.message, icon: "info", timer: 2000, showConfirmButton: false });
            },
            'round_new': (data) => {
                Swal.fire({
                    title: "¡Nueva Ronda!", text: data.message || `Comienza la Ronda ${data.currentRound}.`,
                    icon: "info", timer: 3000, showConfirmButton: false
                });
                // Resetear estados locales
                setMyClue(""); setMyVoteTarget(null); setMyGuessSubmitted(false); setImpostorTarget(null);
                setGameState(prev => ({ ...prev, ...data }));
            },
            'turn_skipped_timeout': (data) => {
                Swal.fire({ title: "¡Turno Perdido!", text: data.message, icon: "warning", timer: 2000, showConfirmButton: false });
            },
            'guessing_next_attempt': (data) => {
                Swal.fire({ title: "¡Ambos Fallaron!", text: `La palabra correcta era: ${data.secretWord}. Tienen otra oportunidad.`, icon: "error", confirmButtonText: "¡Adivinar de Nuevo!", });
                setMyGuessSubmitted(false); // Permite adivinar de nuevo
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
            'game_status_update': (data) => handleRoomUpdate({ room: data }), // Asumimos que data tiene la estructura de 'room'
        };

        // 3.3 Suscribir a todos los listenersasdasd
        const listenerKeys = Object.keys(handlers);
        listenerKeys.forEach(eventName => socket.on(eventName, handlers[eventName]));

        // 3.4 Cleanup 
        return () => {
            listenerKeys.forEach(eventName => socket.off(eventName, handlers[eventName]));
        };
    }, [socket, isConnected, userId, roomId, navigate]); // Incluye gameState.myRole en deps

    // 4. Funciones de Emisión para el Componente Principal
    const emitEvent = (eventName, data, callback) => {
        // Asegurarse de que callback sea al menos una función vacía si no se pasa
        const responseCallback = typeof callback === 'function' ? callback : () => { };

        if (socket && socket.connected) {
            const payload = { ...data, roomId, userId };
            // socket.emit recibe la función segura
            socket.emit(eventName, payload, responseCallback);
        } else {
            console.warn(`Intento de enviar ${eventName} con socket desconectado.`);
            // Si el socket no está conectado, llama al callback seguro inmediatamente
            responseCallback({ success: false, message: "Socket no conectado." });
        }
    };

    // 5. Handlers de Emisión con lógica de respuesta (Extraídos de ImpostorGame.jsx)asd

    const emitGetGameState = (callback = () => { }) => {
        setLoading(true);
        emitEvent('getGameState', {}, (response) => {
            setLoading(false);
            if (!response.success) {
                setError(response.message || "No se pudo cargar la sala.");
                Swal.fire("Error", response.message || "No se pudo cargar la sala.", "error")
                    .then(() => navigate("/impostor"));
            }
            // ✅ Esto actualizará el estado del frontend con el rol y la palabra
            handleRoomUpdate(response, true);
            callback(response);
        });
    };

    // En emitStartGame, ya tienes la corrección, solo asegúrate que la llamada interna también es segura
    const emitStartGame = (callback = () => { }) => {
        emitEvent('startGame', {}, (response) => {
            if (!response.success) {
                Swal.fire("Error", response.message || "Error al iniciar el juego.", "error");
                callback(response); // Aseguramos el callback incluso en error
            } else {
                // ✅ FORZAMOS la obtención del estado para actualizar el rol/palabra del jugador local
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
                        // 🔑 CAMBIO CLAVE: Solo fija el voto si el backend te devuelve la 'room',
                        // indicando que el juego sigue en VOTING.
                        if (response.room) {
                            setMyVoteTarget(targetUserId);
                        } else {
                            // La votación ha terminado, limpiamos el estado local para
                            // esperar la actualización de fase (broadcast).
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
                // ❌ ELIMINAR ESTA LÍNEA (Dejar que el 'guess_submitted' listener haga el trabajo)
                // setMyGuessSubmitted(true); // <--- QUITAR

                if (!response.isFinished) {
                    // Usa el playerState para el mensaje local
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
        // Usamos 'guess' para que coincida con el backend
        emitEvent('impostorSubmitGuess', { guess: guessText }, (response) => {
            if (response.success) {
                setMyGuessSubmitted(true);
                // El backend enviará 'round_new' o 'game_finished' después de procesasdasdarasd
                if (response.currentStatus !== 'FINISHED') {
                    Swal.fire({ title: "Adivinanza Enviada", text: response.message, icon: "info", timer: 2000, showConfirmButton: false });
                }
            } else {
                Swal.fire("Error", response.message || "No se pudo enviar la adivinanza.", "error");
            }
            if (callback) callback(response);
        });
    };

    console.log("------------------- INFO CRÍTICA DEL HOOK -------------------");
    console.log("ID LOCAL PASADA (userId):", userId, " | Tipo:", typeof userId);
    console.log("Contenido de gameState.players:", gameState.players); // << LOG MÁS IMPORTANTE

    // 6. Valores devueltos por el hook
    return {
        gameState,
        loading,
        error,
        isConnected, // Estado del socket global
        remainingTime, // Para el Timer de UI

        // Datos derivados para UI (simplifica ImpostorGame.jsx)
        playerState: gameState.players?.find((p) => p.id?.toString() === userId.toString()),
        isHost: gameState.players.find((p) => p.id === userId)?.isHost || false,
        canStartGame: gameState.players.length >= 3,

        // Estados locales simulados
        myClue,
        myVoteTarget,
        myGuessSubmitted,
        impostorTarget,

        // Funciones de Emisión con lógica de UI integrada
        emitStartGame,
        emitCancelGame,
        emitSubmitClue,
        emitSubmitVote,
        emitChooseTarget,
        emitSubmitGuess,
        emitImpostorSubmitGuess,
        emitGetGameState, // También la exportamos por si acaso 

        // Función de utilidad
        handleCopyRoomId: () => {
            navigator.clipboard.writeText(roomId).then(() =>
                Swal.fire({ title: "Copiado ✅", text: `ID de sala (${roomId}) copiado.`, icon: "success", timer: 1500, showConfirmButton: false })
            );
        },
    };
};