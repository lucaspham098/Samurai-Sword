import './GamePage.scss'
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client'
import Lobby from '../../components/Lobby/Lobby';
import { Link } from 'react-router-dom';
import AnnouncementModule from '../../components/AnnouncementModule/AnnouncementModule';
import ParryModule from '../../components/ParryModule/ParryModule';
import { visitFunctionBody } from 'typescript';
import { start } from 'repl';


type GamePageProp = {
    socket: Socket
}

interface PlayersData {
    socketID: string,
    role: string,
    character: string,
    hand: PlayableCard[],
    attacks: number,
    health: number,
    honourPoints: number
}

interface PlayableCard {
    type: string;
    name: string;
    range?: number;
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

const GamePage = ({ socket }: GamePageProp) => {

    const effectRan = useRef(false)

    const { room } = useParams()

    const [startGame, setStartGame] = useState(false)
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [winner, setWinner] = useState<string>('')

    const [usersHand, setUsersHand] = useState<PlayableCard[]>([])
    const [indexOfParry, setIndexOfParry] = useState<number>(-1)

    // const [player1, setPlayer1] = useState<string>('')
    const [player1Hand, setPlayer1Hand] = useState<PlayableCard[]>([])
    const [player1Character, setPlayer1Character] = useState<Character>()
    const [player1Role, setPlayer1Role] = useState<Role>()
    const [player1Attacks, setPlayer1Attacks] = useState<number>(1)
    const [player1Health, setPlayer1Health] = useState<number>(0)
    const [player1HonourPoints, setPlayer1HonourPoints] = useState<number>(3)

    // const [player2, setPlayer2] = useState<string>('')
    const [player2Hand, setPlayer2Hand] = useState<PlayableCard[]>([])
    const [player2Character, setPlayer2Character] = useState<Character>()
    const [player2Role, setPlayer2Role] = useState<Role>()
    const [player2Attacks, setPlayer2Attacks] = useState<number>(1)
    const [player2Health, setPlayer2Health] = useState<number>(0)
    const [player2HonourPoints, setPlayer2HonourPoints] = useState<number>(3)

    // const [player3, setPlayer3] = useState<string>('')
    const [player3Hand, setPlayer3Hand] = useState<PlayableCard[]>([])
    const [player3Character, setPlayer3Character] = useState<Character>()
    const [player3Role, setPlayer3Role] = useState<Role>()
    const [player3Attacks, setPlayer3Attacks] = useState<number>(1)
    const [player3Health, setPlayer3Health] = useState<number>(0)
    const [player3HonourPoints, setPlayer3HonourPoints] = useState<number>(3)

    // const [gameStateInitialized, setGameStateInitialized] = useState<boolean>(false)
    const [playersData, setPlayersData] = useState<PlayersData[]>([])
    const [indexOfPlayer, setIndexOfPlayer] = useState<number>(-1)

    const [selectedPlayer, setSelectedPlayer] = useState<string>('')
    const [selectedCard, SetSelectedCard] = useState<PlayableCard | undefined>()

    const [cardPlayed, setCardPlayed] = useState<PlayableCard>()
    const [currentPlayer, setCurrentPlayer] = useState<string>('')
    const [victim, setVictim] = useState<string>('')
    const [wounds, setWounds] = useState<number>(0)

    const [turn, setTurn] = useState('')
    const [newTurn, setNewTurn] = useState<boolean>(true)

    const [drawDeck, setDrawDeck] = useState<PlayableCard[]>([])
    const [discardPile, setDiscardPile] = useState<PlayableCard[]>([])

    const [parryModule, setParryModule] = useState<boolean>(false)

    const [weaponCardPlayed, setWeaponCardPlayed] = useState<boolean>(false)
    const [actionCardPlayed, setActionCardPlayed] = useState<boolean>(false)
    const [propertyCardPlayed, setPropertyCardPlayed] = useState<boolean>(false)
    const [parryPlayed, setParryPlayed] = useState<boolean>(false)
    const [playerHit, setPlayerHit] = useState<boolean>(false)


    const mainDeck: PlayableCard[] = [
        {
            type: 'weapon',
            name: 'Bokken',
            range: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bokken',
            range: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bokken',
            range: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bokken',
            range: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bokken',
            range: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bokken',
            range: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Kusarigama',
            range: 2,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kusarigama',
            range: 2,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kusarigama',
            range: 2,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kusarigama',
            range: 2,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Bo',
            range: 2,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bo',
            range: 2,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bo',
            range: 2,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bo',
            range: 2,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bo',
            range: 2,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Daikyu',
            range: 5,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Nagayari',
            range: 4,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kiseri',
            range: 1,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kiseri',
            range: 1,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kiseri',
            range: 1,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kiseri',
            range: 1,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kiseri',
            range: 1,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Shuriken',
            range: 3,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Shuriken',
            range: 3,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Shuriken',
            range: 3,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Wakizashi',
            range: 1,
            damage: 3,
        },
        {
            type: 'weapon',
            name: 'Naginata',
            range: 4,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Naginata',
            range: 4,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Tanegashima',
            range: 5,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Nodachi',
            range: 3,
            damage: 3,
        },
        {
            type: 'weapon',
            name: 'Kanabo',
            range: 3,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Katana',
            range: 2,
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
            name: 'Daimyo'
        },
        {
            type: 'action',
            name: 'Daimyo'
        },
        {
            type: 'action',
            name: 'Daimyo'
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
            type: 'action',
            name: 'Parry'
        },
        {
            type: 'action',
            name: 'Parry'
        },
        {
            type: 'action',
            name: 'Parry'
        },
        {
            type: 'action',
            name: 'Parry'
        },
        {
            type: 'action',
            name: 'Parry'
        },
        {
            type: 'action',
            name: 'Parry'
        },
        {
            type: 'action',
            name: 'Parry'
        },
        {
            type: 'action',
            name: 'Parry'
        },
        {
            type: 'action',
            name: 'Parry'
        },
        {
            type: 'action',
            name: 'Parry'
        },
        {
            type: 'action',
            name: 'Parry'
        },
        {
            type: 'action',
            name: 'Parry'
        },
        {
            type: 'action',
            name: 'Parry'
        },
        {
            type: 'action',
            name: 'Parry'
        },
        {
            type: 'action',
            name: 'Parry'
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

            setDrawDeck(shuffledMainDeck as PlayableCard[])

            socket.on('getHand', hand => {
                setUsersHand([...hand])
            })

            socket.on('setTurn', shogun => {
                setTimeout(() => {
                    setTurn(shogun)
                }, 500);
            })

            socket.on('attacked', () => {
                setParryModule(true)
            })

            socket.on('switchTurn', victim => {
                setTimeout(() => {
                    setTurn(victim)
                }, 500);
            })

            socket.on('setTurnBack', currentPlayer => {
                setTurn(currentPlayer)
            })

            socket.on('newTurn', newTurn => {
                console.log('newturn')
                setTurn(newTurn)
                setNewTurn(true)
            })

            socket.on('initGameState', (playerData) => {
                console.log(playerData)
                setPlayersData(playerData)
                setPlayer1Hand(playerData[0].hand)
                setPlayer1Character(playerData[0].character)
                setPlayer1Role(playerData[0].role)
                setPlayer1Health(playerData[0].health)
                setPlayer1HonourPoints(playerData[0].honourPoints)
                setPlayer1Attacks(playerData[0].attacks)
                setPlayer2Hand(playerData[1].hand)
                setPlayer2Character(playerData[1].character)
                setPlayer2Role(playerData[1].role)
                setPlayer2Health(playerData[1].health)
                setPlayer2HonourPoints(playerData[1].honourPoints)
                setPlayer2Attacks(playerData[1].attacks)
                setPlayer3Hand(playerData[2].hand)
                setPlayer3Character(playerData[2].character)
                setPlayer3Role(playerData[2].role)
                setPlayer3Health(playerData[2].health)
                setPlayer3HonourPoints(playerData[2].honourPoints)
                setPlayer3Attacks(playerData[2].attacks)
                socket.emit('getHand', room)
            })

            socket.on('updateGameState', ({ player1Hand, player1Health, player1HonourPoints, player1Attacks, player2Hand, player2Health, player2HonourPoints, player2Attacks, player3Hand, player3Health, player3HonourPoints, player3Attacks, playersData, discardPile, drawDeck, currentPlayer, victim, wounds, selectedCard, cardPlayed, newTurn, parryPlayed, weaponCardPlayed, actionCardPlayed, propertyCardPlayed, playerHit }) => {
                // setPlayer1Hand(player1Hand)
                // setPlayer1Health(player1Health)
                // setPlayer1HonourPoints(player1HonourPoints)
                // setPlayer1Attacks(player1Attacks)
                // setPlayer2Hand(player2Hand)
                // setPlayer2Health(player2Health)
                // setPlayer2HonourPoints(player2HonourPoints)
                // setPlayer2Attacks(player2Attacks)
                // setPlayer3Hand(player3Hand)
                // setPlayer3Health(player3Health)
                // setPlayer3HonourPoints(player3HonourPoints)
                // setPlayer3Attacks(player3Attacks)
                setPlayersData(playersData)
                setDrawDeck(drawDeck)
                setDiscardPile(discardPile)
                setCurrentPlayer(currentPlayer)
                setVictim(victim)
                setWounds(wounds)
                SetSelectedCard(selectedCard)
                setCardPlayed(cardPlayed)
                setNewTurn(newTurn)
                setParryPlayed(parryPlayed)
                setWeaponCardPlayed(weaponCardPlayed)
                setActionCardPlayed(actionCardPlayed)
                setPropertyCardPlayed(propertyCardPlayed)
                setPlayerHit(playerHit)
            })

            effectRan.current = true
        }


    }, [])


    const initGameState = () => {
        socket.emit('initGameState', [
            {
                role: player1Role,
                character: player1Character,
                hand: player1Hand,
                attacks: player1Attacks,
                health: player1Health,
                honourPoints: player1HonourPoints

            },
            {
                role: player2Role,
                character: player2Character,
                hand: player2Hand,
                attacks: player2Attacks,
                health: player2Health,
                honourPoints: player2HonourPoints
            },
            {
                role: player3Role,
                character: player3Character,
                hand: player3Hand,
                attacks: player3Attacks,
                health: player3Health,
                honourPoints: player3HonourPoints
            },
        ]
            // {
            //     player1Hand: player1Hand,
            //     player1Character: player1Character,
            //     player1Role: player1Role,
            //     player1Health: player1Health,
            //     player1HonourPoints: player1HonourPoints,
            //     player1Attacks: player1Attacks,
            //     player2Hand: player2Hand,
            //     player2Character: player2Character,
            //     player2Role: player2Role,
            //     player2Health: player2Health,
            //     player2HonourPoints: player2HonourPoints,
            //     player2Attacks: player2Attacks,
            //     player3Hand: player3Hand,
            //     player3Character: player3Character,
            //     player3Role: player3Role,
            //     player3Health: player3Health,
            //     player3HonourPoints: player3HonourPoints,
            //     player3Attacks: player3Attacks,
            // }
            , room)
    }

    const updateGameState = () => {

        socket.emit('updateGameState', {
            playersData: playersData,
            drawDeck: drawDeck,
            discardPile: discardPile,
            currentPlayer: currentPlayer,
            victim: victim,
            wounds: wounds,
            selectedCard: selectedCard,
            newTurn: newTurn,
            cardPlayed: cardPlayed,
            parryPlayed: parryPlayed,
            weaponCardPlayed: weaponCardPlayed,
            actionCardPlayed: actionCardPlayed,
            propertyCardPlayed: propertyCardPlayed,
            playerHit: playerHit
        }, room)

        // if (socket.id === players[0]) {
        //     socket.emit('updateGameState', [
        //         {
        //             hand: usersHand
        //         },
        //         {
        //             hand: player2Hand
        //         },
        //         {
        //             hand: player3Hand
        //         },
        //     ], {
        //         player1Hand: usersHand,
        //         player1Health: player1Health,
        //         player1HonourPoints: player1HonourPoints,
        //         player1Attacks: player1Attacks,
        //         player2Hand: player2Hand,
        //         player2Health: player2Health,
        //         player2HonourPoints: player2HonourPoints,
        //         player2Attacks: player2Attacks,
        //         player3Hand: player3Hand,
        //         player3Health: player3Health,
        //         player3HonourPoints: player3HonourPoints,
        //         player3Attacks: player3Attacks,
        //         drawDeck: drawDeck,
        //         discardPile: discardPile,
        //         currentPlayer: currentPlayer,
        //         victim: victim,
        //         wounds: wounds,
        //         selectedCard: selectedCard,
        //         newTurn: newTurn,
        //         cardPlayed: cardPlayed,
        //         parryPlayed: parryPlayed,
        //         weaponCardPlayed: weaponCardPlayed,
        //         actionCardPlayed: actionCardPlayed,
        //         propertyCardPlayed: propertyCardPlayed,
        //         playerHit: playerHit
        //     }, room)
        // }
        // if (socket.id === players[1]) {
        //     socket.emit('updateGameState', [
        //         {
        //             hand: player1Hand
        //         },
        //         {
        //             hand: usersHand
        //         },
        //         {
        //             hand: player3Hand
        //         },
        //     ], {
        //         player1Hand: player1Hand,
        //         player1Health: player1Health,
        //         player1HonourPoints: player1HonourPoints,
        //         player1Attacks: player1Attacks,
        //         player2Hand: usersHand,
        //         player2Health: player2Health,
        //         player2HonourPoints: player2HonourPoints,
        //         player2Attacks: player2Attacks,
        //         player3Hand: player3Hand,
        //         player3Health: player3Health,
        //         player3HonourPoints: player3HonourPoints,
        //         player3Attacks: player3Attacks,
        //         drawDeck: drawDeck,
        //         discardPile: discardPile,
        //         currentPlayer: currentPlayer,
        //         victim: victim,
        //         wounds: wounds,
        //         selectedCard: selectedCard,
        //         newTurn: newTurn,
        //         cardPlayed: cardPlayed,
        //         parryPlayed: parryPlayed,
        //         weaponCardPlayed: weaponCardPlayed,
        //         actionCardPlayed: actionCardPlayed,
        //         propertyCardPlayed: propertyCardPlayed,
        //         playerHit: playerHit
        //     }, room)
        // }
        // if (socket.id === players[2]) {
        //     socket.emit('updateGameState', [
        //         {
        //             hand: player1Hand
        //         },
        //         {
        //             hand: player2Hand
        //         },
        //         {
        //             hand: usersHand
        //         },
        //     ], {
        //         player1Hand: player1Hand,
        //         player1Health: player1Health,
        //         player1HonourPoints: player1HonourPoints,
        //         player1Attacks: player1Attacks,
        //         player2Hand: player2Hand,
        //         player2Health: player2Health,
        //         player2HonourPoints: player2HonourPoints,
        //         player2Attacks: player2Attacks,
        //         player3Hand: usersHand,
        //         player3Health: player3Health,
        //         player3HonourPoints: player3HonourPoints,
        //         player3Attacks: player3Attacks,
        //         drawDeck: drawDeck,
        //         discardPile: discardPile,
        //         currentPlayer: currentPlayer,
        //         victim: victim,
        //         wounds: wounds,
        //         selectedCard: selectedCard,
        //         newTurn: newTurn,
        //         cardPlayed: cardPlayed,
        //         parryPlayed: parryPlayed,
        //         weaponCardPlayed: weaponCardPlayed,
        //         actionCardPlayed: actionCardPlayed,
        //         propertyCardPlayed: propertyCardPlayed,
        //         playerHit: playerHit
        //     }, room)
        // }
    }

    useEffect(() => {
        if (playersData.length > 0 && startGame) {
            const playerIndex = playersData.findIndex(player => player.socketID === socket.id)
            setIndexOfPlayer(playerIndex)
            setPlayer1Hand(playersData[0].hand)
            setPlayer1Attacks(playersData[0].attacks)
            setPlayer1Health(playersData[0].health)
            setPlayer1HonourPoints(playersData[0].honourPoints)
            setPlayer2Hand(playersData[1].hand)
            setPlayer2Attacks(playersData[1].attacks)
            setPlayer2Health(playersData[1].health)
            setPlayer2HonourPoints(playersData[1].honourPoints)
            setPlayer3Hand(playersData[2].hand)
            setPlayer3Attacks(playersData[2].attacks)
            setPlayer3Health(playersData[2].health)
            setPlayer3HonourPoints(playersData[2].honourPoints)
        }

    }, [playersData])

    useEffect(() => {
        if (usersHand.length > 0) {
            const index = usersHand.findIndex(card => card.type === 'action' && card.name === 'Parry')
            setIndexOfParry(index)
            const data = [...playersData]
            data[indexOfPlayer].hand = usersHand
            setPlayersData(data)
        }
    }, [usersHand])

    const handleSetPlayers: (players: object[]) => void = (players: object[]) => {
        setPlayersData(players as PlayersData[])
    }

    const handleStartGame = () => {
        setStartGame(true)
    }

    const handleSelectedPlayer = (target: HTMLDivElement) => {
        setSelectedPlayer(target.id)
        console.log(target.id)
    }

    const handleSelectedCard = (card: PlayableCard) => {
        setSelectedPlayer('')
        SetSelectedCard(card)
    }

    useEffect(() => {
        if (socket.id === turn && newTurn) {
            const newCards: PlayableCard[] = [];
            for (let i = 0; i < 2; i++) {
                if (drawDeck.length > 0) {
                    newCards.push(drawDeck.pop() as PlayableCard);
                }
            }
            setUsersHand([...usersHand, ...newCards])
            setNewTurn(false)
        }

    }, [turn]);

    useEffect(() => {
        if (turn === socket.id)
            updateGameState()
    }, [playersData, discardPile, cardPlayed, currentPlayer, victim, weaponCardPlayed, actionCardPlayed, propertyCardPlayed, playerHit, parryPlayed])



    const setTurnBack = () => {
        socket.emit('setTurnBack', currentPlayer, room)
    }

    const handleParry = () => {
        setDiscardPile([...discardPile, {
            type: 'action',
            name: 'Parry'
        } as PlayableCard])
        usersHand.splice(indexOfParry, 1)
        setParryModule(false)
        setActionCardPlayed(false)
        setWeaponCardPlayed(false)
        setPropertyCardPlayed(false)
        setPlayerHit(false)
        setParryPlayed(true)
        setTurnBack()
    }

    const handleGetAttacked = () => {
        // if (!!indexOfPlayer && playersData.length > 2) {
        const data = [...playersData]
        data[indexOfPlayer].health = data[indexOfPlayer].health - wounds
        setPlayerHit(true)
        setParryModule(false)
        setActionCardPlayed(false)
        setWeaponCardPlayed(false)
        setPropertyCardPlayed(false)
        setParryPlayed(false)
        setTurnBack()
        // } else console.log('no')
        // if (socket.id === playersData[0] && wounds) {
        //     setPlayer1Health(player1Health - wounds)
        //     setPlayerHit(true)
        //     setParryModule(false)
        //     setActionCardPlayed(false)
        //     setWeaponCardPlayed(false)
        //     setPropertyCardPlayed(false)
        //     setParryPlayed(false)
        //     setTurnBack()
        // }
        // if (socket.id === playersData[1] && wounds) {
        //     setPlayer2Health(player2Health - wounds)
        //     setPlayerHit(true)
        //     setParryModule(false)
        //     setActionCardPlayed(false)
        //     setWeaponCardPlayed(false)
        //     setPropertyCardPlayed(false)
        //     setParryPlayed(false)
        //     setTurnBack()
        // }
        // if (socket.id === playersData[2] && wounds) {
        //     setPlayer3Health(player3Health - wounds)
        //     setPlayerHit(true)
        //     setParryModule(false)
        //     setActionCardPlayed(false)
        //     setWeaponCardPlayed(false)
        //     setPropertyCardPlayed(false)
        //     setParryPlayed(false)
        //     setTurnBack()
        // }
    }

    useEffect(() => {
        const handleCardPlayer = () => {
            const player = socket.id
            if (turn === socket.id) {
                console.log(selectedCard)
            }
            if (turn !== player || !selectedCard || selectedPlayer === '' || parryModule) {
                return
            }
            console.log(selectedPlayer)

            if (!!selectedCard && selectedCard.type === 'weapon') {
                const range = selectedCard.range

                const difficulty = () => {
                    const indexOfSelectedPlayer = playersData.findIndex(player => player.socketID === selectedPlayer)
                    const difficulty1 = Math.abs((indexOfPlayer + 1) - (indexOfSelectedPlayer + 1))
                    const difficulty2 = playersData.length - difficulty1
                    if (difficulty1 > difficulty2) {
                        return difficulty2
                    } else {
                        return difficulty1
                    }
                }

                if (range !== undefined && range < difficulty()) {
                    setSelectedPlayer('')
                    alert('Cannot reach target')
                } else {
                    setWeaponCardPlayed(true)
                    setActionCardPlayed(false)
                    setPropertyCardPlayed(false)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setDiscardPile([...discardPile, selectedCard])
                    const indexOfCard = usersHand.indexOf(selectedCard)
                    const hand = [...usersHand]
                    hand.splice(indexOfCard, 1)
                    setUsersHand(hand)
                    setWounds(selectedCard.damage as number)
                    setCardPlayed(selectedCard)
                    setCurrentPlayer(player)
                    setVictim(selectedPlayer)
                    socket.emit('attacked', selectedPlayer, room)
                    setSelectedPlayer('')
                    SetSelectedCard(undefined)
                }
            }

            if (!!selectedCard && selectedCard.type === 'action') {

                if (selectedCard.name === 'Daimyo') {
                    const newCards: PlayableCard[] = [];
                    for (let i = 0; i < 2; i++) {
                        if (drawDeck.length > 0) {
                            newCards.push(drawDeck.pop() as PlayableCard);
                        }
                        setUsersHand([...usersHand, ...newCards])
                    }
                }


            }
        }

        handleCardPlayer()
    }, [selectedCard, selectedPlayer])


    const endTurn = () => {
        if (!!playersData[indexOfPlayer + 1]) {
            const newTurn = playersData[indexOfPlayer + 1].socketID
            socket.emit('newTurn', newTurn, room)
        } else {
            const newTurn = playersData[0].socketID
            socket.emit('newTurn', newTurn, room)
        }
    }


    return (
        <>

            {!startGame && <Lobby handleStartGame={handleStartGame} initGameState={initGameState} socket={socket} handleSetPlayers={handleSetPlayers} />}

            <AnnouncementModule currentPlayer={currentPlayer} victim={victim} wounds={wounds} cardPlayed={cardPlayed} weaponCardPlayed={weaponCardPlayed} actionCardPlayed={actionCardPlayed} propertyCardPlayed={propertyCardPlayed} playerHit={playerHit} parryPlayed={parryPlayed} />

            {parryModule && <ParryModule
                wounds={wounds}
                usersHand={usersHand}
                indexOfParry={indexOfParry}
                handleParry={handleParry}
                handleGetAttacked={handleGetAttacked} />}

            {startGame &&
                player1Role && player2Role && player3Role && player1Character && player2Character && player3Character &&
                playersData[0].socketID === socket.id &&
                <>
                    {player2Role && player3Role && player2Character && player3Character &&
                        <div className="game__flex-container">
                            <div className='game__player-container'>
                                <h1 className='game__player-name'>Player 2</h1>
                                <div className='game__player-character' id={playersData[1].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
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
                                <div className='game__player-character' id={playersData[2].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
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
                        </div>}


                    <div className='game__deck-container'>
                        <p>Draw Deck #: {drawDeck.length}</p>
                        {discardPile.length > 0 && <p>Discard Pile:{discardPile[discardPile.length - 1].name}</p>}
                    </div>


                    {player1Role && player1Character &&
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
                                {usersHand.length > 0 && usersHand.map((card: PlayableCard, index) => {
                                    return <p className='card' key={index} onClick={() => { handleSelectedCard(card) }}>{card.name}</p>
                                })}
                            </div>
                        </div>}
                </>
            }

            {startGame && player1Role && player2Role && player3Role && player1Character && player2Character && player3Character && socket.id === playersData[1].socketID &&
                <>
                    <div className="game__flex-container">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>Player 3</h1>
                            <div className='game__player-character' id={playersData[2].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
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
                            <div className='game__player-character' id={playersData[0].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
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
                        {discardPile.length > 0 && <p>Discard Pile:{discardPile[discardPile.length - 1].name}</p>}
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
                            {usersHand.length > 0 && usersHand.map((card: PlayableCard, index) => {
                                return <p className='card' key={index} onClick={() => { handleSelectedCard(card) }}>{card.name}</p>
                            })}
                        </div>
                    </div>
                </>
            }

            {startGame && player1Role && player2Role && player3Role && player1Character && player2Character && player3Character && socket.id === playersData[2].socketID &&
                <>
                    <div className="game__flex-container">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>Player 1</h1>
                            <div className='game__player-character' id={playersData[0].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
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
                            <div className='game__player-character' id={playersData[1].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
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
                        {discardPile.length > 0 && <p>Discard Pile:{discardPile[discardPile.length - 1].name}</p>}
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
                            {usersHand.length > 0 && usersHand.map((card: PlayableCard, index) => {
                                return <p className='card' key={index} onClick={() => { handleSelectedCard(card) }}>{card.name}</p>
                            })}
                        </div>
                    </div>
                </>
            }

            {startGame && turn === socket.id ? <button onClick={() => endTurn()}>End Turn</button> : <button disabled>End Turn</button>}
            {/* 
            {startGame && (
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
                </div >
            )} */}
        </>
    );
};

export default GamePage;