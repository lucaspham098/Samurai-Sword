import './GamePage.scss'
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client'
import Lobby from '../../components/Lobby/Lobby';


type GamePageProp = {
    socket: Socket
}

const GamePage = ({ socket }: GamePageProp) => {

    const effectRan = useRef(false)

    const { room } = useParams()

    const [startGame, setStartGame] = useState(false)
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [winner, setWinner] = useState<string>('')

    const [usersHand, setUsersHand] = useState<PlayableCard[]>()

    const [player1, setPlayer1] = useState<string>('')
    const [player1Hand, setPlayer1Hand] = useState<PlayableCard[]>([])
    const [player1Character, setPlayer1Character] = useState<Character>()
    const [player1Role, setPlayer1Role] = useState<Role>()
    const [player1Attacks, setPlayer1Attacks] = useState<number>(1)
    const [player1Difficulty, setPlayer1Difficulty] = useState<number>()
    const [player1Health, setPlayer1Health] = useState<number>()
    const [player1HonourPoints, setPlayer1HonourPoints] = useState<number>(3)

    const [player2, setPlayer2] = useState<string>('')
    const [player2Hand, setPlayer2Hand] = useState<PlayableCard[]>([])
    const [player2Character, setPlayer2Character] = useState<Character>()
    const [player2Role, setPlayer2Role] = useState<Role>()
    const [player2Attacks, setPlayer2Attacks] = useState<number>(1)
    const [player2Difficulty, setPlayer2Difficulty] = useState<number>()
    const [player2Health, setPlayer2Health] = useState<number>()
    const [player2HonourPoints, setPlayer2HonourPoints] = useState<number>(3)

    const [player3, setPlayer3] = useState<string>('')
    const [player3Hand, setPlayer3Hand] = useState<PlayableCard[]>([])
    const [player3Character, setPlayer3Character] = useState<Character>()
    const [player3Role, setPlayer3Role] = useState<Role>()
    const [player3Attacks, setPlayer3Attacks] = useState<number>(1)
    const [player3Difficulty, setPlayer3Difficulty] = useState<number>()
    const [player3Health, setPlayer3Health] = useState<number>()
    const [player3HonourPoints, setPlayer3HonourPoints] = useState<number>(3)

    // const [gameStateInitialized, setGameStateInitialized] = useState<boolean>(false)
    const [players, setPlayers] = useState<string[]>([])
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

    interface PlayableCard {
        type: string;
        name: string;
        reach?: number;
        damage?: number;
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

    useEffect(() => {

        const shuffledMainDeck = shuffle(mainDeck)
        const shuffledRoleDeck = shuffle(roleDeck)
        const shuffledCharacterDeck = shuffle(characterDeck)
        setPlayer1(players[0])
        setPlayer2(players[1])
        setPlayer3(players[2])

        if (effectRan.current === false) {
            const settingPlayer1States = async () => {
                const dealtPlayer1Character = shuffledCharacterDeck.pop() as Character
                const dealtPlayer1Role = shuffledRoleDeck.pop() as Role
                await setPlayer1Character(dealtPlayer1Character)
                await setPlayer1Health(dealtPlayer1Character.health)
                await setPlayer1Role(dealtPlayer1Role)

                if (dealtPlayer1Role.role === 'Shogun') {
                    setPlayer1HonourPoints(5)
                    setPlayer1Attacks(2)
                    const dealtPlayer1Hand = []
                    for (let i = 0; i < 4; i++) {
                        dealtPlayer1Hand.push(shuffledMainDeck.pop())
                    }
                    setPlayer1Hand(dealtPlayer1Hand as PlayableCard[])
                    if (dealtPlayer1Character.name === 'Goemon') {
                        setPlayer1Attacks(3)
                    }
                } else {
                    const dealtPlayer1Hand = []
                    for (let i = 0; i < 5; i++) {
                        dealtPlayer1Hand.push(shuffledMainDeck.pop())
                    }
                    setPlayer1Hand(dealtPlayer1Hand as PlayableCard[])
                }
            }
            settingPlayer1States()

            const settingPlayer2States = async () => {
                const dealtPlayer2Character = shuffledCharacterDeck.pop() as Character
                const dealtPlayer2Role = shuffledRoleDeck.pop() as Role
                await setPlayer2Character(dealtPlayer2Character)
                await setPlayer2Health(dealtPlayer2Character.health)
                await setPlayer2Role(dealtPlayer2Role)

                if (dealtPlayer2Role.role === 'Shogun') {
                    setPlayer2HonourPoints(5)
                    setPlayer2Attacks(2)
                    const dealtPlayer2Hand = []
                    for (let i = 0; i < 4; i++) {
                        dealtPlayer2Hand.push(shuffledMainDeck.pop())
                    }
                    setPlayer2Hand(dealtPlayer2Hand as PlayableCard[])
                    if (dealtPlayer2Character.name === 'Goemon') {
                        setPlayer2Attacks(3)
                    }
                } else {
                    const dealtPlayer2Hand = []
                    for (let i = 0; i < 5; i++) {
                        dealtPlayer2Hand.push(shuffledMainDeck.pop())
                    }
                    setPlayer2Hand(dealtPlayer2Hand as PlayableCard[])
                }
            }
            settingPlayer2States()

            const settingPlayer3States = async () => {
                const dealtPlayer3Character = shuffledCharacterDeck.pop() as Character
                const dealtPlayer3Role = shuffledRoleDeck.pop() as Role
                await setPlayer3Character(dealtPlayer3Character)
                await setPlayer3Role(dealtPlayer3Role)
                await setPlayer3Health(dealtPlayer3Character.health)

                if (dealtPlayer3Role.role === 'Shogun') {
                    setPlayer3HonourPoints(5)
                    setPlayer3Attacks(2)
                    const dealtPlayer3Hand = []
                    for (let i = 0; i < 4; i++) {
                        dealtPlayer3Hand.push(shuffledMainDeck.pop())
                    }
                    setPlayer3Hand(dealtPlayer3Hand as PlayableCard[])
                    if (dealtPlayer3Character.name === 'Goemon') {
                        setPlayer3Attacks(3)
                    }
                } else {
                    const dealtPlayer3Hand = []
                    for (let i = 0; i < 5; i++) {
                        dealtPlayer3Hand.push(shuffledMainDeck.pop())
                    }
                    setPlayer3Hand(dealtPlayer3Hand as PlayableCard[])
                }
            }
            settingPlayer3States()

            setDrawDeck(shuffledMainDeck)

            socket.on('getHand', hand => {
                setUsersHand(hand)
            })

            socket.on('setTurn', shogun => {
                setTurn(shogun)
                console.log('received set turn')
                console.log(shogun)
            })

            socket.on('initGameState', ({ player1Character, player1Role, player1Health, player1HonourPoints, player1Attacks, player2Character, player2Role, player2Health, player2HonourPoints, player2Attacks, player3Character, player3Role, player3Health, player3HonourPoints, player3Attacks, }) => {
                setPlayer1Character(player1Character)
                setPlayer1Role(player1Role)
                setPlayer1Health(player1Health)
                setPlayer1HonourPoints(player1HonourPoints)
                setPlayer1Attacks(player1Attacks)
                setPlayer2Character(player2Character)
                setPlayer2Role(player2Role)
                setPlayer2Health(player2Health)
                setPlayer2HonourPoints(player2HonourPoints)
                setPlayer2Attacks(player2Attacks)
                setPlayer3Character(player3Character)
                setPlayer3Role(player3Role)
                setPlayer3Health(player3Health)
                setPlayer3HonourPoints(player3HonourPoints)
                setPlayer3Attacks(player3Attacks)
                socket.emit('getHand', room)
            })

            effectRan.current = true
        }

    }, [])


    const initGameState = () => {
        socket.emit('initGameState', [
            {
                hand: player1Hand,
                role: player1Role
            },
            {
                hand: player2Hand,
                role: player2Role
            },
            {
                hand: player3Hand,
                role: player3Role
            },
        ],
            {
                player1Character: player1Character,
                player1Role: player1Role,
                player1Health: player1Health,
                player1HonourPoints: player1HonourPoints,
                player1Attacks: player1Attacks,
                player2Character: player2Character,
                player2Role: player2Role,
                player2Health: player2Health,
                player2HonourPoints: player2HonourPoints,
                player2Attacks: player2Attacks,
                player3Character: player3Character,
                player3Role: player3Role,
                player3Health: player3Health,
                player3HonourPoints: player3HonourPoints,
                player3Attacks: player3Attacks,
            }
            , room)
    }

    // if (player1Character && player2Character && player3Character) {
    //     setGameStateInitialized(true)
    // }

    const handleSetPlayers: (players: string[]) => void = (players: string[]) => {
        setPlayers(players)
    }

    const handleStartGame = () => {
        setStartGame(true)
    }

    return (
        <>
            {!startGame && <Lobby handleStartGame={handleStartGame} initGameState={initGameState} socket={socket} handleSetPlayers={handleSetPlayers} />}
            {/* {startGame && (
                <div>
                    <h1>{drawDeck.length}</h1>
                    <h1>Player 1</h1>
                    {player1Character && player1Role &&
                        <>
                            <p>{player1Character.name}</p>
                            <p>{player1Role.role}</p>
                            <p>Health: {player1Health}</p>
                            <p>Attacks:{player1Attacks}</p>
                            <p>Honour Points:{player1HonourPoints}</p>
                        </>

                    }
                    <h1>Player 2</h1>
                    {player2Character && player2Role &&
                        <>
                            <p>{player2Character.name}</p>
                            <p>{player2Role.role}</p>
                            <p>Health: {player2Health}</p>
                            <p>Attacks:{player2Attacks}</p>
                            <p>Honour Points:{player2HonourPoints}</p>
                        </>

                    }
                    <h1>Player 3</h1>
                    {player3Character && player3Role &&
                        <>
                            <p>{player3Character.name}</p>
                            <p>{player3Role.role}</p>
                            <p>Health: {player3Health}</p>
                            <p>Attacks:{player3Attacks}</p>
                            <p>Honour Points:{player3HonourPoints}</p>
                        </>
                    }
                    <h1>Players Hand</h1>
                    {usersHand && usersHand.map((card: PlayableCard) => {
                        return <p>{card.name}</p>
                    })}
                </div >
            )} */}

            {startGame && player1Role && player2Role && player3Role && player1Character && player2Character && player3Character && socket.id === player1 &&
                <>
                    <div className="game__flex-container">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>Player 2</h1>
                            <div className='game__player-character' id={player2}>
                                <p>{player2Character.name}</p>
                            </div>
                            {player2Role.role === 'Shogun' &&
                                <div className='game__player-role'>
                                    <p>{player2Role.role}</p>
                                </div>
                            }
                            <p>Health: {player2Health}</p>
                            <p>Honour Points:{player2HonourPoints}</p>
                            <p>Attacks:{player2Attacks}</p>
                            <p>Card #:{player2Hand.length} </p>
                        </div>

                        <div className='game__player-container'>
                            <h1 className='game__player-name'>Player 3</h1>
                            <div className='game__player-character' id={player3}>
                                <p>{player3Character.name}</p>
                            </div>
                            {player3Role.role === 'Shogun' &&
                                <div className='game__player-role'>
                                    <p>{player3Role.role}</p>
                                </div>
                            }
                            <p>Health: {player3Health}</p>
                            <p>Honour Points:{player3HonourPoints}</p>
                            <p>Attacks:{player3Attacks}</p>
                            <p>Card #:{player3Hand.length} </p>
                        </div>
                    </div>


                    <div className='game__deck-container'>
                        <p>Draw Deck #: {drawDeck.length}</p>
                    </div>


                    <div className='game__user-container'>
                        <div className='game__player-character' id={socket.id}>
                            <p>{player1Character.name}</p>
                        </div>
                        {player1Role.role === 'Shogun' &&
                            <div className='game__user-role'>
                                <p>{player1Role.role}</p>
                            </div>
                        }
                        <p>Health: {player1Health}</p>
                        <p>Honour Points:{player1HonourPoints}</p>
                        <p>Attacks:{player1Attacks}</p>
                        <div className='game__user-hand'>
                            {usersHand && usersHand.map((card: PlayableCard) => {
                                return <p>{card.name}</p>
                            })}
                        </div>
                    </div>
                </>
            }

            {startGame && player1Role && player2Role && player3Role && player1Character && player2Character && player3Character && socket.id === player2 &&
                <>
                    <div className="game__flex-container">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>Player 3</h1>
                            <div className='game__player-character' id={player3}>
                                <p>{player3Character.name}</p>
                            </div>
                            {player3Role.role === 'Shogun' &&
                                <div className='game__player-role'>
                                    <p>{player3Role.role}</p>
                                </div>
                            }
                            <p>Health: {player3Health}</p>
                            <p>Honour Points:{player3HonourPoints}</p>
                            <p>Attacks:{player3Attacks}</p>
                            <p>Card #:{player3Hand.length} </p>
                        </div>

                        <div className='game__player-container'>
                            <h1 className='game__player-name'>Player 1</h1>
                            <div className='game__player-character' id={player1}>
                                <p>{player1Character.name}</p>
                            </div>
                            {player1Role.role === 'Shogun' &&
                                <div className='game__player-role'>
                                    <p>{player1Role.role}</p>
                                </div>
                            }
                            <p>Health: {player1Health}</p>
                            <p>Honour Points:{player1HonourPoints}</p>
                            <p>Attacks:{player1Attacks}</p>
                            <p>Card #:{player1Hand.length} </p>
                        </div>
                    </div>


                    <div className='game__deck-container'>
                        <p>Draw Deck #: {drawDeck.length}</p>
                    </div>


                    <div className='game__user-container'>
                        <div className='game__player-character' id={socket.id}>
                            <p>{player2Character.name}</p>
                        </div>
                        {player2Role.role === 'Shogun' &&
                            <div className='game__user-role'>
                                <p>{player2Role.role}</p>
                            </div>
                        }
                        <p>Health: {player2Health}</p>
                        <p>Honour Points:{player2HonourPoints}</p>
                        <p>Attacks:{player2Attacks}</p>
                        <div className='game__user-hand'>
                            {usersHand && usersHand.map((card: PlayableCard) => {
                                return <p >{card.name}</p>
                            })}
                        </div>
                    </div>
                </>
            }

            {startGame && player1Role && player2Role && player3Role && player1Character && player2Character && player3Character && socket.id === player3 &&
                <>
                    <div className="game__flex-container">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>Player 1</h1>
                            <div className='game__player-character' id={player1}>
                                <p>{player1Character.name}</p>
                            </div>
                            {player1Role.role === 'Shogun' &&
                                <div className='game__player-role'>
                                    <p>{player1Role.role}</p>
                                </div>
                            }
                            <p>Health: {player1Health}</p>
                            <p>Honour Points:{player1HonourPoints}</p>
                            <p>Attacks:{player1Attacks}</p>
                            <p>Card #:{player1Hand.length} </p>
                        </div>

                        <div className='game__player-container'>
                            <h1 className='game__player-name'>Player 2</h1>
                            <div className='game__player-character' id={player2}>
                                <p>{player2Character.name}</p>
                            </div>
                            {player2Role.role === 'Shogun' &&
                                <div className='game__player-role'>
                                    <p>{player2Role.role}</p>
                                </div>
                            }
                            <p>Health: {player2Health}</p>
                            <p>Honour Points:{player2HonourPoints}</p>
                            <p>Attacks:{player2Attacks}</p>
                            <p>Card #:{player2Hand.length} </p>
                        </div>
                    </div>


                    <div className='game__deck-container'>
                        <p>Draw Deck #: {drawDeck.length}</p>
                    </div>


                    <div className='game__user-container'>
                        <div className='game__player-character' id={socket.id}>
                            <p>{player3Character.name}</p>
                        </div>
                        {player3Role.role === 'Shogun' &&
                            <div className='game__player-role'>
                                <p>{player3Role.role}</p>
                            </div>
                        }
                        <p>Health: {player3Health}</p>
                        <p>Honour Points:{player3HonourPoints}</p>
                        <p>Attacks:{player3Attacks}</p>
                        <div className='game__user-hand'>
                            {usersHand && usersHand.map((card: PlayableCard) => {
                                return <p>{card.name}</p>
                            })}
                        </div>
                    </div>
                </>
            }
        </>
    );
};

export default GamePage;