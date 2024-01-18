import React from 'react';
import { PlayableCard } from '../types/PlayableCard';
import { PlayersData } from '../types/PlayersData';
import handleHanzoWeaponParry from './handleHanzoWeaponParry';
import { Socket } from 'socket.io-client';


const handleSelectedCard = (card: PlayableCard, index: number, turn: string, socketID: string, setSelectedCard: (value: React.SetStateAction<PlayableCard | undefined>) => void, setActiveCard: (value: React.SetStateAction<number | null>) => void, discardCards: boolean, playersData: PlayersData[], setDiscardPile: (value: React.SetStateAction<PlayableCard[]>) => void, discardPile: PlayableCard[], indexOfPlayer: number, setPlayersData: (value: React.SetStateAction<PlayersData[]>) => void, setParryModule: (value: React.SetStateAction<boolean>) => void, setDiscardCards: (value: React.SetStateAction<boolean>) => void, endTurn: () => void, jujitsuInEffect: boolean, handleJujitsuDiscard: (card: PlayableCard, index: number) => void, setJujitsuInEffect: (value: React.SetStateAction<boolean>) => void, bushidoWeapon: boolean | undefined, handleBushidoDiscard: (card: PlayableCard, index: number) => void, setBushidoWeapon: (value: React.SetStateAction<boolean | undefined>) => void, weaponCardPlayed: boolean, cardPlayed: PlayableCard | undefined, parryModule: boolean, battlecryInfo: string[], battlecryJujitsuArray: PlayersData[], setBattlecryJujitsuArray: (value: React.SetStateAction<PlayersData[]>) => void, setBattlecryInfo: (value: React.SetStateAction<string[]>) => void, setBattlecruJujitsuTurn: (value: React.SetStateAction<PlayersData | undefined>) => void, socket: Socket, setBattlecryJujitsuModule: (value: React.SetStateAction<boolean>) => void, setTurnBack: (data?: PlayersData[]) => void, setTurn: (value: React.SetStateAction<string>) => void, setWeaponCardPlayed: (value: React.SetStateAction<boolean>) => void, setParryPlayed: (value: React.SetStateAction<boolean>) => void, room: string | undefined) => {
    if (turn === socketID) {
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

        if (card.type === 'weapon' && turn === socketID && jujitsuInEffect) {
            handleJujitsuDiscard(card, index)
            setJujitsuInEffect(false)
            setSelectedCard(undefined)
            setActiveCard(null)

        }

        if (card.type === 'weapon' && turn === socketID && bushidoWeapon) {
            handleBushidoDiscard(card, index)
            setBushidoWeapon(undefined)
            setSelectedCard(undefined)
            setActiveCard(null)

        }

        if (card.type === 'weapon' && turn === socketID && (weaponCardPlayed || cardPlayed?.name === 'Battlecry') && parryModule && playersData[indexOfPlayer].character.name === "Hanzo" && playersData[indexOfPlayer].hand.length > 1) {
            handleHanzoWeaponParry(card, index, setParryModule, setDiscardPile, discardPile, playersData, indexOfPlayer, cardPlayed, battlecryInfo, battlecryJujitsuArray, setBattlecryJujitsuArray, setBattlecryInfo, setBattlecruJujitsuTurn, socket, setBattlecryJujitsuModule, setTurnBack, setTurn, setWeaponCardPlayed, setParryPlayed, setPlayersData, room)
            setSelectedCard(undefined)
            setActiveCard(null)

        }


    }
};

export default handleSelectedCard;