import React, { FormEvent, useEffect, useState } from 'react';
import './Home.scss'
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client'
import JoinRoomModal from '../../components/JoinRoomModal';
import HomeButton from '../../components/HomeButton/HomeButton';
import TabTitleChanger from '../../components/TabTitleChanger/TabTitleChanger';

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
    }, [findRoom]);

    const roomGenerator = () => {
        const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWSYZ'
        const characterArr = characters.split('')
        const roomCode = []
        for (let i = 0; i < 4; i++) {
            const index = Math.floor(Math.random() * characterArr.length)
            roomCode.push(characterArr[index])
        }
        if (roomCode.length === 4) {
            setRoom(roomCode.join(''))
        }
    }

    useEffect(() => {
        if (room) {
            navigate(`lobby/${room}/${name}`)
        }
    }, [room])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFindRoom((event.currentTarget.room.value).toUpperCase())
    }

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setName(event.currentTarget.playerName.value)
    }

    const handleCloseModal = () => {
        setJoinRoomModal(false)
        setJoinRoomError('')
    }

    const handleRemoveError = () => {
        setJoinRoomError('')
    }


    return (
        <div>
            <TabTitleChanger />
            <HomeButton />

            <div className="home__title-flex-container">
                <h1 className='home__title home__title--top'>SAMURAI</h1>
                <div className='home__title-divider'></div>
                <h1 className='home__title home__title--bottom'>SWORD</h1>
            </div>
            {!name &&
                <form className='home__form' onSubmit={handleFormSubmit}>
                    <label className='home__form-label' htmlFor="playerName">Name</label>
                    <input className='home__form-input' type="text" name='playerName' maxLength={8} />
                    <button className='button--form button'>Enter</button>
                </form>
            }
            {name &&
                <h2 className='home__heading'>Player Name : {name}</h2>
            }
            {name && !joinRoomModal &&
                <>
                    <div className="home__button-container">
                        <button className='button button--home' onClick={() => { roomGenerator() }}>Create Room </button>
                        <button className='button button--home' onClick={() => setJoinRoomModal(true)}>Join Room</button>
                        <button className='button button--home' onClick={() => { navigate('/rules-&-how-to-play') }}>Rules & How To Play</button>
                    </div>
                </>
            }
            {joinRoomModal && <JoinRoomModal handleSubmit={handleSubmit} errorMessage={joinRoomError} handleCloseModal={handleCloseModal} handleRemoveError={handleRemoveError} />}

        </div>
    );
};

export default Home;