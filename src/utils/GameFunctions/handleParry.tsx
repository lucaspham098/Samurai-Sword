import { PlayableCard } from "../types/PlayableCard";
import { PlayersData } from "../types/PlayersData";
import parry from '../../assets/images/actions/parry.jpeg'

const handleParry = (setDiscardPile: (value: React.SetStateAction<PlayableCard[]>) => void, discardPile: PlayableCard[], playersData: PlayersData[], indexOfPlayer: number, indexOfParry: number, setPlayersData: (value: React.SetStateAction<PlayersData[]>) => void, setParryModule: (value: React.SetStateAction<boolean>) => void, setWeaponCardPlayed: (value: React.SetStateAction<boolean>) => void, setParryPlayed: (value: React.SetStateAction<boolean>) => void, setTurn: (value: React.SetStateAction<string>) => void, setTurnBack: (data?: PlayersData[]) => void) => {
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

};

export default handleParry;