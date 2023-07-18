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
import BattlecryJujitsuModule from '../../components/BattlecryJujitsuModule/BattlecryJujitsuModule';
import IeyasuModule from '../../components/IeyasuModule/IeyasuModule';


type GamePageProp = {
    socket: Socket
}

interface PlayersData {
    socketID: string,
    role: Role,
    character: Character,
    hand: PlayableCard[],
    attacks: number,
    health: number,
    honourPoints: number
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
    const [currentPlayer, setCurrentPlayer] = useState<PlayersData>()
    const [victim, setVictim] = useState<PlayersData>()
    const [wounds, setWounds] = useState<number>(0)

    const [turn, setTurn] = useState<string>('')
    const [newTurn, setNewTurn] = useState<boolean>(true)

    const [drawDeck, setDrawDeck] = useState<PlayableCard[]>([])
    const [discardPile, setDiscardPile] = useState<PlayableCard[]>([])

    const [parryModule, setParryModule] = useState<boolean>(false)

    const [battlecryInfo, setBattlecryInfo] = useState<string[]>([])
    const [jujitsuInfo, setJujitsuInfo] = useState<string[]>([])
    const [jujitsuInEffect, setJujitsuInEffect] = useState<boolean>(false)
    const [bushidoWeapon, setBushidoWeapon] = useState<boolean | undefined>()
    const [bushidoInfo, setBushidoInfo] = useState<string>()
    const [geishaInfo, setGeishaInfo] = useState<string>()

    const [weaponCardPlayed, setWeaponCardPlayed] = useState<boolean>(false)
    const [actionCardPlayed, setActionCardPlayed] = useState<boolean>(false)
    const [propertyCardPlayed, setPropertyCardPlayed] = useState<boolean>(false)
    const [parryPlayed, setParryPlayed] = useState<boolean>(false)
    const [playerHit, setPlayerHit] = useState<boolean>(false)

    const [ieyasuModule, setIeyasuModule] = useState<boolean>(false)

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















        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
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
                // const dealtPlayer1Character = shuffledCharacterDeck.pop() as Character
                const dealtPlayer1Character = {
                    name: 'Ieyasu',
                    health: 5,
                }
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
                    setTurn(shogun.socketID)
                }, 500);
                setCurrentPlayer(shogun)
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
                setTurn(currentPlayer.socketID)
            })

            socket.on('newTurn', (newTurn) => {
                setTurn(newTurn.socketID)
                setCurrentPlayer(newTurn)
                setNewTurn(true)
            })

            socket.on('alterVictimHand', (victimHand) => {
                console.log(victimHand)
                setUsersHand([...victimHand])
            })

            socket.on('teaCeremony', (data: PlayersData[]) => {
                console.log('tea party')
                const playersIndex = data.findIndex(player => player.socketID === socket.id)
                const newHand = data[playersIndex].hand
                setUsersHand([...newHand])
            })

            socket.on('battlecryPlayed', () => {
                setParryModule(true)
                setTurn(socket.id)
            })

            socket.on('jujitsuPlayed', () => {
                setJujitsuInEffect(true)
                setParryModule(true)
                SetSelectedCard(undefined)
                setTurn(socket.id)
            })


            socket.on('initGameState', (playerData) => {
                console.log(playerData)
                setPlayersData(playerData)
                setPlayer1Hand(playerData[0].hand)
                setPlayer1Character(playerData[0].character)
                setPlayer1Role(playerData[0].role)
                setPlayer1Health(playerData[0].health as number)
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

            socket.on('updateGameState', ({ playersData, discardPile, drawDeck, currentPlayer, victim, wounds, cardPlayed, newTurn, parryPlayed, weaponCardPlayed, actionCardPlayed, propertyCardPlayed, playerHit, battlecryInfo, jujitsuInfo, bushidoWeapon, bushidoInfo, geishaInfo }) => {
                setPlayersData(playersData)
                setDrawDeck(drawDeck)
                setDiscardPile(discardPile)
                setCurrentPlayer(currentPlayer)
                setVictim(victim)
                setWounds(wounds)
                setCardPlayed(cardPlayed)
                setNewTurn(newTurn)
                setParryPlayed(parryPlayed)
                setWeaponCardPlayed(weaponCardPlayed)
                setActionCardPlayed(actionCardPlayed)
                setPropertyCardPlayed(propertyCardPlayed)
                setPlayerHit(playerHit)
                setBattlecryInfo(battlecryInfo)
                setJujitsuInfo(jujitsuInfo)
                setBushidoWeapon(bushidoWeapon)
                setBushidoInfo(bushidoInfo)
                setGeishaInfo(geishaInfo)
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
        ], room)
    }

    const updateGameState = () => {
        console.log('update game')
        socket.emit('updateGameState', {
            playersData: playersData,
            drawDeck: drawDeck,
            discardPile: discardPile,
            currentPlayer: currentPlayer,
            victim: victim,
            wounds: wounds,
            newTurn: newTurn,
            cardPlayed: cardPlayed,
            parryPlayed: parryPlayed,
            weaponCardPlayed: weaponCardPlayed,
            actionCardPlayed: actionCardPlayed,
            propertyCardPlayed: propertyCardPlayed,
            playerHit: playerHit,
            battlecryInfo: battlecryInfo,
            jujitsuInfo: jujitsuInfo,
            bushidoWeapon: bushidoWeapon,
            bushidoInfo: bushidoInfo,
            geishaInfo: geishaInfo
        }, room)
    }

    useEffect(() => {
        if (playersData.length > 0 && startGame) {
            console.log('player data change')
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

    const handleSelectedCard = (card: PlayableCard, index: number) => {
        if (turn === socket.id) {
            setSelectedPlayer('')
            SetSelectedCard(card)
            if (card.type === 'weapon' && turn === socket.id && jujitsuInEffect) {
                handleJujitsuDiscard(card, index)
                setJujitsuInEffect(false)
            }
            if (card.type === 'weapon' && turn === socket.id && bushidoWeapon) {
                handleBushidoDiscard(card, index)
                setBushidoWeapon(undefined)
            }
        }

    }

    const indexOfSelectedPlayer: () => number = () => {
        return playersData.findIndex(player => player.socketID === selectedPlayer)
    }

    const indexOfSelectedCard: () => number = () => {
        if (selectedCard) {
            return usersHand.indexOf(selectedCard)
        } else return -1
    }

    const randomCard: (arr: PlayableCard[]) => number = (arr) => {
        const randomIndex = Math.floor(Math.random() * arr.length)
        return randomIndex
    }

    useEffect(() => {
        if (usersHand.length > 0) {
            const index = usersHand.findIndex(card => card.type === 'action' && card.name === 'Parry')
            setIndexOfParry(index)
            const data = [...playersData]
            data[indexOfPlayer].hand = usersHand
            setPlayersData(data)
        }
    }, [usersHand])


    const drawCards = () => {
        const newCards: PlayableCard[] = []
        for (let i = 0; i < 2; i++) {
            if (drawDeck.length > 0) {
                newCards.push(drawDeck.pop() as PlayableCard);
            }
        }

        setUsersHand([...usersHand, ...newCards])
        setNewTurn(false)
        if (ieyasuModule === true) {
            setIeyasuModule(false)
        }
    }

    const drawCardFromDiscard = () => {
        setUsersHand([...usersHand, discardPile.pop() as PlayableCard, drawDeck.pop() as PlayableCard])

        setNewTurn(false)
        if (ieyasuModule === true) {
            setIeyasuModule(false)
        }
    }


    useEffect(() => {
        if (turn === socket.id && newTurn) {
            if (playersData[indexOfPlayer].bushido === true) {
                const drawnCard = drawDeck.pop() as PlayableCard

                setDiscardPile([...discardPile, drawnCard])

                if (drawnCard.type === 'weapon') {
                    setWeaponCardPlayed(false)
                    setActionCardPlayed(false)
                    setPropertyCardPlayed(false)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(true)

                    setTimeout(() => {
                        setParryModule(true)
                    }, 100);
                }
                else {
                    setWeaponCardPlayed(false)
                    setActionCardPlayed(false)
                    setPropertyCardPlayed(false)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(false)
                    drawCards()
                    const data = [...playersData]
                    data[indexOfPlayer].bushido = false
                    if (!!playersData[indexOfPlayer + 1]) {
                        data[indexOfPlayer + 1].bushido = true
                    } else {
                        data[0].bushido = true
                    }

                    setPlayersData(data)
                }
            } else if (playersData[indexOfPlayer].character.name === 'Ieyasu' && discardPile.length > 0) {
                setIeyasuModule(true)
            }
            else {
                drawCards()
            }

        }

    }, [turn]);

    useEffect(() => {
        if (turn === socket.id && !parryModule) {
            updateGameState()
        }
    }, [playersData, discardPile, cardPlayed, victim, currentPlayer, weaponCardPlayed, actionCardPlayed, propertyCardPlayed, playerHit, parryPlayed, bushidoWeapon, geishaInfo])



    const setTurnBack = () => {
        socket.emit('setTurnBack', currentPlayer)
    }

    const handleParry = () => {
        setDiscardPile([...discardPile, {
            type: 'action',
            name: 'Parry'
        } as PlayableCard])
        const data = [...playersData]
        data[indexOfPlayer].hand.splice(indexOfParry, 1)
        setUsersHand(data[indexOfPlayer].hand)
        setPlayersData(data)
        setParryModule(false)
        // setActionCardPlayed(false)
        setWeaponCardPlayed(false)
        // setPropertyCardPlayed(false)
        // setPlayerHit(false)
        setParryPlayed(true)
        setTimeout(() => {
            setTurn('')
        }, 250);
        setTurnBack()

    }

    const handleGetAttacked = () => {
        const data = [...playersData]
        data[indexOfPlayer].health = data[indexOfPlayer].health - wounds

        if (playersData[indexOfPlayer].character.name === "Ushiwaka") {
            const newCards: PlayableCard[] = []
            for (let i = 0; i < wounds; i++) {
                if (drawDeck.length > 0) {
                    newCards.push(drawDeck.pop() as PlayableCard);
                }
            }
            setUsersHand([...usersHand, ...newCards])
        }

        setPlayersData(data)
        setPlayerHit(true)
        setParryModule(false)
        setWeaponCardPlayed(false)
        setTimeout(() => {
            setTurn('')
        }, 250);
        setTurnBack()

    }

    const handleBattlecryDiscard = () => {
        const newDiscardPile: PlayableCard[] = [...discardPile, {
            type: 'action',
            name: 'Parry'
        } as PlayableCard]
        const data = [...playersData]
        data[indexOfPlayer].hand.splice(indexOfParry, 1)
        setUsersHand(data[indexOfPlayer].hand)

        const newInfo = `${playersData[indexOfPlayer].socketID} discarded a parry`
        const newBattlecryInfo = [...battlecryInfo, newInfo]

        setDiscardPile(newDiscardPile)
        setPlayersData(data)
        setBattlecryInfo(newBattlecryInfo)

        setParryModule(false)
        setTimeout(() => {
            setTurn('')
        }, 250);

        if (newBattlecryInfo.length === playersData.length - 1) {
            setTurnBack()
        }
    }

    const handleBattlecryWound = () => {
        const data = [...playersData]
        data[indexOfPlayer].health = data[indexOfPlayer].health - wounds
        setPlayersData(data)

        const newInfo = `${playersData[indexOfPlayer].socketID} took 1 wound`
        const newBattlecryInfo = [...battlecryInfo, newInfo]
        setBattlecryInfo(newBattlecryInfo)

        setParryModule(false)
        setTimeout(() => {
            setTurn('')
        }, 250);

        if (newBattlecryInfo.length === playersData.length - 1) {
            setTurnBack()
        }
    }

    const handleJujitsuDiscard = (card: PlayableCard, index: number) => {
        const newDiscardPile: PlayableCard[] = [...discardPile, card]
        const data = [...playersData]
        data[indexOfPlayer].hand.splice(index, 1)
        setUsersHand(data[indexOfPlayer].hand)


        const newInfo = `${playersData[indexOfPlayer].character.name} discarded a weapon`
        const newJujitsuInfo = [...jujitsuInfo, newInfo]

        setDiscardPile(newDiscardPile)
        setPlayersData(data)
        setJujitsuInfo(newJujitsuInfo)

        setParryModule(false)
        setTimeout(() => {
            setTurn('')
        }, 250);
        if (newJujitsuInfo.length === playersData.length - 1) {
            setTurnBack()
        }
    }

    const handleJujitsuWound = () => {
        const data = [...playersData]
        data[indexOfPlayer].health = data[indexOfPlayer].health - wounds
        setPlayersData(data)

        const newInfo = `${playersData[indexOfPlayer].socketID} took 1 wound`
        const newJujitsuInfo = [...jujitsuInfo, newInfo]
        setJujitsuInfo(newJujitsuInfo)

        setParryModule(false)
        setTimeout(() => {
            setTurn('')
        }, 250);

        if (newJujitsuInfo.length === playersData.length - 1) {
            setTurnBack()
        }
    }

    const handleBushidoDiscard = (card: PlayableCard, index: number) => {
        setParryModule(false)

        const newDiscardPile: PlayableCard[] = [...discardPile, card]
        const data = [...playersData]
        data[indexOfPlayer].hand.splice(index, 1)

        if (playersData[indexOfPlayer].character.name === 'Ieyasu' && discardPile.length > 0) {
            setUsersHand(data[indexOfPlayer].hand)
            setIeyasuModule(true)
        } else {
            const newCards: PlayableCard[] = []
            for (let i = 0; i < 2; i++) {
                if (drawDeck.length > 0) {
                    newCards.push(drawDeck.pop() as PlayableCard);
                }
            }
            setUsersHand([...data[indexOfPlayer].hand, ...newCards])
        }

        data[indexOfPlayer].bushido = false

        if (!!playersData[indexOfPlayer + 1]) {
            data[indexOfPlayer + 1].bushido = true
        } else {
            data[0].bushido = true
        }

        const newInfo = `${playersData[indexOfPlayer].socketID} discarded a weapon.Bushido is passed on`
        setBushidoInfo(newInfo)
        setDiscardPile(newDiscardPile)
        setPlayersData(data)
    }

    const handleLoseHonourPoint = () => {
        setParryModule(false)

        const newDiscardPile: PlayableCard[] = [...discardPile, {
            type: 'property',
            name: 'Bushido'
        } as PlayableCard]
        const data = [...playersData]
        data[indexOfPlayer].bushido = false
        data[indexOfPlayer].honourPoints = data[indexOfPlayer].honourPoints - 1

        const newInfo = `${playersData[indexOfPlayer].socketID} lost a honour point. Bushido is discarded`

        setDiscardPile(newDiscardPile)
        setBushidoInfo(newInfo)
        setPlayersData(data)
        setBushidoWeapon(undefined)

        if (playersData[indexOfPlayer].character.name === 'Ieyasu' && discardPile.length > 0) {
            setIeyasuModule(true)
        } else {
            drawCards()
        }
    }

    const handleDiscardRandomCard = () => {
        setParryModule(false)

        const data = [...playersData]
        const cardTook = data[indexOfSelectedPlayer()].hand[randomCard(data[indexOfSelectedPlayer()].hand)]
        const indexOfCardTook = data[indexOfSelectedPlayer()].hand.indexOf(cardTook)
        data[indexOfSelectedPlayer()].hand.splice(indexOfCardTook, 1)
        socket.emit('alterVictimHand', selectedPlayer, data[indexOfSelectedPlayer()].hand)

        setWeaponCardPlayed(false)
        setActionCardPlayed(false)
        setPropertyCardPlayed(false)
        setPlayerHit(false)
        setParryPlayed(false)
        setGeishaInfo(undefined)
        setBushidoInfo(undefined)
        setBushidoWeapon(undefined)
        setGeishaInfo(`${currentPlayer?.socketID} removed a random card from ${victim}'s hand`)
        setDiscardPile([...discardPile, cardTook])
        setPlayersData(data)
    }

    const handleRemoveFocus = () => {
        setParryModule(false)

        const data = [...playersData]
        data[indexOfSelectedPlayer()].focus = data[indexOfSelectedPlayer()].focus - 1

        setDiscardPile([...discardPile, {
            type: 'property',
            name: 'Focus'
        } as PlayableCard])

        setWeaponCardPlayed(false)
        setActionCardPlayed(false)
        setPropertyCardPlayed(false)
        setPlayerHit(false)
        setParryPlayed(false)
        setGeishaInfo(undefined)
        setBushidoInfo(undefined)
        setBushidoWeapon(undefined)
        setGeishaInfo(`${currentPlayer?.socketID} removed 1 Focus from ${victim}`)
        setPlayersData(data)
    }

    const handleRemoveArmor = () => {
        setParryModule(false)

        const data = [...playersData]
        data[indexOfSelectedPlayer()].armor = data[indexOfSelectedPlayer()].armor - 1

        setDiscardPile([...discardPile, {
            type: 'property',
            name: 'Armor'
        } as PlayableCard])

        setWeaponCardPlayed(false)
        setActionCardPlayed(false)
        setPropertyCardPlayed(false)
        setPlayerHit(false)
        setParryPlayed(false)
        setGeishaInfo(undefined)
        setBushidoInfo(undefined)
        setBushidoWeapon(undefined)
        setGeishaInfo(`${currentPlayer?.socketID} removed 1 Armor from ${victim}`)
        setPlayersData(data)
    }

    const handleRemoveFastDraw = () => {
        setParryModule(false)

        const data = [...playersData]
        data[indexOfSelectedPlayer()].fastDraw = data[indexOfSelectedPlayer()].fastDraw - 1

        setDiscardPile([...discardPile, {
            type: 'property',
            name: 'Fast Draw'
        } as PlayableCard])

        setWeaponCardPlayed(false)
        setActionCardPlayed(false)
        setPropertyCardPlayed(false)
        setPlayerHit(false)
        setParryPlayed(false)
        setGeishaInfo(undefined)
        setBushidoInfo(undefined)
        setBushidoWeapon(undefined)
        setGeishaInfo(`${currentPlayer?.socketID} removed 1 Fast Draw from ${victim}`)
        setPlayersData(data)
    }

    const handleRemoveBushido = () => {
        setParryModule(false)

        const data = [...playersData]
        data[indexOfSelectedPlayer()].bushido = false

        setDiscardPile([...discardPile, {
            type: 'property',
            name: 'Bushido'
        } as PlayableCard])

        setWeaponCardPlayed(false)
        setActionCardPlayed(false)
        setPropertyCardPlayed(false)
        setPlayerHit(false)
        setParryPlayed(false)
        setGeishaInfo(undefined)
        setBushidoInfo(undefined)
        setBushidoWeapon(undefined)
        setGeishaInfo(`${currentPlayer?.socketID} removed Bushido from ${victim}`)
        setPlayersData(data)
    }

    useEffect(() => {
        const handleCardPlayer = () => {
            if (turn === socket.id) {
                console.log(selectedCard)
            }

            if (turn !== socket.id || !selectedCard || parryModule || ieyasuModule) {
                return
            }

            if (!!selectedCard && selectedCard.type === 'weapon' && selectedPlayer !== '') {
                const range = selectedCard.range

                const difficulty = () => {
                    const difficulty1 = Math.abs((indexOfPlayer + 1) - (indexOfSelectedPlayer() as number + 1))
                    const difficulty2 = playersData.length - difficulty1
                    if (difficulty1 > difficulty2) {
                        if (playersData[indexOfSelectedPlayer()].character.name === 'Benkai') {
                            return difficulty2 + 1
                        }
                        return difficulty2
                    } else {
                        if (playersData[indexOfSelectedPlayer()].character.name === 'Benkai') {
                            return difficulty1 + 1
                        }
                        return difficulty1
                    }
                }

                if (range !== undefined && range < difficulty() && playersData[indexOfPlayer].character.name !== 'Kojiro') {
                    setSelectedPlayer('')
                    alert('Cannot reach target')
                } else {
                    setWeaponCardPlayed(true)
                    setActionCardPlayed(false)
                    setPropertyCardPlayed(false)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setGeishaInfo(undefined)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    setDiscardPile([...discardPile, selectedCard])
                    const hand = [...usersHand]
                    hand.splice(indexOfSelectedCard(), 1)
                    setUsersHand(hand)
                    setWounds(selectedCard.damage as number)
                    setCardPlayed(selectedCard)
                    setVictim(playersData[indexOfSelectedPlayer()])
                    socket.emit('attacked', selectedPlayer, room)
                    setSelectedPlayer('')
                    SetSelectedCard(undefined)
                }
            }

            if (!!selectedCard && selectedCard.type === 'action') {

                if (selectedCard.name === 'Daimyo') {
                    setDiscardPile([...discardPile, selectedCard])
                    const hand = [...usersHand]
                    hand.splice(indexOfSelectedCard(), 1)

                    const newCards: PlayableCard[] = [];
                    for (let i = 0; i < 2; i++) {
                        if (drawDeck.length > 0) {
                            newCards.push(drawDeck.pop() as PlayableCard);
                        }
                    }
                    setUsersHand([...hand, ...newCards])

                    setCardPlayed(selectedCard)
                    setWeaponCardPlayed(false)
                    setActionCardPlayed(true)
                    setPropertyCardPlayed(false)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setGeishaInfo(undefined)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    SetSelectedCard(undefined)
                }

                if (selectedCard.name === 'Divertion' && selectedPlayer !== '') {
                    setDiscardPile([...discardPile, selectedCard])
                    const hand = [...usersHand]
                    hand.splice(indexOfSelectedCard(), 1)

                    const data = [...playersData]
                    const cardTook = data[indexOfSelectedPlayer()].hand[randomCard(data[indexOfSelectedPlayer()].hand)]
                    const indexOfCardTook = data[indexOfSelectedPlayer()].hand.indexOf(cardTook)
                    data[indexOfSelectedPlayer()].hand.splice(indexOfCardTook, 1)
                    socket.emit('alterVictimHand', selectedPlayer, data[indexOfSelectedPlayer()].hand)

                    setUsersHand([...hand, cardTook])
                    setPlayersData(data)

                    setCardPlayed(selectedCard)
                    setVictim(playersData[indexOfSelectedPlayer()])
                    setWeaponCardPlayed(false)
                    setActionCardPlayed(true)
                    setPropertyCardPlayed(false)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setGeishaInfo(undefined)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    setSelectedPlayer('')
                    SetSelectedCard(undefined)
                }

                if (selectedCard.name === 'Breathing' && selectedPlayer !== '') {
                    setDiscardPile([...discardPile, selectedCard])
                    const hand = [...usersHand]
                    hand.splice(indexOfSelectedCard(), 1)
                    setUsersHand([...hand])

                    const data: PlayersData[] = [...playersData]
                    console.log(data[indexOfPlayer].character)
                    data[indexOfPlayer].health = data[indexOfPlayer].character.health
                    const newCard = drawDeck.pop()
                    data[indexOfSelectedPlayer()].hand.push(newCard as PlayableCard)
                    socket.emit('alterVictimHand', selectedPlayer, data[indexOfSelectedPlayer()].hand)
                    setPlayersData(data)

                    setCardPlayed(selectedCard)
                    setVictim(playersData[indexOfSelectedPlayer()])
                    setWeaponCardPlayed(false)
                    setActionCardPlayed(true)
                    setPropertyCardPlayed(false)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setGeishaInfo(undefined)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    setSelectedPlayer('')
                    SetSelectedCard(undefined)
                }

                if (selectedCard.name === 'Tea Ceremony') {
                    setDiscardPile([...discardPile, selectedCard])
                    const hand = [...usersHand]
                    hand.splice(indexOfSelectedCard(), 1)
                    const newCards: PlayableCard[] = [];
                    for (let i = 0; i < 3; i++) {
                        if (drawDeck.length > 0) {
                            newCards.push(drawDeck.pop() as PlayableCard);
                        }
                    }

                    setUsersHand([...hand, ...newCards])
                    const data = [...playersData]
                    for (let i = 0; i < data.length; i++) {
                        if (i !== indexOfPlayer) {
                            data[i].hand.push(drawDeck.pop() as PlayableCard)
                        }
                    }
                    setPlayersData(data)
                    socket.emit('teaCeremony', data, room)

                    setCardPlayed(selectedCard)
                    setWeaponCardPlayed(false)
                    setActionCardPlayed(true)
                    setPropertyCardPlayed(false)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setGeishaInfo(undefined)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    SetSelectedCard(undefined)
                }

                if (selectedCard.name === 'Battlecry') {
                    setDiscardPile([...discardPile, selectedCard])
                    const hand = [...usersHand]
                    hand.splice(indexOfSelectedCard(), 1)
                    setUsersHand([...hand])
                    setCardPlayed(selectedCard)
                    setWounds(1)
                    setWeaponCardPlayed(false)
                    setActionCardPlayed(true)
                    setPropertyCardPlayed(false)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setGeishaInfo(undefined)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    SetSelectedCard(undefined)
                    setBattlecryInfo([])
                    setJujitsuInfo([])
                    setTimeout(() => {
                        setTurn('')
                    }, 250);

                    socket.emit('battlecryPlayed', room)

                }

                if (selectedCard.name === 'Jujitsu') {
                    setDiscardPile([...discardPile, selectedCard])
                    const hand = [...usersHand]
                    hand.splice(indexOfSelectedCard(), 1)
                    setUsersHand([...hand])
                    setCardPlayed(selectedCard)
                    setWounds(1)
                    setWeaponCardPlayed(false)
                    setActionCardPlayed(true)
                    setPropertyCardPlayed(false)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setGeishaInfo(undefined)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    SetSelectedCard(undefined)
                    setBattlecryInfo([])
                    setJujitsuInfo([])
                    setTimeout(() => {
                        setTurn('')
                    }, 250);

                    socket.emit('jujitsuPlayed', room)

                }

                if (selectedCard.name === 'Geisha' && selectedPlayer !== '') {
                    setDiscardPile([...discardPile, selectedCard])
                    const hand = [...usersHand]
                    hand.splice(indexOfSelectedCard(), 1)
                    setUsersHand([...hand])
                    setVictim(playersData[indexOfSelectedPlayer()])
                    setCardPlayed(selectedCard)
                    SetSelectedCard(undefined)
                    setParryModule(true)
                }
            }

            if (!!selectedCard && selectedCard.type === 'property') {

                if (selectedCard.name === 'Focus') {
                    const hand = [...usersHand]
                    hand.splice(indexOfSelectedCard(), 1)
                    setUsersHand([...hand])
                    setCardPlayed(selectedCard)
                    setWeaponCardPlayed(false)
                    setActionCardPlayed(false)
                    setPropertyCardPlayed(true)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setGeishaInfo(undefined)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    SetSelectedCard(undefined)

                    const data = [...playersData]
                    data[indexOfPlayer].focus = data[indexOfPlayer].focus + 1
                    setPlayersData(data)
                }

                if (selectedCard.name === 'Armor') {
                    const hand = [...usersHand]
                    hand.splice(indexOfSelectedCard(), 1)
                    setUsersHand([...hand])
                    setCardPlayed(selectedCard)
                    setWeaponCardPlayed(false)
                    setActionCardPlayed(false)
                    setPropertyCardPlayed(true)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setGeishaInfo(undefined)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    SetSelectedCard(undefined)

                    const data = [...playersData]
                    data[indexOfPlayer].armor = data[indexOfPlayer].armor + 1
                    setPlayersData(data)
                }

                if (selectedCard.name === 'Fast Draw') {
                    const hand = [...usersHand]
                    hand.splice(indexOfSelectedCard(), 1)
                    setUsersHand([...hand])
                    setCardPlayed(selectedCard)
                    setWeaponCardPlayed(false)
                    setActionCardPlayed(false)
                    setPropertyCardPlayed(true)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setGeishaInfo(undefined)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    SetSelectedCard(undefined)

                    const data = [...playersData]
                    data[indexOfPlayer].fastDraw = data[indexOfPlayer].fastDraw + 1
                    setPlayersData(data)
                }

                if (selectedCard.name === 'Bushido' && selectedPlayer !== '') {
                    if (playersData.findIndex(player => player.bushido === true) !== -1) {
                        alert('Only 1 Bushido can be in play at a time')
                        return
                    } else {
                        const hand = [...usersHand]
                        hand.splice(indexOfSelectedCard(), 1)
                        setUsersHand([...hand])
                        setCardPlayed(selectedCard)
                        setVictim(playersData[indexOfSelectedPlayer()])
                        setWeaponCardPlayed(false)
                        setActionCardPlayed(false)
                        setPropertyCardPlayed(true)
                        setPlayerHit(false)
                        setParryPlayed(false)
                        setGeishaInfo(undefined)
                        setBushidoInfo(undefined)
                        SetSelectedCard(undefined)

                        const data = [...playersData]
                        data[indexOfSelectedPlayer()].bushido = true
                        setPlayersData(data)
                    }
                }
            }
        }

        handleCardPlayer()
    }, [selectedCard, selectedPlayer])


    const endTurn = () => {
        if (!!playersData[indexOfPlayer + 1]) {
            const newTurn = playersData[indexOfPlayer + 1]
            socket.emit('newTurn', newTurn, room)
            setTurn('')
        } else {
            const newTurn = playersData[0]
            socket.emit('newTurn', newTurn, room)
            setTurn('')
        }
    }


    return (
        <>

            {!startGame && <Lobby handleStartGame={handleStartGame} initGameState={initGameState} socket={socket} handleSetPlayers={handleSetPlayers} />}

            <AnnouncementModule
                currentPlayer={currentPlayer}
                victim={victim}
                wounds={wounds}
                cardPlayed={cardPlayed}
                weaponCardPlayed={weaponCardPlayed}
                actionCardPlayed={actionCardPlayed}
                propertyCardPlayed={propertyCardPlayed}
                playerHit={playerHit}
                parryPlayed={parryPlayed}
                battlecryInfo={battlecryInfo}
                jujitsuInfo={jujitsuInfo}
                playersData={playersData}
                bushidoWeapon={bushidoWeapon}
                bushidoInfo={bushidoInfo}
                geishaInfo={geishaInfo}
            />

            {parryModule && playersData.length > 0 && <ParryModule
                wounds={wounds}
                indexOfParry={indexOfParry}
                handleParry={handleParry}
                handleGetAttacked={handleGetAttacked}
                cardPlayed={cardPlayed}
                handleBattlecryDiscard={handleBattlecryDiscard}
                handleBattlecryWound={handleBattlecryWound}
                handleJujitsuWound={handleJujitsuWound}
                bushidoWeapon={bushidoWeapon}
                handleLoseHonourPoint={handleLoseHonourPoint}
                victim={victim}
                handleDiscardRandomCard={handleDiscardRandomCard}
                handleRemoveFocus={handleRemoveFocus}
                handleRemoveArmor={handleRemoveArmor}
                handleRemoveFastDraw={handleRemoveFastDraw}
                handleRemoveBushido={handleRemoveBushido}
            />}

            {ieyasuModule && <IeyasuModule
                drawCardFromDiscard={drawCardFromDiscard}
                drawCards={drawCards}
            />}

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
                                {playersData[1].focus > 0 &&
                                    <p>Focus x {playersData[1].focus}</p>
                                }
                                {playersData[1].armor > 0 &&
                                    <p>Armor x {playersData[1].armor}</p>
                                }
                                {playersData[1].fastDraw > 0 &&
                                    <p>Fast Draw x {playersData[1].fastDraw}</p>
                                }
                                {playersData[1].bushido &&
                                    <p>Bushido</p>
                                }
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
                                {playersData[2].focus > 0 &&
                                    <p>Focus x {playersData[2].focus}</p>
                                }
                                {playersData[2].armor > 0 &&
                                    <p>Armor x {playersData[2].armor}</p>
                                }
                                {playersData[2].fastDraw > 0 &&
                                    <p>Fast Draw x {playersData[2].fastDraw}</p>
                                }
                                {playersData[2].bushido &&
                                    <p>Bushido</p>
                                }
                            </div>
                        </div>}


                    <div className='game__deck-container'>
                        <p>Draw Deck #: {drawDeck.length}</p>
                        {discardPile.length > 0 &&
                            <>
                                <p>Discard Pile #: {discardPile.length}</p>
                                <p>Discard Pile:{discardPile[discardPile.length - 1].name}</p>
                            </>}
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
                            {playersData[0].focus > 0 &&
                                <p>Focus x {playersData[0].focus}</p>
                            }
                            {playersData[0].armor > 0 &&
                                <p>Armor x {playersData[0].armor}</p>
                            }
                            {playersData[0].fastDraw > 0 &&
                                <p>Fast Draw x {playersData[0].fastDraw}</p>
                            }
                            {playersData[0].bushido &&
                                <p>Bushido</p>
                            }
                            <div className='game__user-hand'>
                                {usersHand.length > 0 && usersHand.map((card: PlayableCard, index) => {
                                    return <p className='card' key={index}
                                        onClick={() => {
                                            handleSelectedCard(card, index)
                                        }}>{card.name}</p>
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
                            {playersData[2].focus > 0 &&
                                <p>Focus x {playersData[2].focus}</p>
                            }
                            {playersData[2].armor > 0 &&
                                <p>Armor x {playersData[2].armor}</p>
                            }
                            {playersData[2].fastDraw > 0 &&
                                <p>Fast Draw x {playersData[2].fastDraw}</p>
                            }
                            {playersData[2].bushido &&
                                <p>Bushido</p>
                            }
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
                            {playersData[0].focus > 0 &&
                                <p>Focus x {playersData[0].focus}</p>
                            }
                            {playersData[0].armor > 0 &&
                                <p>Armor x {playersData[0].armor}</p>
                            }
                            {playersData[0].fastDraw > 0 &&
                                <p>Fast Draw x {playersData[0].fastDraw}</p>
                            }
                            {playersData[0].bushido &&
                                <p>Bushido</p>
                            }
                        </div>
                    </div>


                    <div className='game__deck-container'>
                        <p>Draw Deck #: {drawDeck.length}</p>
                        {discardPile.length > 0 &&
                            <>
                                <p>Discard Pile #: {discardPile.length}</p>
                                <p>Discard Pile:{discardPile[discardPile.length - 1].name}</p>
                            </>}
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
                        {playersData[1].focus > 0 &&
                            <p>Focus x {playersData[1].focus}</p>
                        }
                        {playersData[1].armor > 0 &&
                            <p>Armor x {playersData[1].armor}</p>
                        }
                        {playersData[1].fastDraw > 0 &&
                            <p>Fast Draw x {playersData[1].fastDraw}</p>
                        }
                        {playersData[1].bushido &&
                            <p>Bushido</p>
                        }
                        <div className='game__user-hand'>
                            {usersHand.length > 0 && usersHand.map((card: PlayableCard, index) => {
                                return <p className='card' key={index}
                                    onClick={() => {
                                        handleSelectedCard(card, index)
                                    }}>{card.name}</p>
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
                            {playersData[0].focus > 0 &&
                                <p>Focus x {playersData[0].focus}</p>
                            }
                            {playersData[0].armor > 0 &&
                                <p>Armor x {playersData[0].armor}</p>
                            }
                            {playersData[0].fastDraw > 0 &&
                                <p>Fast Draw x {playersData[0].fastDraw}</p>
                            }
                            {playersData[0].bushido &&
                                <p>Bushido</p>
                            }
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
                            {playersData[1].focus > 0 &&
                                <p>Focus x {playersData[1].focus}</p>
                            }
                            {playersData[1].armor > 0 &&
                                <p>Armor x {playersData[1].armor}</p>
                            }
                            {playersData[1].fastDraw > 0 &&
                                <p>Fast Draw x {playersData[1].fastDraw}</p>
                            }
                            {playersData[1].bushido &&
                                <p>Bushido</p>
                            }
                        </div>
                    </div>


                    <div className='game__deck-container'>
                        <p>Draw Deck #: {drawDeck.length}</p>
                        {discardPile.length > 0 &&
                            <>
                                <p>Discard Pile #: {discardPile.length}</p>
                                <p>Discard Pile:{discardPile[discardPile.length - 1].name}</p>
                            </>}
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
                        {playersData[2].focus > 0 &&
                            <p>Focus x {playersData[2].focus}</p>
                        }
                        {playersData[2].armor > 0 &&
                            <p>Armor x {playersData[2].armor}</p>
                        }
                        {playersData[2].fastDraw > 0 &&
                            <p>Fast Draw x {playersData[2].fastDraw}</p>
                        }
                        {playersData[2].bushido &&
                            <p>Bushido</p>
                        }
                        <div className='game__user-hand'>
                            {usersHand.length > 0 && usersHand.map((card: PlayableCard, index) => {
                                return <p className='card' key={index}
                                    onClick={() => {
                                        handleSelectedCard(card, index)
                                    }}>{card.name}</p>
                            })}
                        </div>
                    </div>
                </>
            }

            {startGame && turn === socket.id ? <button onClick={() => endTurn()}>End Turn</button> : <button disabled>End Turn</button>}

            {/* <button onClick={() => {
                console.log(currentPlayer)
            }}>current player
            </button> */}


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





