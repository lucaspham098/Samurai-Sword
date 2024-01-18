import { PlayersData } from "../types/PlayersData";

const indexOfSelectedPlayer = (playersData: PlayersData[], selectedPlayer: string | undefined) => {
    return playersData.findIndex(player => player.socketID === selectedPlayer)

};

export default indexOfSelectedPlayer;