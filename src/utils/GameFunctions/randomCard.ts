import { PlayableCard } from "../types/PlayableCard";

const randomCard = (arr: PlayableCard[]) => {
    const randomIndex = Math.floor(Math.random() * arr.length)
    return randomIndex
};

export default randomCard;