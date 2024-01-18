import { PlayableCard } from "../../types/PlayableCard";
import { PlayersData } from "../../types/PlayersData";
import shuffle from "../shuffle";

const drawCardFromDiscard3Player = (drawDeck: PlayableCard[], playersData: PlayersData[], indexOfPlayer: number, setEmptyDrawDeck: (value: React.SetStateAction<boolean>) => void, setDiscardPile: (value: React.SetStateAction<PlayableCard[]>) => void, setGameOver: (value: React.SetStateAction<boolean>) => void, discardPile: PlayableCard[], setDrawDeck: (value: React.SetStateAction<PlayableCard[]>) => void, setPlayersData: (value: React.SetStateAction<PlayersData[]>) => void, ieyasuModule: boolean, setIeyasuModule: (value: React.SetStateAction<boolean>) => void) => {
    let newDrawDeck = [...drawDeck]
    const data = [...playersData]
    const newCards: PlayableCard[] = [];

    if (playersData[indexOfPlayer].role.role === 'Shogun') {
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
        data[indexOfPlayer].hand = [...data[indexOfPlayer].hand, discardPile.pop() as PlayableCard, ...newCards]
    } else {
        data[indexOfPlayer].hand = [...data[indexOfPlayer].hand, discardPile.pop() as PlayableCard, newDrawDeck.pop() as PlayableCard]
    }

    setDrawDeck(newDrawDeck)
    setPlayersData(data)


    if (ieyasuModule === true) {
        setIeyasuModule(false)
    }
}

export default drawCardFromDiscard3Player