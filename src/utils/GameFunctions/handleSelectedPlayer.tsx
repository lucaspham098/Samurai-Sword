

const handleSelectedPlayer = (turn: string, socketID: string, targetID: string, selectingPlayer: boolean, setSelectedPlayer: (value: React.SetStateAction<string | undefined>) => void) => {
    if (turn === socketID && selectingPlayer) {
        setSelectedPlayer(targetID)
    }
};

export default handleSelectedPlayer;