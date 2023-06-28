import React, { useEffect, useState, useRef, useTransition } from 'react';
import { Socket } from 'socket.io-client'
import { useParams } from 'react-router-dom';


type LobbyProps = {
    handleStartGame: () => void,
    socket: Socket,
    initGameState: () => void
}

const Lobby = ({ handleStartGame, socket, initGameState }: LobbyProps) => {
    const effectRan = useRef(false);
    const { room } = useParams();

    const [players, setPlayers] = useState<string[]>([]);
    const [isLeader, setIsLeader] = useState<boolean>(false)

    useEffect(() => {
        if (!effectRan.current) {
            socket.emit('createRoom', room);
            socket.on('joinCreatedRoom', () => {
                socket.emit('joinRoom', room);
            });
            socket.on('joinedRoom', () => {
                socket.emit('askForPlayers', room);
            });
            socket.on('players', (players) => {
                console.log(players);
                setPlayers(players);
                if (socket.id === players[0]) {
                    setIsLeader(true)
                }
            });
            socket.on('gameStarted', () => {
                handleStartGame();
            });

            effectRan.current = true;
        }
    }, []);

    const onStartGame = () => {
        socket.emit('startGame', room);
        initGameState()
    };



    return (
        <div>
            <p>Players</p>
            {players &&
                players.map((player) => {
                    return <p key={player}>{player}</p>;
                })}
            {isLeader && <button onClick={onStartGame}>Start Game</button>}
        </div>
    );
};

export default Lobby;


