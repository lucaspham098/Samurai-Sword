import { PlayableCard } from "../../types/PlayableCard"
import { PlayersData } from "../../types/PlayersData"
import shuffle from "../shuffle"
import handleDrawCards from "../handleDrawCards"

const handleNewTurn = (turn: string, socketID: string, newTurn: boolean, playersData: PlayersData[], indexOfPlayer: number, setPlayersData: (value: React.SetStateAction<PlayersData[]>) => void, drawDeck: PlayableCard[], setDiscardPile: (value: React.SetStateAction<PlayableCard[]>) => void, discardPile: PlayableCard[], setDrawDeck: (value: React.SetStateAction<PlayableCard[]>) => void, setWeaponCardPlayed: (value: React.SetStateAction<boolean>) => void, setActionCardPlayed: (value: React.SetStateAction<boolean>) => void, setPropertyCardPlayed: (value: React.SetStateAction<boolean>) => void, setPlayerHit: (value: React.SetStateAction<boolean>) => void, setParryPlayed: (value: React.SetStateAction<boolean>) => void, setBushidoInfo: (value: React.SetStateAction<string | undefined>) => void, setBushidoWeapon: (value: React.SetStateAction<boolean | undefined>) => void, setParryModule: (value: React.SetStateAction<boolean>) => void, setIeyasuModule: (value: React.SetStateAction<boolean>) => void, setEmptyDrawDeck: (value: React.SetStateAction<boolean>) => void, setGameOver: (value: React.SetStateAction<boolean>) => void, currentPlayer: PlayersData | undefined, gameOver: boolean, ieyasuModule: boolean) => {
    if (turn === socketID && newTurn) {

        if (playersData[indexOfPlayer]?.harmless === true) {
            const data = [...playersData]
            data[indexOfPlayer].harmless = false
            setPlayersData(data)
        }

        if (playersData[indexOfPlayer]?.health === 0) {
            const data = [...playersData]
            data[indexOfPlayer].health = data[indexOfPlayer].character.health
            setPlayersData(data)
        }

        if (playersData[indexOfPlayer]?.bushido === true) {
            let newDrawDeck = [...drawDeck]
            const drawnCard = newDrawDeck.pop() as PlayableCard

            setDiscardPile([...discardPile, drawnCard])


            if (drawnCard.type === 'weapon') {
                setDrawDeck(newDrawDeck)
                setWeaponCardPlayed(false)
                setActionCardPlayed(false)
                setPropertyCardPlayed(false)
                setPlayerHit(false)
                setParryPlayed(false)
                setBushidoInfo(undefined)
                setBushidoWeapon(true)

                setTimeout(() => {
                    setParryModule(true)
                }, 100);
            }
            else {
                setWeaponCardPlayed(false)
                setActionCardPlayed(false)
                setPropertyCardPlayed(false)
                setPlayerHit(false)
                setParryPlayed(false)
                setBushidoInfo(undefined)
                setBushidoWeapon(false)

                const data = [...playersData]
                data[indexOfPlayer].bushido = false
                if (!!playersData[indexOfPlayer + 1]) {
                    data[indexOfPlayer + 1].bushido = true
                } else {
                    data[0].bushido = true
                }

                if (playersData[indexOfPlayer]?.character.name === "Ieyasu") {
                    setIeyasuModule(true)
                } else {
                    const newCards: PlayableCard[] = [];
                    if (playersData[indexOfPlayer]?.character.name === 'Hideyoshi' && playersData[indexOfPlayer]?.role.role === 'Shogun') {

                        for (let i = 0; i < 4; i++) {
                            if (newDrawDeck.length === 0) {
                                data.map(player => player.honourPoints = player.honourPoints - 1)
                                setEmptyDrawDeck(true)
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

                    } else if (playersData[indexOfPlayer]?.character.name === 'Hideyoshi' || playersData[indexOfPlayer]?.role.role === 'Shogun') {

                        for (let i = 0; i < 3; i++) {
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

                    } else {
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
                    }

                    data[indexOfPlayer].hand = [...data[indexOfPlayer].hand, ...newCards];
                }
                setDrawDeck(newDrawDeck)
                setPlayersData(data)
            }
        } else if (playersData[indexOfPlayer]?.character.name === 'Ieyasu' && currentPlayer?.character.name === 'Ieyasu' && discardPile.length > 0) {
            setIeyasuModule(true)
        }
        else {
            if (playersData[indexOfPlayer]?.character.name === 'Hideyoshi' && playersData[indexOfPlayer]?.role.role === 'Shogun') {
                handleDrawCards(4, playersData, gameOver, drawDeck, setEmptyDrawDeck, setDiscardPile, setGameOver, discardPile, indexOfPlayer, setDrawDeck, setPlayersData, ieyasuModule, setIeyasuModule)
            } else if (playersData[indexOfPlayer]?.character.name === 'Hideyoshi' || playersData[indexOfPlayer]?.role.role === 'Shogun') {
                handleDrawCards(3, playersData, gameOver, drawDeck, setEmptyDrawDeck, setDiscardPile, setGameOver, discardPile, indexOfPlayer, setDrawDeck, setPlayersData, ieyasuModule, setIeyasuModule)
            } else {
                handleDrawCards(2, playersData, gameOver, drawDeck, setEmptyDrawDeck, setDiscardPile, setGameOver, discardPile, indexOfPlayer, setDrawDeck, setPlayersData, ieyasuModule, setIeyasuModule)
            }
        }

    }

}

export default handleNewTurn