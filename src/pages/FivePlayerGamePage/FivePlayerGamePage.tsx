import './FivePlayerGamePage.scss'
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client'
import AnnouncementModule from '../../components/AnnouncementModule/AnnouncementModule';
import ParryModule from '../../components/ParryModule/ParryModule';
import IeyasuModule from '../../components/IeyasuModule/IeyasuModule';
import GameOverModule from '../../components/GameOverModule/GameOverModule';

import heart from '../../assets/images/icons/heart.svg'
import cherry_blossum from '../../assets/images/icons/cherry_blossum.svg'

import cardBack from '../../assets/images/cardBack.jpeg'

import benkei from '../../assets/images/characters/benkei.jpeg'
import chiyome from '../../assets/images/characters/chiyome.jpeg'
import ginchiyo from '../../assets/images/characters/ginchiyo.jpeg'
import goemon from '../../assets/images/characters/goemon.jpeg'
import hanzo from '../../assets/images/characters/hanzo.jpeg'
import hideyoshi from '../../assets/images/characters/hideyoshi.jpeg'
import ieyasu from '../../assets/images/characters/ieyasu.jpeg'
import kojiro from '../../assets/images/characters/kojiro.jpeg'
import musashi from '../../assets/images/characters/musashi.jpeg'
import nobunaga from '../../assets/images/characters/nobunaga.jpeg'
import tomoe from '../../assets/images/characters/tomoe.jpeg'
import ushiwaka from '../../assets/images/characters/ushiwaka.jpeg'

import battlecry from '../../assets/images/actions/battlecry.jpeg'
import breathing from '../../assets/images/actions/breathing.jpeg'
import daimyo from '../../assets/images/actions/daimyo.jpeg'
import divertion from '../../assets/images/actions/divertion.jpeg'
import geisha from '../../assets/images/actions/geisha.jpeg'
import jujitsu from '../../assets/images/actions/jujitsu.jpeg'
import parry from '../../assets/images/actions/parry.jpeg'
import tea_ceremony from '../../assets/images/actions/tea_ceremony.jpeg'

import armor from '../../assets/images/porperties/armor.jpeg'
import bushido from '../../assets/images/porperties/bushido.jpeg'
import fast_draw from '../../assets/images/porperties/fast_draw.jpeg'
import focus from '../../assets/images/porperties/focus.jpeg'

import bo from '../../assets/images/weapons/bo.jpeg'
import bokken from '../../assets/images/weapons/bokken.jpeg'
import daikyu from '../../assets/images/weapons/daikyu.jpeg'
import kanabo from '../../assets/images/weapons/kanabo.jpeg'
import katana from '../../assets/images/weapons/katana.jpeg'
import kiseru from '../../assets/images/weapons/kiseru.jpeg'
import kusarigama from '../../assets/images/weapons/kusarigama.jpeg'
import nagayari from '../../assets/images/weapons/nagayari.jpeg'
import naginata from '../../assets/images/weapons/naginata.jpeg'
import nodachi from '../../assets/images/weapons/nodachi.jpeg'
import shuriken from '../../assets/images/weapons/shuriken.jpeg'
import tanegashima from '../../assets/images/weapons/tanegashima.jpeg'
import wakizashi from '../../assets/images/weapons/wakizashi.jpeg'

import ninja1 from '../../assets/images/roles/ninja1.jpeg'
import ninja2 from '../../assets/images/roles/ninja2.jpeg'
import ninja3 from '../../assets/images/roles/ninja3.jpeg'
import ronin from '../../assets/images/roles/ronin.jpeg'
import samurai from '../../assets/images/roles/samurai.jpeg'
import shogun from '../../assets/images/roles/shogun.jpeg'
import PlayerSelectionModule from '../../components/PlayerSelectionModule/PlayerSelectionModule';



type GamePageProp = {
    socket: Socket
}

interface PlayersData {
    name: string,
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
    bushido: boolean,
    harmless: boolean
}

interface PlayableCard {
    type: string;
    name: string;
    range?: number;
    damage?: number;
    img: string
}

interface Character {
    name: string;
    health: number;
    img: string
}

interface Role {
    role: string;
    team: string;
    stars?: number;
    img: string
}

const FivePlayerGamePage = ({ socket }: GamePageProp) => {

    const effectRan = useRef(false)

    const { room } = useParams()

    const [initialPlayersdata, setInitialPlayersData] = useState<PlayersData[]>([])

    const [gameOver, setGameOver] = useState<boolean>(false)
    const [deadlyStrikeNinja, setDeadlyStrikeNinja] = useState<boolean>(false)
    const [deadlyStrikeShogun, setDeadlyStrikeShogun] = useState<boolean>(false)
    const [victoryOfTheSwordMaster, setVictoryOfTheSwordMaster] = useState<boolean>(false)

    const [teamNinjaInfo, setTeamNinjaInfo] = useState<number>()
    const [teamShogunInfo, setTeamShogunInfo] = useState<number>()
    const [teamRoninInfo, setTeamRoninInfo] = useState<number | undefined>(undefined)
    const [winner, setWinner] = useState<string>('')

    const [indexOfParry, setIndexOfParry] = useState<number>(-1)

    const [playersData, setPlayersData] = useState<PlayersData[]>([])
    const [indexOfPlayer, setIndexOfPlayer] = useState<number>(-1)


    const [selectingPlayer, setSelectingPlayer] = useState<boolean>(false)
    const [selectedPlayer, setSelectedPlayer] = useState<string | undefined>(undefined)
    const [selectedCard, setSelectedCard] = useState<PlayableCard | undefined>()
    const [activeCard, setActiveCard] = useState<number | null>(null)

    const [cardPlayed, setCardPlayed] = useState<PlayableCard>()
    const [currentPlayer, setCurrentPlayer] = useState<PlayersData>()
    const [cardPlayedBy, setCardPlayedBy] = useState<PlayersData>()
    const [victim, setVictim] = useState<PlayersData>()
    const [wounds, setWounds] = useState<number>(0)

    const [turn, setTurn] = useState<string>('')
    const [newTurn, setNewTurn] = useState<boolean>(true)

    const [drawDeck, setDrawDeck] = useState<PlayableCard[]>([])
    const [discardPile, setDiscardPile] = useState<PlayableCard[]>([])
    const [emptyDrawDeck, setEmptyDrawDeck] = useState<boolean>(false)

    const [parryModule, setParryModule] = useState<boolean>(false)

    const [battlecryJujitsuArray, setBattlecryJujitsuArray] = useState<PlayersData[]>([])
    const [battlecryJujitsuTurn, setBattlecryJujitsuTurn] = useState<PlayersData | undefined>(undefined)
    const [battlecryInfo, setBattlecryInfo] = useState<string[]>([])
    const [jujitsuInfo, setJujitsuInfo] = useState<string[]>([])
    const [jujitsuInEffect, setJujitsuInEffect] = useState<boolean>(false)
    const [bushidoWeapon, setBushidoWeapon] = useState<boolean | undefined>(undefined)
    const [bushidoInfo, setBushidoInfo] = useState<string>()
    const [geishaInfo, setGeishaInfo] = useState<string>()

    const [weaponCardPlayed, setWeaponCardPlayed] = useState<boolean>(false)
    const [actionCardPlayed, setActionCardPlayed] = useState<boolean>(false)
    const [propertyCardPlayed, setPropertyCardPlayed] = useState<boolean>(false)
    const [parryPlayed, setParryPlayed] = useState<boolean>(false)
    const [playerHit, setPlayerHit] = useState<boolean>(false)
    const [death, setDeath] = useState<boolean>(false)

    const [attacksPlayed, setAttacksPlayed] = useState<number>(0)

    const [discardCards, setDiscardCards] = useState<boolean>(false)

    const [ieyasuModule, setIeyasuModule] = useState<boolean>(false)

    const mainDeck: PlayableCard[] = [
        {
            type: 'weapon',
            name: 'Bokken',
            range: 1,
            damage: 1,
            img: bokken
        },
        {
            type: 'weapon',
            name: 'Bokken',
            range: 1,
            damage: 1,
            img: bokken
        },
        {
            type: 'weapon',
            name: 'Bokken',
            range: 1,
            damage: 1,
            img: bokken
        },
        {
            type: 'weapon',
            name: 'Bokken',
            range: 1,
            damage: 1,
            img: bokken
        },
        {
            type: 'weapon',
            name: 'Bokken',
            range: 1,
            damage: 1,
            img: bokken
        },
        {
            type: 'weapon',
            name: 'Bokken',
            range: 1,
            damage: 1,
            img: bokken
        },
        {
            type: 'weapon',
            name: 'Kusarigama',
            range: 2,
            damage: 2,
            img: kusarigama
        },
        {
            type: 'weapon',
            name: 'Kusarigama',
            range: 2,
            damage: 2,
            img: kusarigama
        },
        {
            type: 'weapon',
            name: 'Kusarigama',
            range: 2,
            damage: 2,
            img: kusarigama
        },
        {
            type: 'weapon',
            name: 'Kusarigama',
            range: 2,
            damage: 2,
            img: kusarigama
        },
        {
            type: 'weapon',
            name: 'Bo',
            range: 2,
            damage: 1,
            img: bo
        },
        {
            type: 'weapon',
            name: 'Bo',
            range: 2,
            damage: 1,
            img: bo
        },
        {
            type: 'weapon',
            name: 'Bo',
            range: 2,
            damage: 1,
            img: bo
        },
        {
            type: 'weapon',
            name: 'Bo',
            range: 2,
            damage: 1,
            img: bo
        },
        {
            type: 'weapon',
            name: 'Bo',
            range: 2,
            damage: 1,
            img: bo
        },
        {
            type: 'weapon',
            name: 'Daikyu',
            range: 5,
            damage: 2,
            img: daikyu
        },
        {
            type: 'weapon',
            name: 'Nagayari',
            range: 4,
            damage: 2,
            img: nagayari
        },
        {
            type: 'weapon',
            name: 'Kiseru',
            range: 1,
            damage: 2,
            img: kiseru
        },
        {
            type: 'weapon',
            name: 'Kiseru',
            range: 1,
            damage: 2,
            img: kiseru
        },
        {
            type: 'weapon',
            name: 'Kiseru',
            range: 1,
            damage: 2,
            img: kiseru
        },
        {
            type: 'weapon',
            name: 'Kiseru',
            range: 1,
            damage: 2,
            img: kiseru
        },
        {
            type: 'weapon',
            name: 'Kiseru',
            range: 1,
            damage: 2,
            img: kiseru
        },
        {
            type: 'weapon',
            name: 'Shuriken',
            range: 3,
            damage: 1,
            img: shuriken
        },
        {
            type: 'weapon',
            name: 'Shuriken',
            range: 3,
            damage: 1,
            img: shuriken
        },
        {
            type: 'weapon',
            name: 'Shuriken',
            range: 3,
            damage: 1,
            img: shuriken
        },
        {
            type: 'weapon',
            name: 'Wakizashi',
            range: 1,
            damage: 3,
            img: wakizashi
        },
        {
            type: 'weapon',
            name: 'Naginata',
            range: 4,
            damage: 1,
            img: naginata
        },
        {
            type: 'weapon',
            name: 'Naginata',
            range: 4,
            damage: 1,
            img: naginata
        },
        {
            type: 'weapon',
            name: 'Tanegashima',
            range: 5,
            damage: 1,
            img: tanegashima
        },
        {
            type: 'weapon',
            name: 'Nodachi',
            range: 3,
            damage: 3,
            img: nodachi
        },
        {
            type: 'weapon',
            name: 'Kanabo',
            range: 3,
            damage: 2,
            img: kanabo
        },
        {
            type: 'weapon',
            name: 'Katana',
            range: 2,
            damage: 3,
            img: katana
        },
        {
            type: 'action',
            name: 'Jujitsu',
            img: jujitsu
        },
        {
            type: 'action',
            name: 'Jujitsu',
            img: jujitsu
        },
        {
            type: 'action',
            name: 'Jujitsu',
            img: jujitsu
        },
        {
            type: 'action',
            name: 'Tea Ceremony',
            img: tea_ceremony
        },
        {
            type: 'action',
            name: 'Tea Ceremony',
            img: tea_ceremony
        },
        {
            type: 'action',
            name: 'Tea Ceremony',
            img: tea_ceremony
        },
        {
            type: 'action',
            name: 'Tea Ceremony',
            img: tea_ceremony
        },
        {
            type: 'action',
            name: 'Battlecry',
            img: battlecry
        },
        {
            type: 'action',
            name: 'Battlecry',
            img: battlecry
        },
        {
            type: 'action',
            name: 'Battlecry',
            img: battlecry
        },
        {
            type: 'action',
            name: 'Battlecry',
            img: battlecry
        },
        {
            type: 'action',
            name: 'Geisha',
            img: geisha
        },
        {
            type: 'action',
            name: 'Geisha',
            img: geisha
        },
        {
            type: 'action',
            name: 'Geisha',
            img: geisha
        },
        {
            type: 'action',
            name: 'Geisha',
            img: geisha
        },
        {
            type: 'action',
            name: 'Geisha',
            img: geisha
        },
        {
            type: 'action',
            name: 'Geisha',
            img: geisha
        },
        {
            type: 'action',
            name: 'Daimyo',
            img: daimyo
        },
        {
            type: 'action',
            name: 'Daimyo',
            img: daimyo
        },
        {
            type: 'action',
            name: 'Daimyo',
            img: daimyo
        },
        {
            type: 'action',
            name: 'Divertion',
            img: divertion
        },
        {
            type: 'action',
            name: 'Divertion',
            img: divertion
        },
        {
            type: 'action',
            name: 'Divertion',
            img: divertion
        },
        {
            type: 'action',
            name: 'Divertion',
            img: divertion
        },
        {
            type: 'action',
            name: 'Divertion',
            img: divertion
        },
        {
            type: 'action',
            name: 'Breathing',
            img: breathing
        },
        {
            type: 'action',
            name: 'Breathing',
            img: breathing
        },
        {
            type: 'action',
            name: 'Breathing',
            img: breathing
        },
        {
            type: 'action',
            name: 'Parry',
            img: parry
        },
        {
            type: 'action',
            name: 'Parry',
            img: parry
        },
        {
            type: 'action',
            name: 'Parry',
            img: parry
        },
        {
            type: 'action',
            name: 'Parry',
            img: parry
        },
        {
            type: 'action',
            name: 'Parry',
            img: parry
        },
        {
            type: 'action',
            name: 'Parry',
            img: parry
        },
        {
            type: 'action',
            name: 'Parry',
            img: parry
        },
        {
            type: 'action',
            name: 'Parry',
            img: parry
        },
        {
            type: 'action',
            name: 'Parry',
            img: parry
        },
        {
            type: 'action',
            name: 'Parry',
            img: parry
        },
        {
            type: 'action',
            name: 'Parry',
            img: parry
        },
        {
            type: 'action',
            name: 'Parry',
            img: parry
        },
        {
            type: 'action',
            name: 'Parry',
            img: parry
        },
        {
            type: 'action',
            name: 'Parry',
            img: parry
        },
        {
            type: 'action',
            name: 'Parry',
            img: parry
        },
        {
            type: 'property',
            name: 'Fast Draw',
            img: fast_draw
        },
        {
            type: 'property',
            name: 'Fast Draw',
            img: fast_draw
        },
        {
            type: 'property',
            name: 'Fast Draw',
            img: fast_draw
        },
        {
            type: 'property',
            name: 'Armor',
            img: armor
        },
        {
            type: 'property',
            name: 'Armor',
            img: armor
        },
        {
            type: 'property',
            name: 'Armor',
            img: armor
        },
        {
            type: 'property',
            name: 'Armor',
            img: armor
        },
        {
            type: 'property',
            name: 'Focus',
            img: focus
        },
        {
            type: 'property',
            name: 'Focus',
            img: focus
        },
        {
            type: 'property',
            name: 'Focus',
            img: focus
        },
        {
            type: 'property',
            name: 'Focus',
            img: focus
        },
        {
            type: 'property',
            name: 'Focus',
            img: focus
        },
        {
            type: 'property',
            name: 'Bushido',
            img: bushido
        },
        {
            type: 'property',
            name: 'Bushido',
            img: bushido
        },
    ]

    const characterDeck: Character[] = [
        {
            name: 'Benkai',
            health: 5,
            img: benkei
        },
        {
            name: 'Kojiro',
            health: 5,
            img: kojiro
        },
        {
            name: 'Ushiwaka',
            health: 4,
            img: ushiwaka
        },
        {
            name: 'Ieyasu',
            health: 5,
            img: ieyasu
        },
        {
            name: 'Chiyome',
            health: 4,
            img: chiyome
        },
        {
            name: 'Hanzo',
            health: 4,
            img: hanzo
        },
        {
            name: 'Goemon',
            health: 5,
            img: goemon
        },
        {
            name: 'Tomoe',
            health: 5,
            img: tomoe
        },
        {
            name: 'Nobunaga',
            health: 5,
            img: nobunaga
        },
        {
            name: 'Hideyoshi',
            health: 4,
            img: hideyoshi
        },
        {
            name: 'Musashi',
            health: 5,
            img: musashi
        },
        {
            name: 'Ginchiyo',
            health: 4,
            img: ginchiyo
        },
    ]


    const roleDeck: Role[] = [
        {
            role: 'Shogun',
            team: 'Shogun',
            img: shogun
        },
        {
            role: 'Samurai',
            team: 'Shogun',
            img: samurai
        },
        // {
        //     role: 'Samurai',
        //     team: 'Shogun',
        //     img:samurai
        // },
        {
            role: 'Ninja',
            team: 'Ninja',
            stars: 1,
            img: ninja1
        },
        // {
        //     role: 'Ninja',
        //     team: 'Ninja',
        //     stars: 2,
        //     img:ninja2
        // },
        {
            role: 'Ninja',
            team: 'Ninja',
            stars: 3,
            img: ninja3
        },
        {
            role: 'Ronin',
            team: 'Ronin',
            img: ronin
        },

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


    socket.on('initGameState', (playersData: PlayersData[]) => {
        console.log('game state initalized')
        const playerIndex = playersData.findIndex(player => player.socketID === socket.id)
        setIndexOfPlayer(playerIndex)
        setPlayersData(playersData)
    })

    useEffect(() => {

        socket.emit('askForPlayers', room)

        socket.on('players', playersData => {
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

        socket.on('setTurnBack', (currentPlayer, data: PlayersData[]) => {
            setTurn(currentPlayer.socketID)
            if (data.filter(player => player.honourPoints <= 0).length > 0 && !gameOver) {
                setGameOver(true)
            }
        })

        socket.on('newTurn', (newTurn) => {
            setEmptyDrawDeck(false)
            setGeishaInfo(undefined)
            setDeath(false)
            setTurn(newTurn.socketID)
            setParryPlayed(false)
            setPlayerHit(false)
            setCardPlayed(undefined)

            setCurrentPlayer(newTurn)
            setSelectedPlayer(undefined)
            setNewTurn(true)

        })

        socket.on('updateGameState', ({ playersData, discardPile, drawDeck, currentPlayer, cardPlayedBy, victim, wounds, cardPlayed, newTurn, parryPlayed, weaponCardPlayed, actionCardPlayed, propertyCardPlayed, playerHit, battlecryInfo, jujitsuInfo, bushidoWeapon, bushidoInfo, geishaInfo, death, battlecryJujitsuArray, battlecryJujitsuTurn, emptyDrawDeck, gameOver, deadlyStrikeNinja, deadlyStrikeShogun }) => {
            console.log('game state updated')
            setPlayersData(playersData)
            setDrawDeck(drawDeck)
            setDiscardPile(discardPile)
            setCurrentPlayer(currentPlayer)
            setCardPlayedBy(cardPlayedBy)
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
            setDeath(death)
            setBattlecryJujitsuArray(battlecryJujitsuArray)
            setBattlecryJujitsuTurn(battlecryJujitsuTurn)
            setEmptyDrawDeck(emptyDrawDeck)
            setGameOver(gameOver)
            setDeadlyStrikeNinja(deadlyStrikeNinja)
            setDeadlyStrikeShogun(deadlyStrikeShogun)
        })

        socket.on('battlecryPlayed', (battlecryJujitsuArray: PlayersData[]) => {
            console.log(battlecryJujitsuArray)
            setParryModule(true)
            setTurn(socket.id)

        })

        socket.on('jujitsuPlayed', (battlecryJujitsuArray: PlayersData[]) => {
            console.log(battlecryJujitsuArray)
            setJujitsuInEffect(true)
            setParryModule(true)
            setSelectedCard(undefined)
            setTurn(socket.id)
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
            const dealtPlayer1Hand: PlayableCard[] = []
            const dealtPlayer2Character = shuffledCharacterDeck.pop() as Character
            const dealtPlayer2Role = shuffledRoleDeck.pop() as Role
            const dealtPlayer2Hand: PlayableCard[] = []
            const dealtPlayer3Character = shuffledCharacterDeck.pop() as Character
            const dealtPlayer3Role = shuffledRoleDeck.pop() as Role
            const dealtPlayer3Hand: PlayableCard[] = []
            const dealtPlayer4Character = shuffledCharacterDeck.pop() as Character
            const dealtPlayer4Role = shuffledRoleDeck.pop() as Role
            const dealtPlayer4Hand: PlayableCard[] = []
            const dealtPlayer5Character = shuffledCharacterDeck.pop() as Character
            const dealtPlayer5Role = shuffledRoleDeck.pop() as Role
            const dealtPlayer5Hand: PlayableCard[] = []




            data[0].character = dealtPlayer1Character
            data[0].health = dealtPlayer1Character.health
            data[0].role = dealtPlayer1Role

            if (dealtPlayer1Role.role === 'Shogun' && dealtPlayer1Character.name === 'Goemon') {
                data[0].honourPoints = 5
                data[0].attacks = 2
            } else if (dealtPlayer1Role.role === 'Shogun' && dealtPlayer1Character.name !== 'Goemon') {
                data[0].honourPoints = 5
            } else if (dealtPlayer1Role.role !== 'Shogun' && dealtPlayer1Character.name === 'Goemon') {
                data[0].attacks = 2
                data[0].honourPoints = 3
            } else {
                data[0].honourPoints = 3
            }

            if (dealtPlayer1Role.role === 'Shogun') {
                for (let i = 0; i < 4; i++) {
                    dealtPlayer1Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
            } else if (dealtPlayer2Role.role === "Shogun" || dealtPlayer3Role.role === "Shogun") {
                for (let i = 0; i < 6; i++) {
                    dealtPlayer1Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
            } else {
                for (let i = 0; i < 5; i++) {
                    dealtPlayer1Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
            }

            data[0].hand = dealtPlayer1Hand



            data[1].character = dealtPlayer2Character
            data[1].health = dealtPlayer2Character.health
            data[1].role = dealtPlayer2Role

            if (dealtPlayer2Role.role === 'Shogun' && dealtPlayer2Character.name === 'Goemon') {
                data[1].honourPoints = 5
                data[1].attacks = 2
            } else if (dealtPlayer2Role.role === 'Shogun' && dealtPlayer2Character.name !== 'Goemon') {
                data[1].honourPoints = 5
            } else if (dealtPlayer2Role.role !== 'Shogun' && dealtPlayer2Character.name === 'Goemon') {
                data[1].attacks = 2
                data[1].honourPoints = 3
            } else {
                data[1].honourPoints = 3
            }

            if (dealtPlayer2Role.role === 'Shogun') {
                for (let i = 0; i < 4; i++) {
                    dealtPlayer2Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
            } else if (dealtPlayer3Role.role === "Shogun" || dealtPlayer4Role.role === "Shogun") {
                for (let i = 0; i < 6; i++) {
                    dealtPlayer2Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
            } else {
                for (let i = 0; i < 5; i++) {
                    dealtPlayer2Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
            }

            data[1].hand = dealtPlayer2Hand



            data[2].character = dealtPlayer3Character
            data[2].health = dealtPlayer3Character.health
            data[2].role = dealtPlayer3Role

            if (dealtPlayer3Role.role === 'Shogun' && dealtPlayer3Character.name === 'Goemon') {
                data[2].honourPoints = 5
                data[2].attacks = 2
            } else if (dealtPlayer3Role.role === 'Shogun' && dealtPlayer3Character.name !== 'Goemon') {
                data[2].honourPoints = 5
            } else if (dealtPlayer3Role.role !== 'Shogun' && dealtPlayer3Character.name === 'Goemon') {
                data[2].attacks = 2
                data[2].honourPoints = 3
            } else {
                data[2].honourPoints = 3
            }

            if (dealtPlayer3Role.role === 'Shogun') {
                for (let i = 0; i < 4; i++) {
                    dealtPlayer3Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
            } else if (dealtPlayer4Role.role === "Shogun" || dealtPlayer5Role.role === "Shogun") {
                for (let i = 0; i < 6; i++) {
                    dealtPlayer3Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
            } else {
                for (let i = 0; i < 5; i++) {
                    dealtPlayer3Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
            }
            data[2].hand = dealtPlayer3Hand



            data[3].character = dealtPlayer4Character
            data[3].health = dealtPlayer4Character.health
            data[3].role = dealtPlayer4Role

            if (dealtPlayer4Role.role === 'Shogun' && dealtPlayer4Character.name === 'Goemon') {
                data[3].honourPoints = 5
                data[3].attacks = 2
            } else if (dealtPlayer4Role.role === 'Shogun' && dealtPlayer4Character.name !== 'Goemon') {
                data[3].honourPoints = 5
            } else if (dealtPlayer4Role.role !== 'Shogun' && dealtPlayer4Character.name === 'Goemon') {
                data[3].attacks = 2
                data[3].honourPoints = 3
            } else {
                data[3].honourPoints = 3
            }

            if (dealtPlayer4Role.role === 'Shogun') {
                for (let i = 0; i < 4; i++) {
                    dealtPlayer4Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
            } else if (dealtPlayer1Role.role === "Shogun" || dealtPlayer5Role.role === "Shogun") {
                for (let i = 0; i < 6; i++) {
                    dealtPlayer4Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
            } else {
                for (let i = 0; i < 5; i++) {
                    dealtPlayer4Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
            }
            data[3].hand = dealtPlayer4Hand



            data[4].character = dealtPlayer5Character
            data[4].health = dealtPlayer5Character.health
            data[4].role = dealtPlayer5Role

            if (dealtPlayer5Role.role === 'Shogun' && dealtPlayer5Character.name === 'Goemon') {
                data[4].honourPoints = 5
                data[4].attacks = 2
            } else if (dealtPlayer5Role.role === 'Shogun' && dealtPlayer5Character.name !== 'Goemon') {
                data[4].honourPoints = 5
            } else if (dealtPlayer5Role.role !== 'Shogun' && dealtPlayer5Character.name === 'Goemon') {
                data[4].attacks = 2
                data[4].honourPoints = 3
            } else {
                data[4].honourPoints = 3
            }

            if (dealtPlayer5Role.role === 'Shogun') {
                for (let i = 0; i < 4; i++) {
                    dealtPlayer5Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
            } else if (dealtPlayer1Role.role === "Shogun" || dealtPlayer2Role.role === "Shogun") {
                for (let i = 0; i < 6; i++) {
                    dealtPlayer5Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
            } else {
                for (let i = 0; i < 5; i++) {
                    dealtPlayer5Hand.push(shuffledMainDeck.pop() as PlayableCard)
                }
            }
            data[4].hand = dealtPlayer5Hand



            setDrawDeck(shuffledMainDeck as PlayableCard[])

            if (data[0].socketID === socket.id) {
                socket.emit('initGameState', data, room)
            }

            effectRan.current = true
        }


    }, [initialPlayersdata])


    const updateGameState = () => {
        socket.emit('updateGameState', {
            playersData: playersData,
            drawDeck: drawDeck,
            discardPile: discardPile,
            currentPlayer: currentPlayer,
            victim: victim,
            cardPlayedBy: cardPlayedBy,
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
            geishaInfo: geishaInfo,
            death: death,
            battlecryJujitsuArray: battlecryJujitsuArray,
            battlecryJujitsuTurn: battlecryJujitsuTurn,
            emptyDrawDeck: emptyDrawDeck,
            gameOver: gameOver,
            deadlyStrikeNinja: deadlyStrikeNinja,
            deadlyStrikeShogun: deadlyStrikeShogun,
        }, room)
    }

    useEffect(() => {
        if (turn === socket.id) {
            if (!parryModule || discardCards)
                updateGameState()
        }
    }, [playersData, discardPile, drawDeck, cardPlayed, victim, currentPlayer, weaponCardPlayed, actionCardPlayed, propertyCardPlayed, playerHit, parryPlayed, bushidoWeapon, geishaInfo, newTurn])

    useEffect(() => {
        if (playersData.length > 0) {
            const index = playersData[indexOfPlayer]?.hand.findIndex(card => card.type === 'action' && card.name === 'Parry')
            setIndexOfParry(index)
        }

    }, [playersData])


    const handleSelectedPlayer = (target: HTMLDivElement) => {
        if (turn === socket.id && selectingPlayer) {
            setSelectedPlayer(target.id)
        }
    }

    const handleSelectedCard = (card: PlayableCard, index: number) => {
        if (turn === socket.id) {
            setSelectedCard(card)
            setActiveCard(null)

            if (discardCards) {
                setActiveCard(null)
                const data = [...playersData]
                setDiscardPile([...discardPile, card])
                data[indexOfPlayer].hand.splice(index, 1)
                setPlayersData(data)
                setSelectedCard(undefined)
                if (data[indexOfPlayer].hand.length === 7) {
                    setParryModule(false)
                    setDiscardCards(false)
                    setTimeout(() => {
                        endTurn()
                    }, 100);
                }
            }

            if (card.type === 'weapon' && turn === socket.id && jujitsuInEffect) {
                handleJujitsuDiscard(card, index)
                setJujitsuInEffect(false)
                setSelectedCard(undefined)
                setActiveCard(null)

            }

            if (card.type === 'weapon' && turn === socket.id && bushidoWeapon) {
                handleBushidoDiscard(card, index)
                setBushidoWeapon(undefined)
                setSelectedCard(undefined)
                setActiveCard(null)

            }

            if (card.type === 'weapon' && turn === socket.id && (weaponCardPlayed || cardPlayed?.name === 'Battlecry') && parryModule && playersData[indexOfPlayer].character.name === "Hanzo" && playersData[indexOfPlayer].hand.length > 1) {
                handleHanzoWeaponParry(card, index)
                setSelectedCard(undefined)
                setActiveCard(null)

            }


        }

    }

    const handleActiveCard = (cardIndex: number) => {
        if (currentPlayer?.socketID === socket.id && !bushidoWeapon && !discardCards) {
            setActiveCard(cardIndex === activeCard ? null : cardIndex)
        }
    }

    const indexOfSelectedPlayer: () => number = () => {
        return playersData.findIndex(player => player.socketID === selectedPlayer)
    }

    const indexOfCurrentPlayer = () => {
        return playersData.findIndex(player => player.socketID == currentPlayer?.socketID)
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


    useEffect(() => {
        if (drawDeck.length === 0 && playersData.length > 0 && !gameOver) {
            const data = [...playersData];
            data.map(player => player.honourPoints = player.honourPoints - 1)
            if (data.filter(player => player.honourPoints <= 0).length > 0) {
                setGameOver(true)
            }
            setDrawDeck(shuffle(discardPile) as PlayableCard[])
            setDiscardPile([])
            setEmptyDrawDeck(true)
            setPlayersData(data)
        }
    }, [drawDeck])

    const drawCards = (number: number) => {
        if (playersData.length > 0 && !gameOver) {
            const data = [...playersData];
            const newCards: PlayableCard[] = [];
            let newDrawDeck = [...drawDeck]

            for (let i = 0; i < number; i++) {
                if (newDrawDeck.length === 0) {
                    setEmptyDrawDeck(true)
                    data.map(player => player.honourPoints = player.honourPoints - 1)
                    setDiscardPile([])
                    if (data.filter(player => player.honourPoints <= 0).length > 0) {
                        setGameOver(true)
                        break
                    }
                    newDrawDeck = shuffle(discardPile) as PlayableCard[]
                    newCards.push(newDrawDeck.pop() as PlayableCard)

                } else {
                    newCards.push(newDrawDeck.pop() as PlayableCard);
                }
            }

            data[indexOfPlayer].hand = [...data[indexOfPlayer].hand, ...newCards];
            setDrawDeck(newDrawDeck)
            setPlayersData(data);

            if (ieyasuModule === true) {
                setIeyasuModule(false);
            }
        }
    };

    const handleNobunaga = () => {
        const data = [...playersData]
        if (data[indexOfPlayer].health > 1) {
            data[indexOfPlayer].hand = [...data[indexOfPlayer].hand, drawDeck.pop() as PlayableCard]
            data[indexOfPlayer].health = data[indexOfPlayer].health - 1

            setPlayersData(data)
        }

    }


    useEffect(() => {
        if (turn === socket.id && newTurn) {

            if (playersData[indexOfPlayer]?.harmless === true) {
                const data = [...playersData]
                data[indexOfPlayer].harmless = false
                setPlayersData(data)
            }

            if (playersData[indexOfPlayer]?.health === 0) {
                const data = [...playersData]
                data[indexOfPlayer].health = data[indexOfPlayer].character.health
                setPlayersData(data)
            }

            if (playersData[indexOfPlayer]?.bushido === true) {
                let newDrawDeck = [...drawDeck]
                const drawnCard = newDrawDeck.pop() as PlayableCard

                setDiscardPile([...discardPile, drawnCard])


                if (drawnCard.type === 'weapon') {
                    setDrawDeck(newDrawDeck)
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

                    if (playersData[indexOfPlayer]?.character.name === "Ieyasu") {
                        setIeyasuModule(true)
                    } else {
                        const newCards: PlayableCard[] = [];
                        if (playersData[indexOfPlayer]?.character.name === 'Hideyoshi') {

                            for (let i = 0; i < 3; i++) {
                                if (newDrawDeck.length === 0) {
                                    data.map(player => player.honourPoints = player.honourPoints - 1)
                                    setEmptyDrawDeck(true)
                                    setDiscardPile([])
                                    if (data.filter(player => player.honourPoints <= 0).length > 0) {
                                        setGameOver(true)
                                        break
                                    }
                                    newDrawDeck = shuffle(discardPile) as PlayableCard[]
                                    newCards.push(newDrawDeck.pop() as PlayableCard)

                                } else {
                                    newCards.push(newDrawDeck.pop() as PlayableCard);
                                }
                            }

                        } else {
                            for (let i = 0; i < 2; i++) {
                                if (newDrawDeck.length === 0) {
                                    setEmptyDrawDeck(true)
                                    data.map(player => player.honourPoints = player.honourPoints - 1)
                                    setDiscardPile([])
                                    if (data.filter(player => player.honourPoints <= 0).length > 0) {
                                        setGameOver(true)
                                        break
                                    }
                                    newDrawDeck = shuffle(discardPile) as PlayableCard[]
                                    newCards.push(newDrawDeck.pop() as PlayableCard)

                                } else {
                                    newCards.push(newDrawDeck.pop() as PlayableCard);
                                }
                            }
                        }

                        data[indexOfPlayer].hand = [...data[indexOfPlayer].hand, ...newCards];
                    }
                    setDrawDeck(newDrawDeck)
                    setPlayersData(data)
                }
            } else if (playersData[indexOfPlayer]?.character.name === 'Ieyasu' && currentPlayer?.character.name === 'Ieyasu' && discardPile.length > 0) {
                setIeyasuModule(true)
            } else {
                if (playersData[indexOfPlayer]?.character.name === 'Hideyoshi') {
                    drawCards(3)
                } else {
                    drawCards(2)
                }
            }

        }

    }, [turn]);

    const drawCardFromDiscard = () => {
        let newDrawDeck = [...drawDeck]
        const data = [...playersData]

        data[indexOfPlayer].hand = [...data[indexOfPlayer].hand, discardPile.pop() as PlayableCard, newDrawDeck.pop() as PlayableCard]

        setDrawDeck(newDrawDeck)
        setPlayersData(data)

        if (ieyasuModule === true) {
            setIeyasuModule(false)
        }
    }

    const setTurnBack = (data: PlayersData[] = []) => {
        socket.emit('setTurnBack', currentPlayer, data)
    }

    const handleHanzoWeaponParry = (card: PlayableCard, index: number) => {
        setParryModule(false)

        setDiscardPile([...discardPile, card])
        const data = [...playersData]
        data[indexOfPlayer].hand.splice(index, 1)

        if (cardPlayed?.name === 'Battlecry') {
            const newInfo = `${playersData[indexOfPlayer].name} discarded a Weapon as a Parry`
            const newBattlecryInfo = [...battlecryInfo, newInfo]
            const battlecryArray = [...battlecryJujitsuArray]
            battlecryArray.pop()

            setBattlecryJujitsuArray(battlecryArray)
            setBattlecryInfo(newBattlecryInfo)

            if (battlecryArray.length > 0) {
                setBattlecryJujitsuTurn(battlecryArray[battlecryArray.length - 1])
                socket.emit('battlecryPlayed', battlecryArray[battlecryArray.length - 1].socketID, battlecryArray)
            } else {
                setTurnBack()
            }

            setTimeout(() => {
                setTurn('')
            }, 250);
        } else {
            setWeaponCardPlayed(false)
            setParryPlayed(true)
            setTimeout(() => {
                setTurn('')
                setTurnBack()
            }, 250);
        }

        setPlayersData(data)

    }

    const handleParry = () => {
        setDiscardPile([...discardPile, {
            type: 'action',
            name: 'Parry',
            img: parry
        } as PlayableCard])
        const data = [...playersData]
        data[indexOfPlayer].hand.splice(indexOfParry, 1)

        if (data[indexOfPlayer].hand.length === 0) {
            data[indexOfPlayer].harmless = true
        }

        setPlayersData(data)
        setParryModule(false)
        setWeaponCardPlayed(false)
        setParryPlayed(true)
        setTimeout(() => {
            setTurn('')
            setTurnBack()
        }, 250);

    }

    const handleGetAttacked = () => {
        const data = [...playersData]
        let newDrawDeck = [...drawDeck]


        if (currentPlayer?.character.name === "Tomoe") {
            const indexOfTomoe = playersData.findIndex(player => player.character.name === 'Tomoe')
            data[indexOfTomoe].hand = [...data[indexOfTomoe].hand, newDrawDeck.pop() as PlayableCard]
            setDrawDeck(newDrawDeck)
        }

        if (data[indexOfPlayer].health - wounds === 0 || data[indexOfPlayer].health - wounds < 0) {
            data[indexOfPlayer].health = 0
            data[indexOfPlayer].honourPoints = data[indexOfPlayer].honourPoints - 1
            data[indexOfPlayer].harmless = true
            data[indexOfCurrentPlayer()].honourPoints = data[indexOfCurrentPlayer()].honourPoints + 1

            if (data.filter(player => player.health > 0).length === 1) {
                setVictoryOfTheSwordMaster(true)
                setTimeout(() => {
                    setGameOver(true)
                }, 100);
            }

            if (data[indexOfPlayer].honourPoints <= 0) {
                if (currentPlayer?.role.team === 'Ninja' && data[indexOfPlayer].role.team === 'Ninja') {
                    setDeadlyStrikeNinja(true)
                }
                if (currentPlayer?.role.team === 'Shogun' && data[indexOfPlayer].role.team === 'Shogun') {
                    setDeadlyStrikeShogun(true)
                }
                setGameOver(true)
            }

            setDeath(true)
        } else {
            data[indexOfPlayer].health = data[indexOfPlayer].health - wounds
        }

        if (playersData[indexOfPlayer].character.name === "Ushiwaka") {
            const newCards: PlayableCard[] = []

            for (let i = 0; i < wounds; i++) {
                if (newDrawDeck.length === 0) {
                    setEmptyDrawDeck(true)
                    data.map(player => player.honourPoints = player.honourPoints - 1)
                    if (data.filter(player => player.honourPoints <= 0).length > 0) {
                        setGameOver(true)
                        console.log('4')
                        break
                    }
                    newDrawDeck = shuffle(discardPile) as PlayableCard[]
                    newCards.push(newDrawDeck.pop() as PlayableCard)
                    setDiscardPile([])

                } else {
                    newCards.push(newDrawDeck.pop() as PlayableCard);
                }
            }
            data[indexOfPlayer].hand = [...data[indexOfPlayer].hand, ...newCards]
            setDrawDeck(newDrawDeck)
        }

        setPlayersData(data)
        setPlayerHit(true)
        setParryModule(false)
        setWeaponCardPlayed(false)
        setTimeout(() => {
            setTurn('')
            setTurnBack()
        }, 100);
    }

    const handleBattlecryDiscard = () => {
        const newDiscardPile: PlayableCard[] = [...discardPile, {
            type: 'action',
            name: 'Parry',
            img: parry
        } as PlayableCard]
        const data = [...playersData]
        data[indexOfPlayer].hand.splice(indexOfParry, 1)

        if (data[indexOfPlayer].hand.length === 0) {
            data[indexOfPlayer].harmless = true
        }

        const newInfo = `${playersData[indexOfPlayer].name} discarded a Parry`
        const newBattlecryInfo = [...battlecryInfo, newInfo]
        const battlecryArray = [...battlecryJujitsuArray]
        battlecryArray.pop()

        setBattlecryJujitsuArray(battlecryArray)
        setDiscardPile(newDiscardPile)
        setPlayersData(data)
        setBattlecryInfo(newBattlecryInfo)

        setParryModule(false)

        if (battlecryArray.length > 0) {
            setBattlecryJujitsuTurn(battlecryArray[battlecryArray.length - 1])
            socket.emit('battlecryPlayed', battlecryArray[battlecryArray.length - 1].socketID, battlecryArray)
        } else {
            setTurnBack()
        }

        setTimeout(() => {
            setTurn('')
        }, 250);



    }

    const handleBattlecryWound = () => {
        const data = [...playersData]

        if (data[indexOfPlayer].health - wounds === 0) {
            data[indexOfPlayer].health = 0
            data[indexOfPlayer].honourPoints = data[indexOfPlayer].honourPoints - 1
            data[indexOfPlayer].harmless = true
            data[indexOfCurrentPlayer()].honourPoints = data[indexOfCurrentPlayer()].honourPoints + 1

            if (data.filter(player => player.health > 0).length === 1) {
                setVictoryOfTheSwordMaster(true)
                setTimeout(() => {
                    setGameOver(true)
                }, 100);
            }

            if (data[indexOfPlayer].honourPoints <= 0) {
                if (currentPlayer?.role.team === 'Ninja' && data[indexOfPlayer].role.team === 'Ninja') {
                    setDeadlyStrikeNinja(true)
                }
                if (currentPlayer?.role.team === 'Shogun' && data[indexOfPlayer].role.team === 'Shogun') {
                    setDeadlyStrikeShogun(true)
                }
                setGameOver(true)
            }

            setDeath(true)
            setVictim(playersData[indexOfPlayer])
        } else {
            data[indexOfPlayer].health = data[indexOfPlayer].health - wounds
        }

        const newInfo = `${playersData[indexOfPlayer].name} took 1 wound`
        const newBattlecryInfo = [...battlecryInfo, newInfo]
        const battlecryArray = [...battlecryJujitsuArray]
        battlecryArray.pop()

        setBattlecryJujitsuArray(battlecryArray)
        setBattlecryInfo(newBattlecryInfo)
        setParryModule(false)
        setPlayersData(data)

        if (battlecryArray.length > 0) {
            setBattlecryJujitsuTurn(battlecryArray[battlecryArray.length - 1])
            socket.emit('battlecryPlayed', battlecryArray[battlecryArray.length - 1].socketID, battlecryArray)
        } else {
            setTurnBack()
        }

        setTimeout(() => {
            setTurn('')
        }, 250);


    }

    const handleJujitsuDiscard = (card: PlayableCard, index: number) => {
        setActiveCard(null)

        const newDiscardPile: PlayableCard[] = [...discardPile, card]
        const data = [...playersData]
        data[indexOfPlayer].hand.splice(index, 1)

        if (data[indexOfPlayer].hand.length === 0) {
            data[indexOfPlayer].harmless = true
        }

        setPlayersData(data)

        const newInfo = `${playersData[indexOfPlayer].name} discarded a Weapon`
        const newJujitsuInfo = [...jujitsuInfo, newInfo]
        const jujitsuArray = [...battlecryJujitsuArray]
        jujitsuArray.pop()

        setBattlecryJujitsuArray(jujitsuArray)
        setDiscardPile(newDiscardPile)
        setJujitsuInfo(newJujitsuInfo)

        setParryModule(false)

        if (jujitsuArray.length > 0) {
            setBattlecryJujitsuTurn(jujitsuArray[jujitsuArray.length - 1])
            socket.emit('jujitsuPlayed', jujitsuArray[jujitsuArray.length - 1].socketID, jujitsuArray)
        } else {
            setTurnBack()
        }

        setTimeout(() => {
            setTurn('')
        }, 200);


    }

    const handleJujitsuWound = () => {
        const data = [...playersData]

        if (data[indexOfPlayer].health - wounds === 0) {
            data[indexOfPlayer].health = 0
            data[indexOfPlayer].honourPoints = data[indexOfPlayer].honourPoints - 1
            data[indexOfPlayer].harmless = true
            data[indexOfCurrentPlayer()].honourPoints = data[indexOfCurrentPlayer()].honourPoints + 1

            if (data.filter(player => player.health > 0).length === 1) {
                setVictoryOfTheSwordMaster(true)
                setTimeout(() => {
                    setGameOver(true)
                }, 100);
            }

            if (data[indexOfPlayer].honourPoints <= 0) {
                if (currentPlayer?.role.team === 'Ninja' && data[indexOfPlayer].role.team === 'Ninja') {
                    setDeadlyStrikeNinja(true)
                }
                if (currentPlayer?.role.team === 'Shogun' && data[indexOfPlayer].role.team === 'Shogun') {
                    setDeadlyStrikeShogun(true)
                }
                setGameOver(true)
            }

            setDeath(true)
            setVictim(playersData[indexOfPlayer])

        } else {
            data[indexOfPlayer].health = data[indexOfPlayer].health - wounds
        }

        setPlayersData(data)

        const newInfo = `${playersData[indexOfPlayer].name} took 1 wound`
        const newJujitsuInfo = [...jujitsuInfo, newInfo]

        const jujitsuArray = [...battlecryJujitsuArray]
        jujitsuArray.pop()

        setBattlecryJujitsuArray(jujitsuArray)
        setJujitsuInfo(newJujitsuInfo)
        setJujitsuInEffect(false)
        setParryModule(false)

        if (jujitsuArray.length > 0) {
            setBattlecryJujitsuTurn(jujitsuArray[jujitsuArray.length - 1])
            socket.emit('jujitsuPlayed', jujitsuArray[jujitsuArray.length - 1].socketID, jujitsuArray)
        } else {
            setTurnBack()
        }

        setTimeout(() => {
            setTurn('')
        }, 250);


    }

    const handleBushidoDiscard = (card: PlayableCard, index: number) => {
        setParryModule(false)

        const newDiscardPile: PlayableCard[] = [...discardPile, card]
        const data = [...playersData]
        let newDrawDeck = [...drawDeck]
        const newCards: PlayableCard[] = []

        data[indexOfPlayer].hand.splice(index, 1)

        if (playersData[indexOfPlayer].character.name === 'Ieyasu' && discardPile.length > 0) {
            setIeyasuModule(true)
        } else {
            if (playersData[indexOfPlayer].character.name === 'Hideyoshi') {
                for (let i = 0; i < 3; i++) {
                    if (newDrawDeck.length === 0) {
                        setEmptyDrawDeck(true)
                        data.map(player => player.honourPoints = player.honourPoints - 1)
                        setDiscardPile([])
                        if (data.filter(player => player.honourPoints <= 0).length > 0) {
                            setGameOver(true)
                            break
                        }
                        newDrawDeck = shuffle(discardPile) as PlayableCard[]
                        newCards.push(newDrawDeck.pop() as PlayableCard)

                    } else {
                        newCards.push(newDrawDeck.pop() as PlayableCard);
                    }
                }
            } else {
                for (let i = 0; i < 2; i++) {
                    if (newDrawDeck.length === 0) {
                        setEmptyDrawDeck(true)
                        data.map(player => player.honourPoints = player.honourPoints - 1)
                        setDiscardPile([])
                        if (data.filter(player => player.honourPoints <= 0).length > 0) {
                            setGameOver(true)
                            break
                        }
                        newDrawDeck = shuffle(discardPile) as PlayableCard[]
                        newCards.push(newDrawDeck.pop() as PlayableCard)

                    } else {
                        newCards.push(newDrawDeck.pop() as PlayableCard);
                    }
                }
            }
        }

        data[indexOfPlayer].hand = [...data[indexOfPlayer].hand, ...newCards]

        data[indexOfPlayer].bushido = false

        if (!!playersData[indexOfPlayer + 1]) {
            data[indexOfPlayer + 1].bushido = true
        } else {
            data[0].bushido = true
        }

        const newInfo = `${playersData[indexOfPlayer].name} discarded a Weapon. Bushido is passed on`
        setBushidoWeapon(undefined)
        setDrawDeck(newDrawDeck)
        setBushidoInfo(newInfo)
        setDiscardPile(newDiscardPile)
        setPlayersData(data)
    }

    const handleLoseHonourPoint = () => {
        setParryModule(false)

        const newDiscardPile: PlayableCard[] = [...discardPile, {
            type: 'property',
            name: 'Bushido',
            img: bushido
        } as PlayableCard]
        const data = [...playersData]
        data[indexOfPlayer].bushido = false

        data[indexOfPlayer].honourPoints = data[indexOfPlayer].honourPoints - 1
        if (data[indexOfPlayer].honourPoints <= 0) {
            setGameOver(true)
        }

        let newInfo = `${playersData[indexOfPlayer].name} lost an Honour Point. Bushido is discarded`

        setBushidoWeapon(undefined)
        setDiscardPile(newDiscardPile)
        setBushidoInfo(newInfo)
        setPlayersData(data)


        if (playersData[indexOfPlayer].character.name === 'Ieyasu' && discardPile.length > 0) {
            setIeyasuModule(true)
        } else if (playersData[indexOfPlayer].character.name === 'Hideyoshi') {
            drawCards(3)
        } else {
            drawCards(2)
        }
    }

    const handleDiscardRandomCard = () => {
        setParryModule(false)

        const data = [...playersData]
        const cardTook = data[indexOfSelectedPlayer()].hand[randomCard(data[indexOfSelectedPlayer()].hand)]
        const indexOfCardTook = data[indexOfSelectedPlayer()].hand.indexOf(cardTook)
        data[indexOfSelectedPlayer()].hand.splice(indexOfCardTook, 1)

        if (data[indexOfSelectedPlayer()].hand.length === 0) {
            data[indexOfSelectedPlayer()].harmless = true
        }

        setSelectedPlayer(undefined)
        setWeaponCardPlayed(false)
        setActionCardPlayed(false)
        setPropertyCardPlayed(false)
        setPlayerHit(false)
        setParryPlayed(false)
        setGeishaInfo(undefined)
        setBushidoInfo(undefined)
        setBushidoWeapon(undefined)
        setDeath(false)
        setSelectedCard(undefined)
        setGeishaInfo(`${cardPlayedBy?.name} removed ${cardTook.name} from ${victim?.name}'s hand`)
        setDiscardPile([...discardPile, cardTook])
        setPlayersData(data)
    }

    const handleRemoveFocus = () => {
        setParryModule(false)

        const data = [...playersData]
        data[indexOfSelectedPlayer()].attacks = data[indexOfSelectedPlayer()].attacks - 1
        data[indexOfSelectedPlayer()].focus = data[indexOfSelectedPlayer()].focus - 1

        setDiscardPile([...discardPile, {
            type: 'property',
            name: 'Focus',
            img: focus
        } as PlayableCard])

        setSelectedPlayer(undefined)
        setWeaponCardPlayed(false)
        setActionCardPlayed(false)
        setPropertyCardPlayed(false)
        setPlayerHit(false)
        setParryPlayed(false)
        setGeishaInfo(undefined)
        setBushidoInfo(undefined)
        setBushidoWeapon(undefined)
        setDeath(false)
        setSelectedCard(undefined)
        setGeishaInfo(`${cardPlayedBy?.name} removed 1 Focus from ${victim?.name}`)
        setPlayersData(data)
    }

    const handleRemoveArmor = () => {
        setParryModule(false)

        const data = [...playersData]
        data[indexOfSelectedPlayer()].armor = data[indexOfSelectedPlayer()].armor - 1

        setDiscardPile([...discardPile, {
            type: 'property',
            name: 'Armor',
            img: armor
        } as PlayableCard])

        setSelectedPlayer(undefined)
        setWeaponCardPlayed(false)
        setActionCardPlayed(false)
        setPropertyCardPlayed(false)
        setPlayerHit(false)
        setParryPlayed(false)
        setGeishaInfo(undefined)
        setBushidoInfo(undefined)
        setBushidoWeapon(undefined)
        setDeath(false)
        setSelectedCard(undefined)
        setGeishaInfo(`${cardPlayedBy?.name} removed 1 Armor from ${victim?.name}`)
        setPlayersData(data)
    }

    const handleRemoveFastDraw = () => {
        setParryModule(false)

        const data = [...playersData]
        data[indexOfSelectedPlayer()].fastDraw = data[indexOfSelectedPlayer()].fastDraw - 1

        setDiscardPile([...discardPile, {
            type: 'property',
            name: 'Fast Draw',
            img: fast_draw
        } as PlayableCard])

        setSelectedPlayer(undefined)
        setWeaponCardPlayed(false)
        setActionCardPlayed(false)
        setPropertyCardPlayed(false)
        setPlayerHit(false)
        setParryPlayed(false)
        setGeishaInfo(undefined)
        setBushidoInfo(undefined)
        setBushidoWeapon(undefined)
        setDeath(false)
        setSelectedCard(undefined)
        setGeishaInfo(`${cardPlayedBy?.name} removed 1 Fast Draw from ${victim?.name}`)
        setPlayersData(data)
    }

    const handleRemoveBushido = () => {
        setParryModule(false)

        const data = [...playersData]
        data[indexOfSelectedPlayer()].bushido = false

        setDiscardPile([...discardPile, {
            type: 'property',
            name: 'Bushido',
            img: bushido
        } as PlayableCard])

        setSelectedPlayer(undefined)
        setWeaponCardPlayed(false)
        setActionCardPlayed(false)
        setPropertyCardPlayed(false)
        setPlayerHit(false)
        setParryPlayed(false)
        setGeishaInfo(undefined)
        setBushidoInfo(undefined)
        setBushidoWeapon(undefined)
        setDeath(false)
        setSelectedCard(undefined)
        setGeishaInfo(`${cardPlayedBy?.name} removed Bushido from ${victim?.name}`)
        setPlayersData(data)
    }

    useEffect(() => {
        if ((selectedCard?.type === 'weapon' || selectedCard?.name === "Divertion" || selectedCard?.name === "Breathing" || selectedCard?.name === "Geisha" || selectedCard?.name === "Bushido") && !discardCards && !bushidoWeapon && !jujitsuInEffect) {
            setSelectingPlayer(true)
        } else {
            setSelectingPlayer(false)
        }
    }, [selectedCard])

    useEffect(() => {
        const handleCardPlayer = () => {

            if (turn !== socket.id || !selectedCard || parryModule || ieyasuModule || discardCards) {
                return
            }

            if (emptyDrawDeck) {
                setEmptyDrawDeck(false)
            }

            const data = [...playersData]
            setCardPlayedBy(playersData[indexOfPlayer])

            if (!!selectedCard && selectedCard.type === 'weapon' && selectingPlayer && selectedPlayer) {
                if (playersData[indexOfSelectedPlayer()].harmless === true) {
                    setSelectedPlayer(undefined)
                    alert('Cannot attack harmless opponents')
                    return
                }

                const range = selectedCard.range

                const excludedHarmlessData = data.filter(player => player.harmless !== true)

                const playerIndex = excludedHarmlessData.findIndex(player => player.socketID === socket.id)
                const selectedPlayerIndex = excludedHarmlessData.findIndex(player => player.socketID === selectedPlayer)

                const difficulty = () => {
                    const difficulty1 = Math.abs((playerIndex) - (selectedPlayerIndex))
                    const difficulty2 = excludedHarmlessData.length - difficulty1
                    if (difficulty1 > difficulty2) {
                        if (playersData[indexOfSelectedPlayer()].character.name === 'Benkai') {
                            return difficulty2 + 1 + playersData[indexOfSelectedPlayer()].armor
                        } else {
                            return difficulty2 + playersData[indexOfSelectedPlayer()].armor
                        }
                    } else {
                        if (playersData[indexOfSelectedPlayer()].character.name === 'Benkai') {
                            return difficulty1 + 1 + playersData[indexOfSelectedPlayer()].armor
                        } else {
                            return difficulty1 + playersData[indexOfSelectedPlayer()].armor
                        }
                    }
                }

                if (attacksPlayed === playersData[indexOfPlayer].attacks) {
                    setSelectedPlayer(undefined)
                    alert('Max amount of weapon cards already played this turn')
                    return
                }
                if (range !== undefined && range < difficulty() && playersData[indexOfPlayer].character.name !== 'Kojiro') {
                    setSelectedPlayer(undefined)
                    alert('Cannot reach target')
                } else {

                    setAttacksPlayed(attacksPlayed + 1)
                    setWeaponCardPlayed(true)
                    setActionCardPlayed(false)
                    setPropertyCardPlayed(false)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setGeishaInfo(undefined)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    setDeath(false)

                    setDiscardPile([...discardPile, selectedCard])
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)
                    if (data[indexOfPlayer].hand.length === 0) {
                        data[indexOfPlayer].harmless = true
                    }

                    if (playersData[indexOfSelectedPlayer()].character.name === 'Ginchiyo' && playersData[indexOfPlayer].character.name !== 'Musashi' && (selectedCard.damage as number + playersData[indexOfPlayer].fastDraw) > 1) {
                        setWounds((selectedCard.damage as number + playersData[indexOfPlayer].fastDraw) - 1)
                    } else if (playersData[indexOfSelectedPlayer()].character.name === 'Ginchiyo' && playersData[indexOfPlayer].character.name === 'Musashi') {
                        setWounds(selectedCard.damage as number + playersData[indexOfPlayer].fastDraw)
                    } else if (playersData[indexOfPlayer].character.name === 'Musashi' && playersData[indexOfSelectedPlayer()].character.name !== 'Ginchiyo') {
                        setWounds(selectedCard.damage as number + 1 + playersData[indexOfPlayer].fastDraw)
                    } else {
                        setWounds(selectedCard.damage as number + playersData[indexOfPlayer].fastDraw)
                    }

                    setActiveCard(null)
                    setCardPlayed(selectedCard)
                    setVictim(playersData[indexOfSelectedPlayer()])
                    if (newTurn) {
                        setNewTurn(false)
                    }
                    setPlayersData(data)
                    socket.emit('attacked', selectedPlayer, room)
                    setSelectedCard(undefined)
                    setSelectingPlayer(false)
                    setSelectedPlayer(undefined)

                }
            }

            if (!!selectedCard && selectedCard.type === 'action') {

                if (selectedCard.name === 'Daimyo') {
                    let newDiscardPile = [...discardPile, selectedCard]
                    let newDrawDeck = [...drawDeck]

                    const newCards: PlayableCard[] = [];
                    for (let i = 0; i < 2; i++) {
                        if (newDrawDeck.length === 0) {
                            setEmptyDrawDeck(true)
                            newDrawDeck = shuffle(newDiscardPile) as PlayableCard[]
                            newCards.push(newDrawDeck.pop() as PlayableCard)
                            data.map(player => player.honourPoints = player.honourPoints - 1)
                            newDiscardPile = []
                            if (data.filter(player => player.honourPoints <= 0).length > 0) {
                                setGameOver(true)
                                console.log('10')
                                break
                            }
                        } else {
                            newCards.push(newDrawDeck.pop() as PlayableCard);
                        }
                    }
                    data[indexOfPlayer].hand = [...data[indexOfPlayer].hand.filter(card => card !== selectedCard), ...newCards]

                    setActiveCard(null)
                    setCardPlayed(selectedCard)
                    setWeaponCardPlayed(false)
                    setActionCardPlayed(true)
                    setPropertyCardPlayed(false)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setGeishaInfo(undefined)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    setDeath(false)
                    setDiscardPile(newDiscardPile)
                    setDrawDeck(newDrawDeck)
                    setSelectedCard(undefined)
                    if (newTurn) {
                        setNewTurn(false)
                    }
                    setPlayersData(data)
                }

                if (selectedCard.name === 'Divertion' && selectingPlayer && selectedPlayer) {
                    if (playersData[indexOfSelectedPlayer()].hand.length === 0) {
                        setSelectedPlayer(undefined)
                        alert('Selected Player has no cards')
                        return
                    }

                    setDiscardPile([...discardPile, selectedCard])
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)
                    if (data[indexOfPlayer].hand.length === 0) {
                        data[indexOfPlayer].harmless = true
                    }


                    const cardTook = data[indexOfSelectedPlayer()].hand[randomCard(data[indexOfSelectedPlayer()].hand)]
                    const indexOfCardTook = data[indexOfSelectedPlayer()].hand.indexOf(cardTook)
                    data[indexOfSelectedPlayer()].hand.splice(indexOfCardTook, 1)

                    if (data[indexOfSelectedPlayer()].hand.length === 0) {
                        data[indexOfSelectedPlayer()].harmless = true
                    }

                    data[indexOfPlayer].hand = [...data[indexOfPlayer].hand.filter(card => card !== selectedCard), cardTook]

                    setActiveCard(null)
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
                    setDeath(false)

                    setSelectingPlayer(false)
                    setSelectedPlayer(undefined)
                    setSelectedCard(undefined)
                    if (newTurn) {
                        setNewTurn(false)
                    }
                    setPlayersData(data)

                }

                if (selectedCard.name === 'Breathing' && selectingPlayer && selectedPlayer) {
                    setDiscardPile([...discardPile, selectedCard])
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)
                    if (data[indexOfPlayer].hand.length === 0) {
                        data[indexOfPlayer].harmless = true
                    }
                    data[indexOfPlayer].health = data[indexOfPlayer].character.health
                    const newDrawDeck = [...drawDeck]
                    const newCard = newDrawDeck.pop()
                    data[indexOfSelectedPlayer()].hand.push(newCard as PlayableCard)

                    if (data[indexOfSelectedPlayer()].harmless === true) {
                        data[indexOfSelectedPlayer()].harmless = false
                    }

                    setActiveCard(null)
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
                    setDeath(false)
                    setSelectingPlayer(false)
                    setSelectedPlayer(undefined)
                    setSelectedCard(undefined)
                    setDrawDeck(newDrawDeck)
                    if (newTurn) {
                        setNewTurn(false)
                    }
                    setPlayersData(data)

                }

                if (selectedCard.name === 'Tea Ceremony') {
                    let newDiscardPile = [...discardPile, selectedCard]
                    let gameOver = false

                    const newCards: PlayableCard[] = [];
                    let newDrawDeck = [...drawDeck]
                    for (let i = 0; i < 3; i++) {
                        if (newDrawDeck.length === 0) {
                            setEmptyDrawDeck(true)
                            data.map(player => player.honourPoints = player.honourPoints - 1)
                            if (data.filter(player => player.honourPoints <= 0).length > 0) {
                                gameOver = true
                                break
                            }
                            newDrawDeck = shuffle(newDiscardPile) as PlayableCard[]
                            newCards.push(newDrawDeck.pop() as PlayableCard)
                            newDiscardPile = []

                        } else {
                            newCards.push(newDrawDeck.pop() as PlayableCard);
                        }
                    }

                    data[indexOfPlayer].hand = [...data[indexOfPlayer].hand.filter(card => card !== selectedCard), ...newCards]


                    for (let i = 0; i < data.length; i++) {
                        if (i !== indexOfPlayer && !gameOver) {
                            if (newDrawDeck.length === 0) {
                                setEmptyDrawDeck(true)
                                data.map(player => player.honourPoints = player.honourPoints - 1)
                                if (data.filter(player => player.honourPoints <= 0).length > 0) {
                                    gameOver = true
                                    break
                                }
                                newDrawDeck = shuffle(newDiscardPile) as PlayableCard[]
                                data[i].hand.push(newDrawDeck.pop() as PlayableCard)
                                if (data[i].harmless === true && data[i].health !== 0) {
                                    data[i].harmless = false
                                }
                                newDiscardPile = []
                            } else {
                                data[i].hand.push(newDrawDeck.pop() as PlayableCard)
                                if (data[i].harmless === true && data[i].health !== 0) {
                                    data[i].harmless = false
                                }
                            }
                        }
                    }

                    setGameOver(gameOver)
                    setActiveCard(null)
                    setCardPlayed(selectedCard)
                    setWeaponCardPlayed(false)
                    setActionCardPlayed(true)
                    setPropertyCardPlayed(false)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setGeishaInfo(undefined)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    setDeath(false)
                    setDiscardPile(newDiscardPile)
                    setDrawDeck(newDrawDeck)
                    setSelectedCard(undefined)
                    if (newTurn) {
                        setNewTurn(false)
                    }
                    setPlayersData(data)
                }

                if (selectedCard.name === 'Battlecry') {
                    if (newTurn) {
                        setNewTurn(false)
                    }

                    const battlecryJujitsuArray = data.filter(player => player.harmless !== true && player.character.name !== 'Chiyome' && player.character.name !== playersData[indexOfPlayer].character.name).reverse()

                    setBattlecryJujitsuArray(battlecryJujitsuArray)
                    setBattlecryJujitsuTurn(battlecryJujitsuArray[battlecryJujitsuArray.length - 1])

                    setDiscardPile([...discardPile, selectedCard])
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)
                    if (data[indexOfPlayer].hand.length === 0) {
                        data[indexOfPlayer].harmless = true
                    }

                    setActiveCard(null)
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
                    setDeath(false)

                    setSelectedCard(undefined)
                    setBattlecryInfo([])
                    setJujitsuInfo([])

                    setPlayersData(data)


                    if (battlecryJujitsuArray.length > 0) {
                        setTimeout(() => {
                            setTurn('')
                        }, 250);

                        socket.emit('battlecryPlayed', battlecryJujitsuArray[battlecryJujitsuArray.length - 1].socketID, battlecryJujitsuArray)
                    }

                }


                if (selectedCard.name === 'Jujitsu') {
                    if (newTurn) {
                        setNewTurn(false)
                    }

                    const battlecryJujitsuArray = data.filter(player => player.harmless !== true && player.character.name !== 'Chiyome' && player.character.name !== playersData[indexOfPlayer].character.name).reverse()

                    setBattlecryJujitsuArray(battlecryJujitsuArray)
                    setBattlecryJujitsuTurn(battlecryJujitsuArray[battlecryJujitsuArray.length - 1])

                    setDiscardPile([...discardPile, selectedCard])
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)
                    if (data[indexOfPlayer].hand.length === 0) {
                        data[indexOfPlayer].harmless = true
                    }

                    setActiveCard(null)
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
                    setDeath(false)

                    setSelectedCard(undefined)
                    setBattlecryInfo([])
                    setJujitsuInfo([])

                    setPlayersData(data)

                    if (battlecryJujitsuArray.length > 0) {
                        setTimeout(() => {
                            setTurn('')
                        }, 250);

                        socket.emit('jujitsuPlayed', battlecryJujitsuArray[battlecryJujitsuArray.length - 1].socketID, battlecryJujitsuArray)
                    }

                }

                if (selectedCard.name === 'Geisha' && selectingPlayer && selectedPlayer) {
                    setGeishaInfo(undefined)
                    setVictim(playersData[indexOfSelectedPlayer()])

                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)
                    if (data[indexOfPlayer].hand.length === 0) {
                        data[indexOfPlayer].harmless = true
                    }
                    setDiscardPile([...discardPile, selectedCard])
                    setActiveCard(null)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    setCardPlayed(selectedCard)
                    setSelectingPlayer(false)
                    setSelectedCard(undefined)
                    setPropertyCardPlayed(false)
                    if (newTurn) {
                        setNewTurn(false)
                    }
                    setPlayersData(data)
                    updateGameState()
                    setTimeout(() => {
                        setParryModule(true)
                    }, 100);

                }
            }

            if (!!selectedCard && selectedCard.type === 'property') {

                if (selectedCard.name === 'Focus') {
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)
                    if (data[indexOfPlayer].hand.length === 0) {
                        data[indexOfPlayer].harmless = true
                    }
                    data[indexOfPlayer].focus = data[indexOfPlayer].focus + 1
                    data[indexOfPlayer].attacks = data[indexOfPlayer].attacks + 1

                    setActiveCard(null)
                    setCardPlayed(selectedCard)
                    setWeaponCardPlayed(false)
                    setActionCardPlayed(false)
                    setPropertyCardPlayed(true)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setGeishaInfo(undefined)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    setDeath(false)

                    setSelectedCard(undefined)
                    if (newTurn) {
                        setNewTurn(false)
                    }
                    setPlayersData(data)
                }

                if (selectedCard.name === 'Armor') {
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)
                    if (data[indexOfPlayer].hand.length === 0) {
                        data[indexOfPlayer].harmless = true
                    }
                    data[indexOfPlayer].armor = data[indexOfPlayer].armor + 1

                    setActiveCard(null)
                    setCardPlayed(selectedCard)
                    setWeaponCardPlayed(false)
                    setActionCardPlayed(false)
                    setPropertyCardPlayed(true)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setGeishaInfo(undefined)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    setDeath(false)

                    setSelectedCard(undefined)
                    if (newTurn) {
                        setNewTurn(false)
                    }
                    setPlayersData(data)
                }

                if (selectedCard.name === 'Fast Draw') {
                    data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)
                    if (data[indexOfPlayer].hand.length === 0) {
                        data[indexOfPlayer].harmless = true
                    }
                    data[indexOfPlayer].fastDraw = data[indexOfPlayer].fastDraw + 1

                    setActiveCard(null)
                    setCardPlayed(selectedCard)
                    setWeaponCardPlayed(false)
                    setActionCardPlayed(false)
                    setPropertyCardPlayed(true)
                    setPlayerHit(false)
                    setParryPlayed(false)
                    setGeishaInfo(undefined)
                    setBushidoInfo(undefined)
                    setBushidoWeapon(undefined)
                    setDeath(false)
                    setSelectedCard(undefined)
                    if (newTurn) {
                        setNewTurn(false)
                    }
                    setPlayersData(data)
                }

                if (selectedCard.name === 'Bushido' && selectingPlayer && selectedPlayer) {
                    if (playersData.findIndex(player => player.bushido === true) !== -1) {
                        setSelectedPlayer(undefined)
                        alert('Only 1 Bushido can be in play at a time')
                        return
                    } else {
                        data[indexOfPlayer].hand.splice(indexOfSelectedCard(), 1)
                        if (data[indexOfPlayer].hand.length === 0) {
                            data[indexOfPlayer].harmless = true
                        }
                        data[indexOfSelectedPlayer()].bushido = true
                        setActiveCard(null)
                        setCardPlayed(selectedCard)
                        setVictim(playersData[indexOfSelectedPlayer()])
                        setWeaponCardPlayed(false)
                        setActionCardPlayed(false)
                        setPropertyCardPlayed(true)
                        setPlayerHit(false)
                        setParryPlayed(false)
                        setGeishaInfo(undefined)
                        setBushidoInfo(undefined)
                        setSelectedCard(undefined)
                        setSelectingPlayer(false)
                        setSelectedPlayer(undefined)
                        if (newTurn) {
                            setNewTurn(false)
                        }
                        setPlayersData(data)
                    }
                }
            }
        }

        handleCardPlayer()
    }, [selectedCard, selectedPlayer])


    const endTurn = () => {

        setSelectingPlayer(false)
        setSelectedCard(undefined)
        setSelectedPlayer(undefined)
        setActiveCard(null)

        if (playersData[indexOfPlayer].hand.length > 7) {
            setDiscardCards(true)
            setParryModule(true)
            return
        }

        if (!!playersData[indexOfPlayer + 1]) {
            const newTurn = playersData[indexOfPlayer + 1]
            setTurn('')
            socket.emit('newTurn', newTurn, room)
        } else {
            const newTurn = playersData[0]
            setTurn('')
            socket.emit('newTurn', newTurn, room)
        }

        setAttacksPlayed(0)

    }

    useEffect(() => {
        if (gameOver) {
            const ninjaTeam = playersData.filter(player => player.role.team === 'Ninja')
            const shogunTeam = playersData.filter(player => player.role.team === 'Shogun')
            const roninTeam = playersData.filter(player => player.role.team === 'Ronin')

            const ninjaPoints = () => {
                let points = 0
                let daimyoPoints = 0

                for (let i = 0; i < ninjaTeam.length; i++) {
                    daimyoPoints = daimyoPoints + ninjaTeam[i].hand.filter(card => card.name === "Daimyo").length
                    points = points + ninjaTeam[i].honourPoints
                }

                if (deadlyStrikeNinja) {
                    points = points - 3
                }

                return points + daimyoPoints
            }

            const shogunPoints = () => {
                let points = 0
                let daimyoPoints = 0

                for (let i = 0; i < shogunTeam.length; i++) {
                    daimyoPoints = daimyoPoints + shogunTeam[i].hand.filter(card => card.name === "Daimyo").length
                    points = points + shogunTeam[i].honourPoints
                }

                if (deadlyStrikeShogun) {
                    points = points - 3
                }

                return points + daimyoPoints
            }

            const roninPoints = () => {
                let points = 0

                for (let i = 0; i < roninTeam.length; i++) {
                    points = points + shogunTeam[i].honourPoints
                }

                return points * 2
            }

            if (ninjaPoints() >= shogunPoints() && ninjaPoints() >= roninPoints()) {
                setWinner('Team Ninja')
            } else if (shogunPoints() > ninjaPoints() && shogunPoints() >= roninPoints()) {
                setWinner('Team Shogun')
            } else {
                setWinner('Team Ronin')
            }
            setTeamNinjaInfo(ninjaPoints())
            setTeamShogunInfo(shogunPoints())
            setTeamRoninInfo(roninPoints())
        }
    }, [gameOver])


    return (
        <>
            <AnnouncementModule
                newTurn={newTurn}
                emptyDrawDeck={emptyDrawDeck}
                currentPlayer={currentPlayer}
                cardPlayedBy={cardPlayedBy}
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
                death={death}
                battlecryJujitsuArray={battlecryJujitsuArray}
                battlecryJujitsuTurn={battlecryJujitsuTurn}
            />

            <PlayerSelectionModule
                selectingPlayer={selectingPlayer}
                selectedCard={selectedCard}
            />

            {parryModule && playersData.length > 0 && <ParryModule
                indexOfPlayer={indexOfPlayer}
                playersData={playersData}
                currentPlayer={currentPlayer}
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
                discardCards={discardCards}
            />}

            {ieyasuModule && <IeyasuModule
                drawCardFromDiscard={drawCardFromDiscard}
                drawCards={drawCards}
                playersData={playersData}
                currentPlayer={currentPlayer}
            />}

            {gameOver && <GameOverModule
                winner={winner}
                teamNinjaInfo={teamNinjaInfo}
                teamShogunInfo={teamShogunInfo}
                teamRoninInfo={teamRoninInfo}
                deadlyStrikeNinja={deadlyStrikeNinja}
                deadlyStrikeShogun={deadlyStrikeShogun}
                victoryOfTheSwordMaster={victoryOfTheSwordMaster}
                currentPlayer={currentPlayer}
            />}

            {playersData.length > 0 && playersData[0].socketID === socket.id &&
                <>
                    <div className="five-player-game__flex-container--top">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[2].name}</h1>
                            {playersData[2].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[2].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[2].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[2].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[2].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[2].character.img} className='game__player-character card ' />
                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[2].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[2].honourPoints}</p>
                                        </div>
                                    </div>
                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[2].hand.length} </p>
                                    </div>
                                </div>
                                <div className="game__icon-parent-container">
                                    {playersData[2].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[2].focus}</p>
                                        </div>
                                    }
                                    {playersData[2].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[2].armor}</p>
                                        </div>
                                    }
                                    {playersData[2].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[2].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[2].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[3].name}</h1>
                            {playersData[3].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[3].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[3].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[3].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[3].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[3].character.img} className='game__player-character card ' />
                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[3].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[3].honourPoints}</p>
                                        </div>
                                    </div>
                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[3].hand.length} </p>
                                    </div>
                                </div>
                                <div className="game__icon-parent-container">
                                    {playersData[3].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[3].focus}</p>
                                        </div>
                                    }
                                    {playersData[3].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[3].armor}</p>
                                        </div>
                                    }
                                    {playersData[3].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[3].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[3].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="five-player-game__flex-container">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[1].name}</h1>
                            {playersData[1].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[1].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[1].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[1].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[1].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[1].character.img} className='game__player-character card ' />

                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[1].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[1].honourPoints}</p>
                                        </div>
                                    </div>

                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[1].hand.length} </p>
                                    </div>
                                </div>

                                <div className="game__icon-parent-container">
                                    {playersData[1].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[1].focus}</p>
                                        </div>
                                    }
                                    {playersData[1].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[1].armor}</p>
                                        </div>
                                    }
                                    {playersData[1].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[1].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[1].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[4].name}</h1>
                            {playersData[4].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[4].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[4].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[4].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[4].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[4].character.img} className='game__player-character card ' />

                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[4].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[4].honourPoints}</p>
                                        </div>
                                    </div>

                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[4].hand.length} </p>
                                    </div>
                                </div>

                                <div className="game__icon-parent-container">
                                    {playersData[4].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[4].focus}</p>
                                        </div>
                                    }
                                    {playersData[4].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[4].armor}</p>
                                        </div>
                                    }
                                    {playersData[4].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[4].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[4].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>

                        </div>

                    </div>


                    <div className='game__middle-container'>
                        <div className='game__deck-container'>
                            <img src={cardBack} className='game__deck' />
                            <p className='game__deck-text'>x {drawDeck.length}</p>
                        </div>
                        {discardPile.length > 0 &&
                            <div className='game__deck-container'>
                                <img src={discardPile[discardPile.length - 1].img} className='game__deck game__deck--hover' />
                                <p>x {discardPile.length}</p>
                            </div>
                        }
                    </div>


                    <div className='game__user-container'>
                        <div className="game__user-flex-container">
                            <div className='game__icon-container'>
                                <img src={heart} className='game__icon' />
                                <p className='game__icon-text'>x {playersData[0].health}</p>
                            </div>
                            <div className='game__icon-container'>
                                <img src={cherry_blossum} className='game__icon' />
                                <p className='game__icon-text'>x {playersData[0].honourPoints}</p>
                            </div>
                            <div className='game__icon-container '>
                                <img src={cardBack} className='game__icon--card game__icon' />
                                <p className='game__icon-text'>x {playersData[0].hand.length} </p>
                            </div>
                        </div>
                        <div className='game__user-character-container' id={socket.id}>
                            {playersData[0].harmless &&
                                <h2 className='game__user--heading'>HARMLESS</h2>
                            }

                            {currentPlayer?.socketID === playersData[0].socketID &&
                                <div className='game__user-turn-indicator'></div>
                            }

                            <div className="game__user-role-container">
                                <img src={playersData[0].role.img} className='game__user-role card' />
                            </div>

                            <div className="game__user-character-container">
                                <img src={playersData[0].character.img} className='game__user-character card' />
                            </div>


                        </div>


                        <div className="game__user-property-container">
                            {playersData[0].focus > 0 &&
                                <div className='game__icon-container'>
                                    <img src={focus} className='game__user-property card' />
                                    <p className='game__icon-text'>x {playersData[0].focus}</p>
                                </div>
                            }
                            {playersData[0].armor > 0 &&
                                <div className='game__icon-container'>
                                    <img src={armor} className='game__user-property card' />
                                    <p className='game__icon-text'>x {playersData[0].armor}</p>
                                </div >
                            }
                            {playersData[0].fastDraw > 0 &&
                                <div className='game__icon-container'>
                                    <img src={fast_draw} className='game__user-property card' />
                                    <p className='game__icon-text'>x {playersData[0].fastDraw}</p>
                                </div>
                            }
                            {playersData[0].bushido &&
                                <img src={bushido} className='game__user-property card' />
                            }
                        </div>

                        <div className='game__user-hand'>
                            {playersData[0].hand.length > 0 && playersData[0].hand.map((card: PlayableCard, index) => {
                                return <img src={card.img} key={index} onClick={() => {
                                    handleSelectedCard(card, index)
                                    handleActiveCard(index)
                                }} className={`game__user-card ${index === activeCard ? 'game__user-card--active' : ''} card`} />
                            })}
                        </div>
                    </div>
                </>
            }

            {playersData.length > 0 && socket.id === playersData[1].socketID &&
                <>
                    <div className="five-player-game__flex-container--top">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[3].name}</h1>
                            {playersData[3].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[3].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[3].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[3].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[3].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[3].character.img} className='game__player-character card ' />
                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[3].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[3].honourPoints}</p>
                                        </div>
                                    </div>
                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[3].hand.length} </p>
                                    </div>
                                </div>
                                <div className="game__icon-parent-container">
                                    {playersData[3].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[3].focus}</p>
                                        </div>
                                    }
                                    {playersData[3].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[3].armor}</p>
                                        </div>
                                    }
                                    {playersData[3].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[3].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[3].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[4].name}</h1>
                            {playersData[4].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[4].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[4].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[4].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[4].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[4].character.img} className='game__player-character card ' />
                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[4].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[4].honourPoints}</p>
                                        </div>
                                    </div>
                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[4].hand.length} </p>
                                    </div>
                                </div>
                                <div className="game__icon-parent-container">
                                    {playersData[4].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[4].focus}</p>
                                        </div>
                                    }
                                    {playersData[4].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[4].armor}</p>
                                        </div>
                                    }
                                    {playersData[4].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[4].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[4].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="five-player-game__flex-container">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[2].name}</h1>
                            {playersData[2].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[2].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[2].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[2].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[2].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[2].character.img} className='game__player-character card ' />

                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[2].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[2].honourPoints}</p>
                                        </div>
                                    </div>

                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[2].hand.length} </p>
                                    </div>
                                </div>

                                <div className="game__icon-parent-container">
                                    {playersData[2].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[2].focus}</p>
                                        </div>
                                    }
                                    {playersData[2].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[2].armor}</p>
                                        </div>
                                    }
                                    {playersData[2].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[2].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[2].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>

                        </div>

                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[0].name}</h1>
                            {playersData[0].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[0].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[0].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[0].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[0].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[0].character.img} className='game__player-character card ' />

                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[0].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[0].honourPoints}</p>
                                        </div>
                                    </div>
                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[0].hand.length} </p>
                                    </div>
                                </div>

                                <div className="game__icon-parent-container">
                                    {playersData[0].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[0].focus}</p>
                                        </div>
                                    }
                                    {playersData[0].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[0].armor}</p>
                                        </div>
                                    }
                                    {playersData[0].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[0].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[0].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>

                        </div>

                    </div>


                    <div className='game__middle-container'>
                        <div className='game__deck-container'>
                            <img src={cardBack} className='game__deck' />
                            <p className='game__deck-text'>x {drawDeck.length}</p>
                        </div>
                        {discardPile.length > 0 &&
                            <div className='game__deck-container'>
                                <img src={discardPile[discardPile.length - 1].img} className='game__deck game__deck--hover' />
                                <p>x {discardPile.length}</p>
                            </div>
                        }
                    </div>


                    <div className='game__user-container'>

                        <div className="game__user-flex-container">

                            <div className='game__icon-container'>
                                <img src={heart} className='game__icon' />
                                <p className='game__icon-text'>x {playersData[1].health}</p>
                            </div>
                            <div className='game__icon-container'>
                                <img src={cherry_blossum} className='game__icon' />
                                <p className='game__icon-text'>x {playersData[1].honourPoints}</p>
                            </div>
                            <div className='game__icon-container '>
                                <img src={cardBack} className='game__icon--card game__icon' />
                                <p className='game__icon-text'>x {playersData[1].hand.length} </p>
                            </div>
                        </div>
                        <div className='game__user-character-container' id={socket.id}>
                            {playersData[1].harmless &&
                                <h2 className='game__user--heading'>HARMLESS</h2>
                            }

                            {currentPlayer?.socketID === playersData[1].socketID &&
                                <div className='game__user-turn-indicator'></div>
                            }

                            <div className="game__user-role-container">
                                <img src={playersData[1].role.img} className='game__user-role card' />
                            </div>

                            <div className="game__user-character-container">
                                <img src={playersData[1].character.img} className='game__user-character card' />
                            </div>


                        </div>


                        <div className="game__user-property-container">
                            {playersData[1].focus > 0 &&
                                <div className='game__icon-container'>
                                    <img src={focus} className='game__user-property card' />
                                    <p className='game__icon-text'>x {playersData[1].focus}</p>
                                </div>
                            }
                            {playersData[1].armor > 0 &&
                                <div className='game__icon-container'>
                                    <img src={armor} className='game__user-property card' />
                                    <p className='game__icon-text'>x {playersData[1].armor}</p>
                                </div >
                            }
                            {playersData[1].fastDraw > 0 &&
                                <div className='game__icon-container'>
                                    <img src={fast_draw} className='game__user-property card' />
                                    <p className='game__icon-text'>x {playersData[1].fastDraw}</p>
                                </div>
                            }
                            {playersData[1].bushido &&
                                <img src={bushido} className='game__user-property card' />
                            }
                        </div>

                        <div className='game__user-hand'>
                            {playersData[1].hand.length > 0 && playersData[1].hand.map((card: PlayableCard, index) => {
                                return <img src={card.img} key={index} onClick={() => {
                                    handleSelectedCard(card, index)
                                    handleActiveCard(index)
                                }} className={`game__user-card ${index === activeCard ? 'game__user-card--active' : ''} card`} />
                            })}
                        </div>
                    </div>
                </>
            }

            {playersData.length > 0 && socket.id === playersData[2].socketID &&
                <>
                    <div className="five-player-game__flex-container--top">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[4].name}</h1>
                            {playersData[4].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[4].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[4].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[4].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[4].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[4].character.img} className='game__player-character card ' />
                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[4].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[4].honourPoints}</p>
                                        </div>
                                    </div>
                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[4].hand.length} </p>
                                    </div>
                                </div>
                                <div className="game__icon-parent-container">
                                    {playersData[4].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[4].focus}</p>
                                        </div>
                                    }
                                    {playersData[4].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[4].armor}</p>
                                        </div>
                                    }
                                    {playersData[4].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[4].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[4].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[0].name}</h1>
                            {playersData[0].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[0].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[0].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[0].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[0].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[0].character.img} className='game__player-character card ' />
                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[0].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[0].honourPoints}</p>
                                        </div>
                                    </div>
                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[0].hand.length} </p>
                                    </div>
                                </div>
                                <div className="game__icon-parent-container">
                                    {playersData[0].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[0].focus}</p>
                                        </div>
                                    }
                                    {playersData[0].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[0].armor}</p>
                                        </div>
                                    }
                                    {playersData[0].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[0].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[0].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="five-player-game__flex-container">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[3].name}</h1>
                            {playersData[3].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[3].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[3].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[3].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[3].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[3].character.img} className='game__player-character card ' />

                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[3].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[3].honourPoints}</p>
                                        </div>
                                    </div>

                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[3].hand.length} </p>
                                    </div>
                                </div>

                                <div className="game__icon-parent-container">
                                    {playersData[3].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[3].focus}</p>
                                        </div>
                                    }
                                    {playersData[3].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[3].armor}</p>
                                        </div>
                                    }
                                    {playersData[3].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[3].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[3].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>

                        </div>

                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[1].name}</h1>
                            {playersData[1].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[1].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[1].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[1].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[1].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[1].character.img} className='game__player-character card ' />

                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[1].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[1].honourPoints}</p>
                                        </div>
                                    </div>

                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[1].hand.length} </p>
                                    </div>
                                </div>

                                <div className="game__icon-parent-container">
                                    {playersData[1].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[1].focus}</p>
                                        </div>
                                    }
                                    {playersData[1].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[1].armor}</p>
                                        </div>
                                    }
                                    {playersData[1].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[1].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[1].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>

                        </div>

                    </div>


                    <div className='game__middle-container'>
                        <div className='game__deck-container'>
                            <img src={cardBack} className='game__deck' />
                            <p className='game__deck-text'>x {drawDeck.length}</p>
                        </div>
                        {discardPile.length > 0 &&
                            <div className='game__deck-container'>
                                <img src={discardPile[discardPile.length - 1].img} className='game__deck game__deck--hover' />
                                <p>x {discardPile.length}</p>
                            </div>
                        }
                    </div>


                    <div className='game__user-container'>
                        <div className="game__user-flex-container">
                            <div className='game__icon-container'>
                                <img src={heart} className='game__icon' />
                                <p className='game__icon-text'>x {playersData[2].health}</p>
                            </div>
                            <div className='game__icon-container'>
                                <img src={cherry_blossum} className='game__icon' />
                                <p className='game__icon-text'>x {playersData[2].honourPoints}</p>
                            </div>
                            <div className='game__icon-container '>
                                <img src={cardBack} className='game__icon--card game__icon' />
                                <p className='game__icon-text'>x {playersData[2].hand.length} </p>
                            </div>
                        </div>
                        <div className='game__user-character-container' id={socket.id}>
                            {playersData[2].harmless &&
                                <h2 className='game__user--heading'>HARMLESS</h2>
                            }

                            {currentPlayer?.socketID === playersData[2].socketID &&
                                <div className='game__user-turn-indicator'></div>
                            }

                            <div className="game__user-role-container">
                                <img src={playersData[2].role.img} className='game__user-role card' />
                            </div>

                            <div className="game__user-character-container">
                                <img src={playersData[2].character.img} className='game__user-character card' />
                            </div>

                        </div>


                        <div className="game__user-property-container">
                            {playersData[2].focus > 0 &&
                                <div className='game__icon-container'>
                                    <img src={focus} className='game__user-property card' />
                                    <p className='game__icon-text'>x {playersData[2].focus}</p>
                                </div>
                            }
                            {playersData[2].armor > 0 &&
                                <div className='game__icon-container'>
                                    <img src={armor} className='game__user-property card' />
                                    <p className='game__icon-text'>x {playersData[2].armor}</p>
                                </div >
                            }
                            {playersData[2].fastDraw > 0 &&
                                <div className='game__icon-container'>
                                    <img src={fast_draw} className='game__user-property card' />
                                    <p className='game__icon-text'>x {playersData[2].fastDraw}</p>
                                </div>
                            }
                            {playersData[2].bushido &&
                                <img src={bushido} className='game__user-property card' />
                            }
                        </div>

                        <div className='game__user-hand'>
                            {playersData[2].hand.length > 0 && playersData[2].hand.map((card: PlayableCard, index) => {
                                return <img src={card.img} key={index} onClick={() => {
                                    handleSelectedCard(card, index)
                                    handleActiveCard(index)
                                }} className={`game__user-card ${index === activeCard ? 'game__user-card--active' : ''} card`} />
                            })}
                        </div>
                    </div>
                </>
            }


            {playersData.length > 0 && socket.id === playersData[3].socketID &&
                <>
                    <div className="five-player-game__flex-container--top">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[0].name}</h1>
                            {playersData[0].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[0].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[0].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[0].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[0].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[0].character.img} className='game__player-character card ' />
                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[0].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[0].honourPoints}</p>
                                        </div>
                                    </div>
                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[0].hand.length} </p>
                                    </div>
                                </div>
                                <div className="game__icon-parent-container">
                                    {playersData[0].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[0].focus}</p>
                                        </div>
                                    }
                                    {playersData[0].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[0].armor}</p>
                                        </div>
                                    }
                                    {playersData[0].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[0].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[0].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[1].name}</h1>
                            {playersData[1].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[1].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[1].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[1].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[1].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[1].character.img} className='game__player-character card ' />
                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[1].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[1].honourPoints}</p>
                                        </div>
                                    </div>
                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[1].hand.length} </p>
                                    </div>
                                </div>
                                <div className="game__icon-parent-container">
                                    {playersData[1].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[1].focus}</p>
                                        </div>
                                    }
                                    {playersData[1].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[1].armor}</p>
                                        </div>
                                    }
                                    {playersData[1].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[1].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[1].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="five-player-game__flex-container">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[4].name}</h1>
                            {playersData[4].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[4].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[4].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[4].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[4].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[4].character.img} className='game__player-character card ' />

                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[4].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[4].honourPoints}</p>
                                        </div>
                                    </div>

                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[4].hand.length} </p>
                                    </div>
                                </div>

                                <div className="game__icon-parent-container">
                                    {playersData[4].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[4].focus}</p>
                                        </div>
                                    }
                                    {playersData[4].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[4].armor}</p>
                                        </div>
                                    }
                                    {playersData[4].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[4].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[4].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>

                        </div>

                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[2].name}</h1>
                            {playersData[2].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[2].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[2].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[2].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[2].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[2].character.img} className='game__player-character card ' />

                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[2].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[2].honourPoints}</p>
                                        </div>
                                    </div>

                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[2].hand.length} </p>
                                    </div>
                                </div>

                                <div className="game__icon-parent-container">
                                    {playersData[2].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[2].focus}</p>
                                        </div>
                                    }
                                    {playersData[2].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[2].armor}</p>
                                        </div>
                                    }
                                    {playersData[2].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[2].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[2].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>

                        </div>

                    </div>


                    <div className='game__middle-container'>
                        <div className='game__deck-container'>
                            <img src={cardBack} className='game__deck' />
                            <p className='game__deck-text'>x {drawDeck.length}</p>
                        </div>
                        {discardPile.length > 0 &&
                            <div className='game__deck-container'>
                                <img src={discardPile[discardPile.length - 1].img} className='game__deck game__deck--hover' />
                                <p>x {discardPile.length}</p>
                            </div>
                        }
                    </div>


                    <div className='game__user-container'>
                        <div className="game__user-flex-container">
                            <div className='game__icon-container'>
                                <img src={heart} className='game__icon' />
                                <p className='game__icon-text'>x {playersData[3].health}</p>
                            </div>
                            <div className='game__icon-container'>
                                <img src={cherry_blossum} className='game__icon' />
                                <p className='game__icon-text'>x {playersData[3].honourPoints}</p>
                            </div>
                            <div className='game__icon-container '>
                                <img src={cardBack} className='game__icon--card game__icon' />
                                <p className='game__icon-text'>x {playersData[3].hand.length} </p>
                            </div>
                        </div>
                        <div className='game__user-character-container' id={socket.id}>
                            {playersData[3].harmless &&
                                <h2 className='game__user--heading'>HARMLESS</h2>
                            }

                            {currentPlayer?.socketID === playersData[3].socketID &&
                                <div className='game__user-turn-indicator'></div>
                            }

                            <div className="game__user-role-container">
                                <img src={playersData[3].role.img} className='game__user-role card' />
                            </div>

                            <div className="game__user-character-container">
                                <img src={playersData[3].character.img} className='game__user-character card' />
                            </div>

                        </div>


                        <div className="game__user-property-container">
                            {playersData[3].focus > 0 &&
                                <div className='game__icon-container'>
                                    <img src={focus} className='game__user-property card' />
                                    <p className='game__icon-text'>x {playersData[3].focus}</p>
                                </div>
                            }
                            {playersData[3].armor > 0 &&
                                <div className='game__icon-container'>
                                    <img src={armor} className='game__user-property card' />
                                    <p className='game__icon-text'>x {playersData[3].armor}</p>
                                </div >
                            }
                            {playersData[3].fastDraw > 0 &&
                                <div className='game__icon-container'>
                                    <img src={fast_draw} className='game__user-property card' />
                                    <p className='game__icon-text'>x {playersData[3].fastDraw}</p>
                                </div>
                            }
                            {playersData[3].bushido &&
                                <img src={bushido} className='game__user-property card' />
                            }
                        </div>

                        <div className='game__user-hand'>
                            {playersData[3].hand.length > 0 && playersData[3].hand.map((card: PlayableCard, index) => {
                                return <img src={card.img} key={index} onClick={() => {
                                    handleSelectedCard(card, index)
                                    handleActiveCard(index)
                                }} className={`game__user-card ${index === activeCard ? 'game__user-card--active' : ''} card`} />
                            })}
                        </div>
                    </div>
                </>
            }

            {playersData.length > 0 && socket.id === playersData[4].socketID &&
                <>
                    <div className="five-player-game__flex-container--top">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[1].name}</h1>
                            {playersData[1].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[1].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[1].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[1].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[1].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[1].character.img} className='game__player-character card ' />
                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[1].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[1].honourPoints}</p>
                                        </div>
                                    </div>
                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[1].hand.length} </p>
                                    </div>
                                </div>
                                <div className="game__icon-parent-container">
                                    {playersData[1].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[1].focus}</p>
                                        </div>
                                    }
                                    {playersData[1].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[1].armor}</p>
                                        </div>
                                    }
                                    {playersData[1].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[1].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[1].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[2].name}</h1>
                            {playersData[2].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[2].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[2].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[2].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[2].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[2].character.img} className='game__player-character card ' />
                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[2].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[2].honourPoints}</p>
                                        </div>
                                    </div>
                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[2].hand.length} </p>
                                    </div>
                                </div>
                                <div className="game__icon-parent-container">
                                    {playersData[2].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[2].focus}</p>
                                        </div>
                                    }
                                    {playersData[2].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[2].armor}</p>
                                        </div>
                                    }
                                    {playersData[2].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[2].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[2].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="five-player-game__flex-container">
                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[0].name}</h1>
                            {playersData[0].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[0].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[0].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[0].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[0].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[0].character.img} className='game__player-character card ' />

                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[0].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[0].honourPoints}</p>
                                        </div>
                                    </div>

                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[0].hand.length} </p>
                                    </div>
                                </div>

                                <div className="game__icon-parent-container">
                                    {playersData[0].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[0].focus}</p>
                                        </div>
                                    }
                                    {playersData[0].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[0].armor}</p>
                                        </div>
                                    }
                                    {playersData[0].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[0].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[0].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>

                        </div>

                        <div className='game__player-container'>
                            <h1 className='game__player-name'>{playersData[3].name}</h1>
                            {playersData[3].harmless &&
                                <h2 className='game__player-heading'>HARMLESS</h2>
                            }
                            {playersData[3].role.role === 'Shogun' &&
                                <>
                                    <div className='game__player-shogun-spacing'>
                                    </div>
                                    <div className="game__player-role-container">
                                        <img src={playersData[3].role.img} className='game__player-role card' />
                                    </div>
                                </>
                            }
                            <div className="game__player-flex-container">
                                <div className='game__player-character-container' id={playersData[3].socketID} onClick={(event: React.MouseEvent<HTMLDivElement>) => { handleSelectedPlayer(event.currentTarget) }}>
                                    {currentPlayer?.socketID === playersData[3].socketID &&
                                        <div className='game__player-turn-indicator'></div>
                                    }
                                    <img src={playersData[3].character.img} className='game__player-character card ' />

                                    <div className="game__player-flex-container game__player-flex-container--icon">
                                        <div className='game__icon-container'>
                                            <img src={heart} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[3].health}</p>
                                        </div>
                                        <div className='game__icon-container'>
                                            <img src={cherry_blossum} className='game__icon' />
                                            <p className='game__icon-text'>x {playersData[3].honourPoints}</p>
                                        </div>
                                    </div>

                                    <div className='game__icon-container '>
                                        <img src={cardBack} className='game__icon--card game__icon' />
                                        <p className='game__icon-text'>x {playersData[3].hand.length} </p>
                                    </div>
                                </div>

                                <div className="game__icon-parent-container">
                                    {playersData[3].focus > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={focus} className='game__player-property card' />
                                            <p>x {playersData[3].focus}</p>
                                        </div>
                                    }
                                    {playersData[3].armor > 0 &&
                                        <div className='game__icon-container '>
                                            <img src={armor} className='game__player-property card' />
                                            <p>x {playersData[3].armor}</p>
                                        </div>
                                    }
                                    {playersData[3].fastDraw > 0 &&
                                        <div className='game__icon-container'>
                                            <img src={fast_draw} className='game__player-property card' />
                                            <p>x {playersData[3].fastDraw}</p>
                                        </div>
                                    }
                                    {playersData[3].bushido &&
                                        <img src={bushido} className='game__player-property card' />
                                    }
                                </div>
                            </div>

                        </div>

                    </div>


                    <div className='game__middle-container'>
                        <div className='game__deck-container'>
                            <img src={cardBack} className='game__deck' />
                            <p className='game__deck-text'>x {drawDeck.length}</p>
                        </div>
                        {discardPile.length > 0 &&
                            <div className='game__deck-container'>
                                <img src={discardPile[discardPile.length - 1].img} className='game__deck game__deck--hover' />
                                <p>x {discardPile.length}</p>
                            </div>
                        }
                    </div>


                    <div className='game__user-container'>
                        <div className="game__user-flex-container">
                            <div className='game__icon-container'>
                                <img src={heart} className='game__icon' />
                                <p className='game__icon-text'>x {playersData[4].health}</p>
                            </div>
                            <div className='game__icon-container'>
                                <img src={cherry_blossum} className='game__icon' />
                                <p className='game__icon-text'>x {playersData[4].honourPoints}</p>
                            </div>
                            <div className='game__icon-container '>
                                <img src={cardBack} className='game__icon--card game__icon' />
                                <p className='game__icon-text'>x {playersData[4].hand.length} </p>
                            </div>
                        </div>
                        <div className='game__user-character-container' id={socket.id}>
                            {playersData[4].harmless &&
                                <h2 className='game__user--heading'>HARMLESS</h2>
                            }

                            {currentPlayer?.socketID === playersData[4].socketID &&
                                <div className='game__user-turn-indicator'></div>
                            }

                            <div className="game__user-role-container">
                                <img src={playersData[4].role.img} className='game__user-role card' />
                            </div>

                            <div className="game__user-character-container">
                                <img src={playersData[4].character.img} className='game__user-character card' />
                            </div>

                        </div>


                        <div className="game__user-property-container">
                            {playersData[4].focus > 0 &&
                                <div className='game__icon-container'>
                                    <img src={focus} className='game__user-property card' />
                                    <p className='game__icon-text'>x {playersData[4].focus}</p>
                                </div>
                            }
                            {playersData[4].armor > 0 &&
                                <div className='game__icon-container'>
                                    <img src={armor} className='game__user-property card' />
                                    <p className='game__icon-text'>x {playersData[4].armor}</p>
                                </div >
                            }
                            {playersData[4].fastDraw > 0 &&
                                <div className='game__icon-container'>
                                    <img src={fast_draw} className='game__user-property card' />
                                    <p className='game__icon-text'>x {playersData[4].fastDraw}</p>
                                </div>
                            }
                            {playersData[4].bushido &&
                                <img src={bushido} className='game__user-property card' />
                            }
                        </div>

                        <div className='game__user-hand'>
                            {playersData[4].hand.length > 0 && playersData[4].hand.map((card: PlayableCard, index) => {
                                return <img src={card.img} key={index} onClick={() => {
                                    handleSelectedCard(card, index)
                                    handleActiveCard(index)
                                }} className={`game__user-card ${index === activeCard ? 'game__user-card--active' : ''} card`} />
                            })}
                        </div>
                    </div>
                </>
            }

            {playersData[indexOfPlayer]?.character.name === 'Nobunaga' && !parryModule &&
                <>
                    {turn === socket.id && playersData[indexOfPlayer].health > 1 ? <button className='button button--ability' onClick={() => handleNobunaga()}>Use Ability</button> : <button className='button button--disabled button--ability' disabled>Use Ability</button>}
                </>
            }
            {turn === socket.id && !parryModule && !ieyasuModule ? <button className='button button--end' onClick={() => endTurn()}>End Turn</button> : <button className='button button--disabled  button--end' disabled>End Turn</button>}


        </>
    );
};

export default FivePlayerGamePage;