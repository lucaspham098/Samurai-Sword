import { Role } from "./Roles"
import { Character } from "./Character"
import { PlayableCard } from "./PlayableCard"

export type PlayersData = {
    name: string,
    socketID: string,
    role: Role,
    character: Character,
    hand: PlayableCard[],
    attacks: number,
    health: number,
    honourPoints: number
    focus: number,
    armor: number,
    fastDraw: number,
    bushido: boolean,
    harmless: boolean
}