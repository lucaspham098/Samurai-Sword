import './GamePage.scss'
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client'
import AnnouncementModule from '../../components/AnnouncementModule/AnnouncementModule';
import ParryModule from '../../components/ParryModule/ParryModule';
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

    const [initialPlayersdata, setInitialPlayersData] = useState<PlayersData[]>([])

    const [startGame, setStartGame] = useState(false)
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [winner, setWinner] = useState<string>('')

    const [usersHand, setUsersHand] = useState<PlayableCard[]>([])
    const [indexOfParry, setIndexOfParry] = useState<number>(-1)

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

        socket.emit('askForPlayers', room)

        socket.on('players', playersData => {
            console.log('receive players')
            setInitialPlayersData(playersData)
        })
        socket.on('setTurn', shogun => {
            setTimeout(() => {
                setTurn(shogun.socketID)

            }, 100);
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

        socket.on('initGameState', (playersData: PlayersData[]) => {
            console.log('receive initgamestate')
            const playerIndex = playersData.findIndex(player => player.socketID === socket.id)
            setIndexOfPlayer(playerIndex)
            setPlayersData(playersData)
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

        socket.on('battlecryPlayed', (playersData: PlayersData[]) => {
            const playerIndex = playersData.findIndex(player => player.socketID === socket.id)
            // console.log(playersData[playerIndex])
            if (playersData[playerIndex].character.name !== 'Chiyome') {
                setParryModule(true)
                setTurn(socket.id)
            }
        })

        socket.on('jujitsuPlayed', (playersData: PlayersData[]) => {
            const playerIndex = playersData.findIndex(player => player.socketID === socket.id)
            // console.log(playersData[playerIndex])
            if (playersData[playerIndex].character.name !== 'Chiyome') {
                setJujitsuInEffect(true)
                setParryModule(true)
                SetSelectedCard(undefined)
                setTurn(socket.id)
            }
        })


    }, [])


    useEffect(() => {

        const shuffledMainDeck = shuffle(mainDeck)
        const shuffledRoleDeck = shuffle(roleDeck)
        const shuffledCharacterDeck = shuffle(characterDeck)
        const data = [...initialPlayersdata]

        if (effectRan.current === false && initialPlayersdata.length > 0) {

            const dealtPlayer1Character = shuffledCharacterDeck.pop() as Character
            const dealtPlayer1Role = shuffledRoleDeck.pop() as Role
            data[0].character = dealtPlayer1Character
            data[0].health = dealtPlayer1Character.health
            data[0].role = dealtPlayer1Role

            if (dealtPlayer1Role.role === 'Shogun') {
                data[0].honourPoints = 6
                data[0].attacks = 2
                const dealtPlayer1Hand: PlayableCard[] = []
                for (let i = 0; i < 4; i++) {
                    dealtPlayer1Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
                data[0].hand = dealtPlayer1Hand
                if (dealtPlayer1Character.name === 'Goemon') {
                    data[0].attacks = 3
                }
            } else {
                const dealtPlayer1Hand: PlayableCard[] = []
                for (let i = 0; i < 5; i++) {
                    dealtPlayer1Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
                data[0].honourPoints = 3
                data[0].hand = dealtPlayer1Hand
            }

            if (dealtPlayer1Character.name === 'Goemon') {
                data[0].attacks = 2
            }



            // const dealtPlayer2Character = shuffledCharacterDeck.pop() as Character
            const dealtPlayer2Character = {
                name: 'Goemon',
                health: 5,
            } as Character
            const dealtPlayer2Role = shuffledRoleDeck.pop() as Role
            data[1].character = dealtPlayer2Character
            data[1].health = dealtPlayer2Character.health
            data[1].role = dealtPlayer2Role


            if (dealtPlayer2Role.role === 'Shogun') {
                data[1].honourPoints = 6
                data[1].attacks = 2
                const dealtPlayer2Hand: PlayableCard[] = []
                for (let i = 0; i < 4; i++) {
                    dealtPlayer2Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
                data[1].hand = dealtPlayer2Hand
                if (dealtPlayer2Character.name === 'Goemon') {
                    data[1].attacks = 3
                }
            } else {
                const dealtPlayer2Hand: PlayableCard[] = []
                for (let i = 0; i < 5; i++) {
                    dealtPlayer2Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
                data[1].honourPoints = 3
                data[1].hand = dealtPlayer2Hand
            }

            if (dealtPlayer2Character.name === 'Goemon') {
                data[1].attacks = 2
            }



            const dealtPlayer3Character = shuffledCharacterDeck.pop() as Character
            const dealtPlayer3Role = shuffledRoleDeck.pop() as Role
            data[2].character = dealtPlayer3Character
            data[2].health = dealtPlayer3Character.health
            data[2].role = dealtPlayer3Role

            if (dealtPlayer3Role.role === 'Shogun') {
                data[2].honourPoints = 6
                data[2].attacks = 2
                const dealtPlayer3Hand: PlayableCard[] = []
                for (let i = 0; i < 4; i++) {
                    dealtPlayer3Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
                data[2].hand = dealtPlayer3Hand
                if (dealtPlayer3Character.name === 'Goemon') {
                    data[2].attacks = 3
                }
            } else {
                const dealtPlayer3Hand: PlayableCard[] = []
                for (let i = 0; i < 5; i++) {
                    dealtPlayer3Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
                data[2].honourPoints = 3
                data[2].hand = dealtPlayer3Hand
            }

            if (dealtPlayer3Character.name === 'Goemon') {
                data[2].attacks = 2
            }



            setDrawDeck(shuffledMainDeck as PlayableCard[])

            if (data[0].socketID === socket.id) {
                socket.emit('initGameState', data, room)
            }


            effectRan.current = true
        }


    }, [initialPlayersdata])


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
        if (playersData.length > 0) {
            console.log('player data change')
            const index = playersData[indexOfPlayer].hand.findIndex(card => card.type === 'action' && card.name === 'Parry')
            setIndexOfParry(index)
        }

    }, [playersData])


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
            if (card.type === 'weapon' && turn === socket.id && weaponCardPlayed && parryModule && playersData[indexOfPlayer].character.name === "Hanzo" && playersData[indexOfPlayer].hand.length > 1) {
                handleHanzoWeaponParry(card, index)
            }
        }

    }

    const indexOfSelectedPlayer: () => number = () => {
        return playersData.findIndex(player => player.socketID === selectedPlayer)
    }

    const indexOfSelectedCard: () => number = () => {
        if (selectedCard) {
            return playersData[indexOfPlayer].hand.indexOf(selectedCard)
        } else return -1
    }

    const randomCard: (arr: PlayableCard[]) => number = (arr) => {
        const randomIndex = Math.floor(Math.random() * arr.length)
        return randomIndex
    }

    const drawCards = () => {
        if (playersData.length > 0) {
            const data = [...playersData]

            const newCards: PlayableCard[] = []
            for (let i = 0; i < 2; i++) {
                if (drawDeck.length > 0) {
                    newCards.push(drawDeck.pop() as PlayableCard);
                }
            }

            data[indexOfPlayer].hand = [...data[indexOfPlayer].hand, ...newCards]
            setPlayersData(data)
            setNewTurn(false)
            if (ieyasuModule === true) {
                setIeyasuModule(false)
            }
        }

    }

    const drawCardFromDiscard = () => {
        const data = [...playersData]
        data[indexOfPlayer].hand = [...data[indexOfPlayer].hand, discardPile.pop() as PlayableCard, drawDeck.pop() as PlayableCard]
        setPlayersData(data)

        setNewTurn(false)
        if (ieyasuModule === true) {
            setIeyasuModule(false)
        }
    }


    useEffect(() => {
        if (turn === socket.id && newTurn) {
            if (playersData[indexOfPlayer]?.bushido === true) {
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
                    const data = [...playersData]
                    data[indexOfPlayer].bushido = false
                    if (!!playersData[indexOfPlayer + 1]) {
                        data[indexOfPlayer + 1].bushido = true
                    } else {
                        data[0].bushido = true
                    }

                    if (playersData[indexOfPlayer].character.name === "Ieyasu") {
                        setIeyasuModule(true)
                    } else {
                        drawCards()
                    }

                    setPlayersData(data)
                }
            } else if (playersData[indexOfPlayer]?.character.name === 'Ieyasu' && discardPile.length > 0) {
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

    const handleHanzoWeaponParry = (card: PlayableCard, index: number) => {
        setParryModule(false)

        setDiscardPile([...discardPile, card])
        const data = [...playersData]
        data[indexOfPlayer].hand.splice(index, 1)
        setPlayersData(data)

        setWeaponCardPlayed(false)
        setParryPlayed(true)
        setTimeout(() => {
            setTurn('')
        }, 250);
        setTurnBack()
    }

    const handleParry = () => {
        setDiscardPile([...discardPile, {
            type: 'action',
            name: 'Parry'
        } as PlayableCard])
        const data = [...playersData]
        data[indexOfPlayer].hand.splice(indexOfParry, 1)
        setPlayersData(data)
        setParryModule(false)
        setWeaponCardPlayed(false)
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
            data[indexOfPlayer].hand = [...data[indexOfPlayer].hand, ...newCards]
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

        const newInfo = `${playersData[indexOfPlayer].character.name} discarded a parry`
        const newBattlecryInfo = [...battlecryInfo, newInfo]

        setDiscardPile(newDiscardPile)
        setPlayersData(data)
        setBattlecryInfo(newBattlecryInfo)

        setParryModule(false)
        setTimeout(() => {
            setTurn('')
        }, 250);


        if ((playersData.findIndex(player => player.character.name === 'Chiyome') !== -1 && currentPlayer?.character.name !== 'Chiyome')) {
            if (newBattlecryInfo.length === playersData.length - 2) {
                setTurnBack()
            }
        } else if (newBattlecryInfo.length === playersData.length - 1) {
            setTurnBack()
        }
    }

    const handleBattlecryWound = () => {
        const data = [...playersData]
        data[indexOfPlayer].health = data[indexOfPlayer].health - wounds
        setPlayersData(data)

        const newInfo = `${playersData[indexOfPlayer].character.name} took 1 wound`
        const newBattlecryInfo = [...battlecryInfo, newInfo]
        setBattlecryInfo(newBattlecryInfo)

        setParryModule(false)
        setTimeout(() => {
            setTurn('')
        }, 250);

        if ((playersData.findIndex(player => player.character.name === 'Chiyome') !== -1 && currentPlayer?.character.name !== 'Chiyome')) {
            if (newBattlecryInfo.length === playersData.length - 2) {
                setTurnBack()
            }
        } else if (newBattlecryInfo.length === playersData.length - 1) {
            setTurnBack()
        }
    }

    const handleJujitsuDiscard = (card: PlayableCard, index: number) => {
        const newDiscardPile: PlayableCard[] = [...discardPile, card]
        const data = [...playersData]
        data[indexOfPlayer].hand.splice(index, 1)


        const newInfo = `${playersData[indexOfPlayer].character.name} discarded a weapon`
        const newJujitsuInfo = [...jujitsuInfo, newInfo]

        setDiscardPile(newDiscardPile)
        setPlayersData(data)
        setJujitsuInfo(newJujitsuInfo)

        setParryModule(false)
        setTimeout(() => {
            setTurn('')
        }, 250);


        if ((playersData.findIndex(player => player.character.name === 'Chiyome') !== -1 && currentPlayer?.character.name !== 'Chiyome')) {
            if (newJujitsuInfo.length === playersData.length - 2) {
                setTurnBack()
            }
        } else if (newJujitsuInfo.length === playersData.length - 1) {
            setTurnBack()
        }
    }

    const handleJujitsuWound = () => {
        const data = [...playersData]
        data[indexOfPlayer].health = data[indexOfPlayer].health - wounds
        setPlayersData(data)

        const newInfo = `${playersData[indexOfPlayer].character.name} took 1 wound`
        const newJujitsuInfo = [...jujitsuInfo, newInfo]
        setJujitsuInfo(newJujitsuInfo)

        setParryModule(false)
        setTimeout(() => {
            setTurn('')
        }, 250);


        if ((playersData.findIndex(player => player.character.name === 'Chiyome') !== -1 && currentPlayer?.character.name !== 'Chiyome')) {
            if (newJujitsuInfo.length === playersData.length - 2) {
                setTurnBack()
            }
        } else if (newJujitsuInfo.length === playersData.length - 1) {
            setTurnBack()
        }
    }

    const handleBushidoDiscard = (card: PlayableCard, index: number) => {
        setParryModule(false)

        const newDiscardPile: PlayableCard[] = [...discardPile, card]
        const data = [...playersData]
        data[indexOfPlayer].hand.splice(index, 1)

        if (playersData[indexOfPlayer].character.name === 'Ieyasu' && discardPile.length > 0) {
            setIeyasuModule(true)
        } else {
            const newCards: PlayableCard[] = []
            for (let i = 0; i < 2; i++) {
                if (drawDeck.length > 0) {
                    newCards.push(drawDeck.pop() as PlayableCard);
                }
            }
            data[indexOfPlayer].hand = [...data[indexOfPlayer].hand, ...newCards]
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


        setWeaponCardPlayed(false)
        setActionCardPlayed(false)
        setPropertyCardPlayed(false)
        setPlayerHit(false)
        setParryPlayed(false)
        setGeishaInfo(undefined)
        setBushidoInfo(undefined)
        setBushidoWeapon(undefined)
        setGeishaInfo(`${currentPlayer?.character.name} removed a random card from ${victim?.character.name}'s hand`)
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

            const data = [...playersData]

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
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)
                    setWounds(selectedCard.damage as number)
                    setCardPlayed(selectedCard)
                    setVictim(playersData[indexOfSelectedPlayer()])
                    setPlayersData(data)
                    socket.emit('attacked', selectedPlayer, room)
                    setSelectedPlayer('')
                    SetSelectedCard(undefined)

                }
            }

            if (!!selectedCard && selectedCard.type === 'action') {

                if (selectedCard.name === 'Daimyo') {
                    setDiscardPile([...discardPile, selectedCard])


                    const newCards: PlayableCard[] = [];
                    for (let i = 0; i < 2; i++) {
                        if (drawDeck.length > 0) {
                            newCards.push(drawDeck.pop() as PlayableCard);
                        }
                    }
                    data[indexOfPlayer].hand = [...data[indexOfPlayer].hand.filter(card => card !== selectedCard), ...newCards]

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
                    setPlayersData(data)
                }

                if (selectedCard.name === 'Divertion' && selectedPlayer !== '') {
                    setDiscardPile([...discardPile, selectedCard])
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)


                    const cardTook = data[indexOfSelectedPlayer()].hand[randomCard(data[indexOfSelectedPlayer()].hand)]
                    const indexOfCardTook = data[indexOfSelectedPlayer()].hand.indexOf(cardTook)
                    data[indexOfSelectedPlayer()].hand.splice(indexOfCardTook, 1)

                    data[indexOfPlayer].hand = [...data[indexOfPlayer].hand.filter(card => card !== selectedCard), cardTook]


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
                    setPlayersData(data)

                }

                if (selectedCard.name === 'Breathing' && selectedPlayer !== '') {
                    setDiscardPile([...discardPile, selectedCard])
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)


                    data[indexOfPlayer].health = data[indexOfPlayer].character.health
                    const newCard = drawDeck.pop()
                    data[indexOfSelectedPlayer()].hand.push(newCard as PlayableCard)


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
                    setPlayersData(data)

                }

                if (selectedCard.name === 'Tea Ceremony') {
                    setDiscardPile([...discardPile, selectedCard])

                    const newCards: PlayableCard[] = [];
                    for (let i = 0; i < 3; i++) {
                        if (drawDeck.length > 0) {
                            newCards.push(drawDeck.pop() as PlayableCard);
                        }
                    }

                    data[indexOfPlayer].hand = [...data[indexOfPlayer].hand.filter(card => card !== selectedCard), ...newCards]


                    for (let i = 0; i < data.length; i++) {
                        if (i !== indexOfPlayer) {
                            data[i].hand.push(drawDeck.pop() as PlayableCard)
                        }
                    }

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
                    setPlayersData(data)
                }

                if (selectedCard.name === 'Battlecry') {
                    setDiscardPile([...discardPile, selectedCard])
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)

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
                    setPlayersData(data)
                    setTimeout(() => {
                        setTurn('')
                    }, 250);

                    socket.emit('battlecryPlayed', room, playersData)

                }

                if (selectedCard.name === 'Jujitsu') {
                    setDiscardPile([...discardPile, selectedCard])
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)

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
                    setPlayersData(data)
                    setTimeout(() => {
                        setTurn('')
                    }, 250);

                    socket.emit('jujitsuPlayed', room, playersData)

                }

                if (selectedCard.name === 'Geisha' && selectedPlayer !== '') {
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)
                    setDiscardPile([...discardPile, selectedCard])

                    setVictim(playersData[indexOfSelectedPlayer()])
                    setCardPlayed(selectedCard)
                    SetSelectedCard(undefined)
                    setParryModule(true)
                }
            }

            if (!!selectedCard && selectedCard.type === 'property') {

                if (selectedCard.name === 'Focus') {
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)
                    data[indexOfPlayer].focus = data[indexOfPlayer].focus + 1

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
                    setPlayersData(data)
                }

                if (selectedCard.name === 'Armor') {
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)
                    data[indexOfPlayer].armor = data[indexOfPlayer].armor + 1

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

                    setPlayersData(data)
                }

                if (selectedCard.name === 'Fast Draw') {
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)
                    data[indexOfPlayer].fastDraw = data[indexOfPlayer].fastDraw + 1

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

                    setPlayersData(data)
                }

                if (selectedCard.name === 'Bushido' && selectedPlayer !== '') {
                    if (playersData.findIndex(player => player.bushido === true) !== -1) {
                        alert('Only 1 Bushido can be in play at a time')
                        return
                    } else {
                        data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)
                        data[indexOfSelectedPlayer()].bushido = true

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

            {playersData.length > 0 && playersData[0].socketID === socket.id &&
                <>

                    <div className="game__flex-container">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>Player 2</h1>
                            <div className='game__player-character' id={playersData[1].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                <p>{playersData[1].character.name}</p>
                            </div>
                            {playersData[1].role.role === 'Shogun' &&
                                <div className='game__player-role'>
                                    <p>{playersData[1].role.role}</p>
                                </div>
                            }
                            <p>Health: {playersData[1].health}</p>
                            <p>Honour Points:{playersData[1].honourPoints}</p>
                            <p>Attacks:{playersData[1].attacks}</p>
                            <p>Card #:{playersData[1].hand.length} </p>
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
                                <p>{playersData[2].character.name}</p>
                            </div>
                            {playersData[2].role.role === 'Shogun' &&
                                <div className='game__player-role'>
                                    <p>{playersData[2].role.role}</p>
                                </div>
                            }
                            <p>Health: {playersData[2].health}</p>
                            <p>Honour Points:{playersData[2].honourPoints}</p>
                            <p>Attacks:{playersData[2].attacks}</p>
                            <p>Card #:{playersData[2].hand.length} </p>
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
                            <p>{playersData[0].character.name}</p>
                        </div>
                        {playersData[0].role.role === 'Shogun' &&
                            <div className='game__user-role'>
                                <p>{playersData[0].role.role}</p>
                            </div>
                        }
                        <p>Health: {playersData[0].health}</p>
                        <p>Honour Points:{playersData[0].honourPoints}</p>
                        <p>Attacks:{playersData[0].attacks}</p>
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
                            {playersData[0].hand.length > 0 && playersData[0].hand.map((card: PlayableCard, index) => {
                                return <p className='card' key={index}
                                    onClick={() => {
                                        handleSelectedCard(card, index)
                                    }}>{card.name}</p>
                            })}
                        </div>
                    </div>
                </>
            }

            {playersData.length > 0 && socket.id === playersData[1].socketID &&
                <>
                    <div className="game__flex-container">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>Player 3</h1>
                            <div className='game__player-character' id={playersData[2].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                <p>{playersData[2].character.name}</p>
                            </div>
                            {playersData[2].role.role === 'Shogun' &&
                                <div className='game__player-role'>
                                    <p>{playersData[2].role.role}</p>
                                </div>
                            }
                            <p>Health: {playersData[2].health}</p>
                            <p>Honour Points:{playersData[2].honourPoints}</p>
                            <p>Attacks:{playersData[2].attacks}</p>
                            <p>Card #:{playersData[2].hand.length} </p>
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
                                <p>{playersData[0].character.name}</p>
                            </div>
                            {playersData[0].role.role === 'Shogun' &&
                                <div className='game__player-role'>
                                    <p>{playersData[0].role.role}</p>
                                </div>
                            }
                            <p>Health: {playersData[0].health}</p>
                            <p>Honour Points:{playersData[0].honourPoints}</p>
                            <p>Attacks:{playersData[0].attacks}</p>
                            <p>Card #:{playersData[0].hand.length} </p>
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
                            <p>{playersData[1].character.name}</p>
                        </div>
                        {playersData[1].role.role === 'Shogun' &&
                            <div className='game__user-role'>
                                <p>{playersData[1].role.role}</p>
                            </div>
                        }
                        <p>Health: {playersData[1].health}</p>
                        <p>Honour Points:{playersData[1].honourPoints}</p>
                        <p>Attacks:{playersData[1].attacks}</p>
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
                            {playersData[1].hand.length > 0 && playersData[1].hand.map((card: PlayableCard, index) => {
                                return <p className='card' key={index}
                                    onClick={() => {
                                        handleSelectedCard(card, index)
                                    }}>{card.name}</p>
                            })}
                        </div>
                    </div>
                </>
            }

            {playersData.length > 0 && socket.id === playersData[2].socketID &&
                <>
                    <div className="game__flex-container">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>Player 1</h1>
                            <div className='game__player-character' id={playersData[0].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                <p>{playersData[0].character.name}</p>
                            </div>
                            {playersData[0].role.role === 'Shogun' &&
                                <div className='game__player-role'>
                                    <p>{playersData[0].role.role}</p>
                                </div>
                            }
                            <p>Health: {playersData[0].health}</p>
                            <p>Honour Points:{playersData[0].honourPoints}</p>
                            <p>Attacks:{playersData[0].attacks}</p>
                            <p>Card #:{playersData[0].hand.length} </p>
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
                                <p>{playersData[1].character.name}</p>
                            </div>
                            {playersData[1].role.role === 'Shogun' &&
                                <div className='game__player-role'>
                                    <p>{playersData[1].role.role}</p>
                                </div>
                            }
                            <p>Health: {playersData[1].health}</p>
                            <p>Honour Points:{playersData[1].honourPoints}</p>
                            <p>Attacks:{playersData[1].attacks}</p>
                            <p>Card #:{playersData[1].hand.length} </p>
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
                            <p>{playersData[2].character.name}</p>
                        </div>
                        {playersData[2].role.role === 'Shogun' &&
                            <div className='game__player-role'>
                                <p>{playersData[2].role.role}</p>
                            </div>
                        }
                        <p>Health: {playersData[2].health}</p>
                        <p>Honour Points:{playersData[2].honourPoints}</p>
                        <p>Attacks:{playersData[2].attacks}</p>
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
                            {playersData[2].hand.length > 0 && playersData[2].hand.map((card: PlayableCard, index) => {
                                return <p className='card' key={index}
                                    onClick={() => {
                                        handleSelectedCard(card, index)
                                    }}>{card.name}</p>
                            })}
                        </div>
                    </div>
                </>
            }

            {turn === socket.id ? <button onClick={() => endTurn()}>End Turn</button> : <button disabled>End Turn</button>}

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





