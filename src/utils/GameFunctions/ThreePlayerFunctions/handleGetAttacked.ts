import { PlayersData } from "../../types/PlayersData"
import { PlayableCard } from "../../types/PlayableCard"
import shuffle from "../shuffle"
import indexOfCurrentPlayer from "../indexOfCurrentPlayer"

const handleGetAttacked = (playersData: PlayersData[], drawDeck: PlayableCard[], currentPlayer: PlayersData | undefined, setDrawDeck: (value: React.SetStateAction<PlayableCard[]>) => void, indexOfPlayer: number, wounds: number, setDeadlyStrikeNinja: (value: React.SetStateAction<boolean>) => void, setGameOver: (value: React.SetStateAction<boolean>) => void, selectedPlayer: string | undefined, setDeath: (value: React.SetStateAction<boolean>) => void, setEmptyDrawDeck: (value: React.SetStateAction<boolean>) => void, discardPile: PlayableCard[], setDiscardPile: (value: React.SetStateAction<PlayableCard[]>) => void, setPlayersData: (value: React.SetStateAction<PlayersData[]>) => void, setPlayerHit: (value: React.SetStateAction<boolean>) => void, setParryModule: (value: React.SetStateAction<boolean>) => void, setWeaponCardPlayed: (value: React.SetStateAction<boolean>) => void, setTurn: (value: React.SetStateAction<string>) => void, setTurnBack: (data?: PlayersData[]) => void) => {
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
        if (data[indexOfPlayer].honourPoints <= 0) {
            if (currentPlayer?.role.team === 'Ninja' && data[indexOfPlayer].role.team === 'Ninja') {
                setDeadlyStrikeNinja(true)
            }
            setGameOver(true)
            console.log('3')
        }
        data[indexOfPlayer].harmless = true

        data[indexOfCurrentPlayer(playersData, selectedPlayer)].honourPoints = data[indexOfCurrentPlayer(playersData, selectedPlayer)].honourPoints + 1

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

export default handleGetAttacked