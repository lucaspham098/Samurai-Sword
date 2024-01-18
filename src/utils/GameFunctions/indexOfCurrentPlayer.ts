
import { PlayersData } from "../types/PlayersData";

const indexOfCurrentPlayer = (playersData: PlayersData[], selectedPlayer: string | undefined) => {
    return playersData.findIndex(player => player.socketID === selectedPlayer)
};

export default indexOfCurrentPlayer;