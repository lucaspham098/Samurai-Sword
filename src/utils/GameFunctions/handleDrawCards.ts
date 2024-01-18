import { PlayersData } from "../types/PlayersData";
import { PlayableCard } from "../types/PlayableCard";
import shuffle from "./shuffle";


const handleDrawCards = (number: number, playersData: PlayersData[], gameOver: boolean, drawDeck: PlayableCard[], setEmptyDrawDeck: (value: React.SetStateAction<boolean>) => void, setDiscardPile: (value: React.SetStateAction<PlayableCard[]>) => void, setGameOver: (value: React.SetStateAction<boolean>) => void, discardPile: PlayableCard[], indexOfPlayer: number, setDrawDeck: (value: React.SetStateAction<PlayableCard[]>) => void, setPlayersData: (value: React.SetStateAction<PlayersData[]>) => void, ieyasuModule: boolean, setIeyasuModule: (value: React.SetStateAction<boolean>) => void) => {
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

export default handleDrawCards;