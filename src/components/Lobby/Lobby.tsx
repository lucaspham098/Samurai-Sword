import React, { useEffect, useState, useRef, useTransition } from 'react';
import io from 'socket.io-client'
import { SERVER_URL } from '../../utils/utils'
import { useNavigate, useParams } from 'react-router-dom';
import { connect } from 'http2';

type LobbyProps = {
    handleStartGame: () => void
}

const Lobby = ({ handleStartGame }: LobbyProps) => {
    const effectRan = useRef(false)
    const { room } = useParams()


    const [players, setPlayers] = useState<string[]>()
    const [startGame, setStartGame] = useState(false)

    // const socket = io(`${SERVER_URL}`);
    const socket = io(`http://localhost:3001`)

    useEffect(() => {

        if (effectRan.current === false) {
            socket.on('connect', async () => {
                console.log(`connected to socket with this id ${socket.id}`)
                socket.emit('createRoom', room)
                socket.on('joinCreatedRoom', () => {
                    socket.emit('joinRoom', room)
                })
                socket.on('joinedRoom', () => {
                    socket.emit('askForPlayers', room)

                })
                socket.on('players', players => {
                    console.log(players)
                    setPlayers(players)
                })
                socket.on('gameStarted', () => {
                    handleStartGame()
                })
            })

        }

        effectRan.current = true

    }, [])

    const onStartGame = () => {
        socket.emit('startGame', room)
    }


    return (
        <div>
            <p> </p>
            <p>Players</p>
            {players && players.map(player => {
                return <p key={player}>{player}</p>
            })}
            <button onClick={() => { onStartGame() }}>Start Game</button>
        </div>
    );
};

export default Lobby;

