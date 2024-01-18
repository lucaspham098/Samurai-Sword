import { PlayableCard } from "../types/PlayableCard";
import { PlayersData } from "../types/PlayersData";
import shuffle from "./shuffle";

const handleEmptyDrawDeck = (drawDeck: PlayableCard[], playersData: PlayersData[], gameOver: boolean, setGameOver: (value: React.SetStateAction<boolean>) => void, setDrawDeck: (value: React.SetStateAction<PlayableCard[]>) => void, discardPile: PlayableCard[], setDiscardPile: (value: React.SetStateAction<PlayableCard[]>) => void, setEmptyDrawDeck: (value: React.SetStateAction<boolean>) => void, setPlayersData: (value: React.SetStateAction<PlayersData[]>) => void) => {
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
};

export default handleEmptyDrawDeck;