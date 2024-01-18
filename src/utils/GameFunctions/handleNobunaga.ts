import { PlayableCard } from "../types/PlayableCard"
import { PlayersData } from "../types/PlayersData"


const handleNobunaga = (playersData: PlayersData[], indexOfPlayer: number, drawDeck: PlayableCard[], setPlayersData: (value: React.SetStateAction<PlayersData[]>) => void) => {
    const data = [...playersData]
    if (data[indexOfPlayer].health > 1) {
        data[indexOfPlayer].hand = [...data[indexOfPlayer].hand, drawDeck.pop() as PlayableCard]
        data[indexOfPlayer].health = data[indexOfPlayer].health - 1

        setPlayersData(data)
    }

}

export default handleNobunaga