import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client'
import { SERVER_URL } from '../../utils/utils'
import { useParams } from 'react-router-dom';

const Lobby = () => {
    const effectRan = useRef(false)
    const { room } = useParams()

    const [players, setPlayer] = useState()

    // const socket = io(`${SERVER_URL}`);
    const socket = io(`http://localhost:3001`)

    useEffect(() => {

        if (effectRan.current === false) {
            socket.on('connect', () => {
                console.log(`connected to socket with this id ${socket.id}`)
                socket.emit('createRoom', room)
                socket.on('joinCreatedRoom', () => {
                    socket.emit('joinRoom', room)
                })
                socket.emit('askForPlayers', room)
                socket.on('players', players => {
                    console.log('receive players')
                    console.log(players)
                })
            })
        }

        effectRan.current = true

    }, [])

    return (
        <div>
            <p>Players</p>
            <p></p>
        </div>
    );
};

export default Lobby;