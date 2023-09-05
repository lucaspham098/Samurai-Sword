import React, { useEffect, useState, useRef, useTransition } from 'react';
import { Socket } from 'socket.io-client'
import { useNavigate, useParams } from 'react-router-dom';


type LobbyProps = {
    socket: Socket,
}
interface PlayersData {
    name: string,
    socketID: string,
    role: string,
    character: string,
    hand: PlayableCard[],
    attacks: number,
    health: number,
    honourPoints: number,
    focus: number,
    armor: number,
    fastDraw: number,
    bushido: boolean
}

interface PlayableCard {
    type: string;
    name: string;
    range?: number;
    damage?: number;
}

const Lobby = ({ socket }: LobbyProps) => {
    const effectRan = useRef(false);
    const { room } = useParams();
    const { name } = useParams()
    const navigate = useNavigate()

    const [playersData, setPlayersData] = useState<PlayersData[]>([]);
    const [isLeader, setIsLeader] = useState<boolean>(false)


    useEffect(() => {
        if (!effectRan.current) {
            socket.emit('createRoom', room, name);
            socket.on('joinCreatedRoom', () => {
                socket.emit('joinRoom', room, name);
            });
            socket.on('joinedRoom', () => {
                socket.emit('askForPlayers', room);
            });
            socket.on('players', (playersData) => {
                setPlayersData(playersData);
                if (socket.id === playersData[0].socketID) {
                    setIsLeader(true)
                }
            })
            socket.on('3PlayerGameStarted', () => {
                navigate(`/3-player-game/${room}`)
            })
            socket.on('4PlayerGameStarted', () => {
                navigate(`/4-player-game/${room}`)
            })

            effectRan.current = true;
        }
    }, []);

    const onStartGame = () => {
        if (playersData.length === 3) {
            socket.emit('3PlayerStartGame', room);
        }
        if (playersData.length === 4) {
            socket.emit('4PlayerStartGame', room);
        }
    };



    return (
        <div>
            <h1>Room code is {room}</h1>
            <p>Players</p>
            {playersData &&
                playersData.map((player, index) => {
                    return <p key={index}>{player.name}</p>;
                })}
            {isLeader && <button onClick={onStartGame}>Start Game</button>}
        </div>
    );
};

export default Lobby;


