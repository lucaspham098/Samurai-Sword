import React, { useEffect, useState, useRef, useTransition } from 'react';
import './Lobby.scss'
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
            socket.on('5PlayerGameStarted', () => {
                navigate(`/5-player-game/${room}`)
            })
            socket.on('6PlayerGameStarted', () => {
                navigate(`/6-player-game/${room}`)
            })
            socket.on('7PlayerGameStarted', () => {
                navigate(`/7-player-game/${room}`)
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
        if (playersData.length === 5) {
            socket.emit('5PlayerStartGame', room);
        }
        if (playersData.length === 6) {
            socket.emit('6PlayerStartGame', room);
        }
        if (playersData.length === 7) {
            socket.emit('7PlayerStartGame', room);
        }
    };



    return (
        <div>
            <h1 className='lobby__title'>Room code is {room}</h1>
            <div className="lobby__container">
                <h2 className='lobby__heading'>Required Players : 3-7</h2>
                <div className="lobby__players-container">
                    {playersData &&
                        playersData.map((player, index) => {
                            return <p className='lobby__players' key={index}>{player.name}</p>;
                        })
                    }
                </div>
                {isLeader && <button className='button button--form button--bottom' onClick={onStartGame}>Start Game</button>}
                {!isLeader &&
                    <p>Waiting for leader to start game ...</p>
                }
            </div>
        </div>

    );
};

export default Lobby;


