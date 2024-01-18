import { PlayersData } from "../../types/PlayersData"
import { Socket } from 'socket.io-client'
import indexOfCurrentPlayer from "../indexOfCurrentPlayer"
import React from 'react';



const handleBattlecryWound3Player = (playersData: PlayersData[], indexOfPlayer: number, currentPlayer: PlayersData | undefined, setDeadlyStrikeNinja: (value: React.SetStateAction<boolean>) => void, setGameOver: (value: React.SetStateAction<boolean>) => void, selectedPlayer: string | undefined, setDeath: (value: React.SetStateAction<boolean>) => void, setVictim: (value: React.SetStateAction<PlayersData | undefined>) => void, battlecryInfo: string[], battlecryJujitsuArray: PlayersData[], setBattlecryJujitsuArray: (value: React.SetStateAction<PlayersData[]>) => void, setBattlecryInfo: (value: React.SetStateAction<string[]>) => void, setParryModule: (value: React.SetStateAction<boolean>) => void, setPlayersData: (value: React.SetStateAction<PlayersData[]>) => void, setBattlecryJujitsuTurn: (value: React.SetStateAction<PlayersData | undefined>) => void, socket: Socket, setBattlecryJujitsuModule: (value: React.SetStateAction<boolean>) => void, setTurnBack: (data?: PlayersData[]) => void, setTurn: (value: React.SetStateAction<string>) => void, room: string | undefined, wounds: number) => {
    const data = [...playersData]

    if (data[indexOfPlayer].health - wounds === 0) {
        data[indexOfPlayer].health = 0
        data[indexOfPlayer].honourPoints = data[indexOfPlayer].honourPoints - 1
        if (data[indexOfPlayer].honourPoints <= 0) {
            if (currentPlayer?.role.team === 'Ninja' && playersData[indexOfPlayer].role.team === 'Ninja') {
                setDeadlyStrikeNinja(true)
            }
            setGameOver(true)
        }

        data[indexOfPlayer].harmless = true

        data[indexOfCurrentPlayer(playersData, selectedPlayer)].honourPoints = data[indexOfCurrentPlayer(playersData, selectedPlayer)].honourPoints + 1

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
        setTimeout(() => {
            setBattlecryJujitsuModule(false)
        }, 2000);
        socket.emit('closeBattlecryJujitsuModule', room)
        setTurnBack()
    }

    setTimeout(() => {
        setTurn('')
    }, 250);
}

export default handleBattlecryWound3Player

