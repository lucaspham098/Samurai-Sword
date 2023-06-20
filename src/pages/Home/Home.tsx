import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
import JoinRoomModal from '../../components/JoinRoomModal';

const Home = () => {
    const navigate = useNavigate()
    const [room, setRoom] = useState<string>('')
    const [joinRoom, setJoinRoom] = useState<string>()
    const [joinRoomModal, setJoinRoomModal] = useState<boolean>(false)
    const [joinRoomError, setJoinRoomError] = useState('')

    const socket = io(`http://localhost:3001`)
    socket.on('connect', () => {
        if (joinRoom) {
            socket.emit('joinRoom', joinRoom)
        }
        socket.on('navToLobby', () => {
            navigate(`/lobby/${joinRoom}`)
        })
        socket.on('errorMessage', message => {
            console.log('working')
            setJoinRoomError(message)
        })
    })

    const roomGenerator = () => {
        const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWSYZ123456789'
        const characterArr = characters.split('')
        const roomCode = []
        for (let i = 0; i < 6; i++) {
            const index = Math.floor(Math.random() * 36)
            roomCode.push(characterArr[index])
        }
        if (roomCode.length === 6) {
            setRoom(roomCode.join(''))
        }
    }

    useEffect(() => {
        if (room) {
            navigate(`/lobby/${room}`)
        }
    }, [room])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setJoinRoom(event.currentTarget.room.value)
    }

    return (
        <div>
            <button className='home__button' onClick={() => {
                roomGenerator()
            }}>Create Room</button>
            <button className='home__button' onClick={() => setJoinRoomModal(true)}>Join Room</button>
            {joinRoomModal && <JoinRoomModal handleSubmit={handleSubmit} errorMessage={joinRoomError} />}
        </div>
    );
};

export default Home;