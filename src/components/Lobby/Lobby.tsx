import React, { useEffect, useState, useRef, useTransition } from 'react';
import { Socket } from 'socket.io-client'
import { useParams } from 'react-router-dom';


type LobbyProps = {
    handleStartGame: () => void,
    socket: Socket,
    initGameState: () => void
    handleSetPlayers: (player: object[]) => void
}
interface PlayersData {
    socketID: string,
    role: string,
    character: string,
    hand: PlayableCard[],
    attacks: number,
    health: number,
    honourPoints: number
}

interface PlayableCard {
    type: string;
    name: string;
    range?: number;
    damage?: number;
}

const Lobby = ({ handleStartGame, socket, initGameState, handleSetPlayers }: LobbyProps) => {
    const effectRan = useRef(false);
    const { room } = useParams();

    const [playersData, setPlayersData] = useState<PlayersData[]>([]);
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
            socket.on('players', (playersData) => {
                setPlayersData(playersData);
                handleSetPlayers(playersData)
                if (socket.id === playersData[0].socketID) {
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
            {playersData &&
                playersData.map((player, index) => {
                    return <p key={index}>{player.socketID}</p>;
                })}
            {isLeader && <button onClick={onStartGame}>Start Game</button>}
        </div>
    );
};

export default Lobby;


