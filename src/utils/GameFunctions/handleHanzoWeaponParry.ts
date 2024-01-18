import { PlayableCard } from "../types/PlayableCard"
import { PlayersData } from "../types/PlayersData"
import { Socket } from "socket.io-client"

const handleHanzoWeaponParry = (card: PlayableCard, index: number, setParryModule: (value: React.SetStateAction<boolean>) => void, setDiscardPile: (value: React.SetStateAction<PlayableCard[]>) => void, discardPile: PlayableCard[], playersData: PlayersData[], indexOfPlayer: number, cardPlayed: PlayableCard | undefined, battlecryInfo: string[], battlecryJujitsuArray: PlayersData[], setBattlecryJujitsuArray: (value: React.SetStateAction<PlayersData[]>) => void, setBattlecryInfo: (value: React.SetStateAction<string[]>) => void, setBattlecryJujitsuTurn: (value: React.SetStateAction<PlayersData | undefined>) => void, socket: Socket, setBattlecryJujitsuModule: (value: React.SetStateAction<boolean>) => void, setTurnBack: (data?: PlayersData[]) => void, setTurn: (value: React.SetStateAction<string>) => void, setWeaponCardPlayed: (value: React.SetStateAction<boolean>) => void, setParryPlayed: (value: React.SetStateAction<boolean>) => void, setPlayersData: (value: React.SetStateAction<PlayersData[]>) => void, room: string | undefined) => {
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
            setTimeout(() => {
                setBattlecryJujitsuModule(false)
            }, 2000);
            socket.emit('closeBattlecryJujitsuModule', room)
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

export default handleHanzoWeaponParry