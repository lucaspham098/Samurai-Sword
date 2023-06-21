import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client'
import { SERVER_URL } from '../../utils/utils'
import { useParams } from 'react-router-dom';
import { connect } from 'http2';

const Lobby = () => {
    const effectRan = useRef(false)
    const { room } = useParams()

    const [players, setPlayers] = useState<string[]>()

    // const socket = io(`${SERVER_URL}`);

    useEffect(() => {
        const socket = io(`http://localhost:3001`)

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
            })

        }
        effectRan.current = true

    }, [])


    return (
        <div>
            <p> </p>
            <p>Players</p>
            {players && players.map(player => {
                return <p key={player}>{player}</p>
            })}
        </div>
    );
};

export default Lobby;

