import { PlayableCard } from "../types/PlayableCard"
import { PlayersData } from "../types/PlayersData"
import { Socket } from "socket.io-client"
import parry from '../../assets/images/actions/parry.jpeg'


const handleBattlecryDiscard = (discardPile: PlayableCard[], playersData: PlayersData[], indexOfPlayer: number, indexOfParry: number, battlecryInfo: string[], battlecryJujitsuArray: PlayersData[], setBattlecryJujitsuArray: (value: React.SetStateAction<PlayersData[]>) => void, setDiscardPile: (value: React.SetStateAction<PlayableCard[]>) => void, setPlayersData: (value: React.SetStateAction<PlayersData[]>) => void, setBattlecryInfo: (value: React.SetStateAction<string[]>) => void, setParryModule: (value: React.SetStateAction<boolean>) => void, setBattlecryJujitsuTurn: (value: React.SetStateAction<PlayersData | undefined>) => void, socket: Socket, setBattlecryJujitsuModule: (value: React.SetStateAction<boolean>) => void, setTurnBack: (data?: PlayersData[]) => void, setTurn: (value: React.SetStateAction<string>) => void, room: string | undefined) => {
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

export default handleBattlecryDiscard