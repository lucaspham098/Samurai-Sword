import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client'
import JoinRoomModal from '../../components/JoinRoomModal';

type HomeProp = {
    socket: Socket;
}

const Home = ({ socket }: HomeProp) => {
    const navigate = useNavigate()
    const [room, setRoom] = useState<string>('')
    const [findRoom, setFindRoom] = useState<string>()
    const [name, setName] = useState<string | null>(null)
    const [joinRoomModal, setJoinRoomModal] = useState<boolean>(false)
    const [joinRoomError, setJoinRoomError] = useState('')


    useEffect(() => {
        if (findRoom) {
            socket.emit('findRoom', findRoom)
            socket.on('navToLobby', () => {
                navigate(`/lobby/${findRoom}/${name}`)
            })
            socket.on('errorMessage', message => {
                setJoinRoomError(message);
            })

        }
    }, [findRoom, name, navigate, socket]);

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
            navigate(`lobby/${room}/${name}`)
        }
    }, [room, name, navigate])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFindRoom(event.currentTarget.room.value)
    }


    return (
        <div>
            <label htmlFor="room">Name</label>
            <input type="text" name='playerName' onChange={(event) => { setName(event.target.value) }} />
            <button className='home__button' onClick={() => {
                roomGenerator()
            }}>Create Room</button>
            <button className='home__button' onClick={() => setJoinRoomModal(true)}>Join Room</button>
            {joinRoomModal && <JoinRoomModal handleSubmit={handleSubmit} errorMessage={joinRoomError} />}
        </div>
    );
};

export default Home;