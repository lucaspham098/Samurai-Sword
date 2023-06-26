import { connect } from 'http2';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client'
import Lobby from '../../components/Lobby/Lobby';

const GamePage = () => {

    const effectRan = useRef(false)

    const { room } = useParams()

    const [startGame, setStartGame] = useState(false)
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [winner, setWinner] = useState<string>('')

    const [player1ID, setPlayer1ID] = useState<string>('')
    const [player1Hand, setPlayer1Hand] = useState<object[]>([])
    const [player1Character, setPlayer1Character] = useState<Character>()
    const [player1Role, setPlayer1Role] = useState<Role>()
    const [player1Attacks, setPlayer1Attacks] = useState<number>(1)
    const [player1Difficulty, setPlayer1Difficulty] = useState<number>()
    const [player1Health, setPlayer1Health] = useState<number>()
    const [player1HonourPoints, setPlayer1HonourPoints] = useState<number>(3)

    const [player2ID, setPlayer2ID] = useState<string>('')
    const [player2Hand, setPlayer2Hand] = useState<object[]>([])
    const [player2Character, setPlayer2Character] = useState<Character>()
    const [player2Role, setPlayer2Role] = useState<Role>()
    const [player2Attacks, setPlayer2Attacks] = useState<number>(1)
    const [player2Difficulty, setPlayer2Difficulty] = useState<number>()
    const [player2Health, setPlayer2Health] = useState<number>()
    const [player2HonourPoints, setPlayer2HonourPoints] = useState<number>(3)

    const [player3ID, setPlayer3ID] = useState<string>('')
    const [player3Hand, setPlayer3Hand] = useState<object[]>([])
    const [player3Character, setPlayer3Character] = useState<Character>()
    const [player3Role, setPlayer3Role] = useState<Role>()
    const [player3Attacks, setPlayer3Attacks] = useState<number>(1)
    const [player3Difficulty, setPlayer3Difficulty] = useState<number>()
    const [player3Health, setPlayer3Health] = useState<number>()
    const [player3HonourPoints, setPlayer3HonourPoints] = useState<number>(3)
    //add const if more than three players below
    const [turn, setTurn] = useState('')
    const [drawDeck, setDrawDeck] = useState<object[]>([])
    const [discardPile, setDiscardPile] = useState<object[]>([])


    interface Weapon {
        type: 'weapon';
        name: string;
        reach: number;
        damage: number;
    }

    interface Action {
        type: 'action';
        name: string;
        // effect: () => void;
    }

    interface Property {
        type: 'property';
        name: string;
        // effect: () => void;
    }

    interface Character {
        name: string;
        health: number;
    }

    interface Role {
        role: string;
        team: string;
        stars?: number
    }


    const mainDeck = [
        {
            type: 'weapon',
            name: 'Bokken',
            reach: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bokken',
            reach: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bokken',
            reach: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bokken',
            reach: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bokken',
            reach: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bokken',
            reach: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Kusarigama',
            reach: 2,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kusarigama',
            reach: 2,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kusarigama',
            reach: 2,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kusarigama',
            reach: 2,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Bo',
            reach: 2,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bo',
            reach: 2,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bo',
            reach: 2,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bo',
            reach: 2,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bo',
            reach: 2,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Daikyu',
            reach: 5,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Nagayari',
            reach: 4,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kiseri',
            reach: 1,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kiseri',
            reach: 1,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kiseri',
            reach: 1,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kiseri',
            reach: 1,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kiseri',
            reach: 1,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Shuriken',
            reach: 3,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Shuriken',
            reach: 3,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Shuriken',
            reach: 3,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Wakizashi',
            reach: 1,
            damage: 3,
        },
        {
            type: 'weapon',
            name: 'Naginata',
            reach: 4,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Tanegashima',
            reach: 5,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Nodachi',
            reach: 3,
            damage: 3,
        },
        {
            type: 'weapon',
            name: 'Kanabo',
            reach: 3,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Katana',
            reach: 2,
            damage: 3,
        },
        {
            type: 'action',
            name: 'Jujitsu'
        },
        {
            type: 'action',
            name: 'Jujitsu'
        },
        {
            type: 'action',
            name: 'Jujitsu'
        },
        {
            type: 'action',
            name: 'Tea Ceremony'
        },
        {
            type: 'action',
            name: 'Tea Ceremony'
        },
        {
            type: 'action',
            name: 'Tea Ceremony'
        },
        {
            type: 'action',
            name: 'Tea Ceremony'
        },
        {
            type: 'action',
            name: 'Battlecry'
        },
        {
            type: 'action',
            name: 'Battlecry'
        },
        {
            type: 'action',
            name: 'Battlecry'
        },
        {
            type: 'action',
            name: 'Battlecry'
        },
        {
            type: 'action',
            name: 'Geisha'
        },
        {
            type: 'action',
            name: 'Geisha'
        },
        {
            type: 'action',
            name: 'Geisha'
        },
        {
            type: 'action',
            name: 'Geisha'
        },
        {
            type: 'action',
            name: 'Geisha'
        },
        {
            type: 'action',
            name: 'Geisha'
        },
        {
            type: 'action',
            name: 'Daiymo'
        },
        {
            type: 'action',
            name: 'Daiymo'
        },
        {
            type: 'action',
            name: 'Daiymo'
        },
        {
            type: 'action',
            name: 'Divertion'
        },
        {
            type: 'action',
            name: 'Divertion'
        },
        {
            type: 'action',
            name: 'Divertion'
        },
        {
            type: 'action',
            name: 'Divertion'
        },
        {
            type: 'action',
            name: 'Divertion'
        },
        {
            type: 'action',
            name: 'Divertion'
        },
        {
            type: 'action',
            name: 'Breathing'
        },
        {
            type: 'action',
            name: 'Breathing'
        },
        {
            type: 'action',
            name: 'Breathing'
        },
        {
            type: 'property',
            name: 'Fast Draw'
        },
        {
            type: 'property',
            name: 'Fast Draw'
        },
        {
            type: 'property',
            name: 'Fast Draw'
        },
        {
            type: 'property',
            name: 'Armor'
        },
        {
            type: 'property',
            name: 'Armor'
        },
        {
            type: 'property',
            name: 'Armor'
        },
        {
            type: 'property',
            name: 'Armor'
        },
        {
            type: 'property',
            name: 'Focus'
        },
        {
            type: 'property',
            name: 'Focus'
        },
        {
            type: 'property',
            name: 'Focus'
        },
        {
            type: 'property',
            name: 'Focus'
        },
        {
            type: 'property',
            name: 'Focus'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
    ]

    const characterDeck: Character[] = [
        {
            name: 'Benkai',
            health: 5,
        },
        {
            name: 'Kojiro',
            health: 5,
        },
        {
            name: 'Ushiwaka',
            health: 4,
        },
        {
            name: 'Ieyasu',
            health: 5,
        },
        {
            name: 'Chiyome',
            health: 4,
        },
        {
            name: 'Hanzo',
            health: 4,
        },
        {
            name: 'Goemon',
            health: 5,
        },
        {
            name: 'Tomoe',
            health: 5,
        },
        {
            name: 'Nobunaga',
            health: 5,
        },
        {
            name: 'Hideyoshi',
            health: 4,
        },
        {
            name: 'Musashi',
            health: 5,
        },
        {
            name: 'Ginchyo',
            health: 5,
        },
    ]

    const roleDeck: Role[] = [
        {
            role: 'Shogun',
            team: 'Shogun',
        },
        // {
        //     role: 'Samurai',
        //     team: 'Shogun',
        // },
        // {
        //     role: 'Samurai',
        //     team: 'Shogun',
        // },
        // {
        //     role: 'Ninja',
        //     team: 'Ninja',
        //     stars: 1
        // },
        {
            role: 'Ninja',
            team: 'Ninja',
            stars: 2
        },
        {
            role: 'Ninja',
            team: 'Ninja',
            stars: 3
        },
        // {
        //     role: 'Ronin',
        //     team: 'Ronin',
        // },

    ]

    const shuffle = (arr: object[]): object[] => {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr
    }

    const socket = io(`http://localhost:3001`)

    useEffect(() => {

        const shuffledMainDeck = shuffle(mainDeck)
        const shuffledRoleDeck = shuffle(roleDeck)
        const shuffledCharacterDeck = shuffle(characterDeck)

        if (effectRan.current === false) {

            socket.on('connect', () => {
                console.log(socket.id)
                socket.emit('askForPlayers', room)
                socket.on('players', players => {
                    console.log(players)
                })
            })

            const settingPlayer1States = async () => {
                const dealtPlayer1Character = shuffledCharacterDeck.pop() as Character
                const dealtPlayer1Role = shuffledRoleDeck.pop() as Role
                await setPlayer1Character(dealtPlayer1Character)
                await setPlayer1Health(dealtPlayer1Character.health)
                await setPlayer1Role(dealtPlayer1Role)

                if (dealtPlayer1Character.name === 'Goemon' && dealtPlayer1Role.role === 'Shogun') {
                    setPlayer1Attacks(3)
                }
                console.log(dealtPlayer1Role)
                if (dealtPlayer1Role.role === 'Shogun' || dealtPlayer1Character.name === 'Goemon') {
                    setPlayer1Attacks(2)
                }
                if (dealtPlayer1Role.role === 'Shogun') {
                    setPlayer1HonourPoints(5)
                }

                const dealtPlayer1Hand = []
                for (let i = 0; i < 4; i++) {
                    dealtPlayer1Hand.push(shuffledMainDeck.pop())
                }
                setPlayer1Hand(dealtPlayer1Hand as object[])
            }
            settingPlayer1States()

            const settingPlayer2States = async () => {
                const dealtPlayer2Character = shuffledCharacterDeck.pop() as Character
                const dealtPlayer2Role = shuffledRoleDeck.pop() as Role
                await setPlayer2Character(dealtPlayer2Character)
                await setPlayer2Health(dealtPlayer2Character.health)
                await setPlayer2Role(dealtPlayer2Role)

                if (dealtPlayer2Character.name === 'Goemon' && dealtPlayer2Role.role === 'Shogun') {
                    setPlayer2Attacks(3)
                }
                if (dealtPlayer2Role.role === 'Shogun' || dealtPlayer2Character.name === 'Goemon') {
                    setPlayer2Attacks(2)
                }
                if (dealtPlayer2Role.role === 'Shogun') {
                    setPlayer2HonourPoints(5)
                }

                const dealtPlayer2Hand = []
                for (let i = 0; i < 5; i++) {
                    dealtPlayer2Hand.push(shuffledMainDeck.pop())
                }
                setPlayer2Hand(dealtPlayer2Hand as object[])
            }
            settingPlayer2States()

            const settingPlayer3States = async () => {
                const dealtPlayer3Character = shuffledCharacterDeck.pop() as Character
                const dealtPlayer3Role = shuffledRoleDeck.pop() as Role
                await setPlayer3Character(dealtPlayer3Character)
                await setPlayer3Role(dealtPlayer3Role)
                await setPlayer3Health(dealtPlayer3Character.health)

                if (dealtPlayer3Character.name === 'Goemon' && dealtPlayer3Role.role === 'Shogun') {
                    setPlayer3Attacks(3)
                }
                if (dealtPlayer3Role.role === 'Shogun' || dealtPlayer3Character.name === 'Goemon') {
                    setPlayer3Attacks(2)
                }
                if (dealtPlayer3Role.role === 'Shogun') {
                    setPlayer3HonourPoints(5)
                }

                const dealtPlayer3Hand = []
                for (let i = 0; i < 5; i++) {
                    dealtPlayer3Hand.push(shuffledMainDeck.pop())
                }
                setPlayer3Hand(dealtPlayer3Hand as object[])
            }
            settingPlayer3States()

            setDrawDeck(shuffledMainDeck)

            socket.emit('initGameState', {
                player1Hand: player1Hand,
                player1Character: player1Character,
                player1Role: player1Role,
                player1Health: player1Health,
                player1HonourPoints: player1HonourPoints,
                player2Hand: player2Hand,
                player2Character: player2Character,
                player2Role: player2Role,
                player2Health: player2Health,
                player2HonourPoints: player2HonourPoints,
                player3Hand: player3Hand,
                player3Character: player3Character,
                player3Role: player3Role,
                player3Health: player3Health,
                player3HonourPoints: player3HonourPoints,
            })

            // socket.on('initGameState',)
            effectRan.current = true
        }

    }, [])

    const handleStartGame = () => {
        setStartGame(true)
    }

    return (
        <>

            {!startGame && <Lobby handleStartGame={handleStartGame} />}
            {startGame && (
                <div>
                    <h1>{drawDeck.length}</h1>
                    <h1>Player 1</h1>
                    {player1Character && player1Role &&
                        <>
                            <p>{player1Character.name}</p>
                            <p>{player1Role.role}</p>
                            <p>Attacks:{player1Attacks}</p>
                            <p>Honour Points:{player1HonourPoints}</p>
                        </>

                    }
                    <h1>Player 2</h1>
                    {player2Character && player2Role &&
                        <>
                            <p>{player2Character.name}</p>
                            <p>{player2Role.role}</p>
                            <p>Attacks:{player2Attacks}</p>
                            <p>Honour Points:{player2HonourPoints}</p>
                        </>

                    }
                    <h1>Player 3</h1>
                    {player3Character && player3Role &&
                        <>
                            <p>{player3Character.name}</p>
                            <p>{player3Role.role}</p>
                            <p>Attacks:{player3Attacks}</p>
                            <p>Honour Points:{player3HonourPoints}</p>
                        </>

                    }
                </div >
            )}

        </>
    );
};

export default GamePage;