import React from 'react';
import { act } from 'react-dom/test-utils';

type AnnouncementModuleProps = {
    currentPlayer: string
    victim: string
    wounds: number | undefined
    cardPlayed: PlayableCard | undefined
    weaponCardPlayed: boolean
    actionCardPlayed: boolean
    propertyCardPlayed: boolean
    playerHit: boolean
    parryPlayed: boolean
    battlecryInfo: string[]
    playersData: PlayersData[]
}

interface PlayableCard {
    type: string;
    name: string;
    range?: number;
    damage?: number;
}

interface PlayersData {
    socketID: string,
    role: Role,
    character: Character,
    hand: PlayableCard[],
    attacks: number,
    health: number,
    honourPoints: number
}

interface Character {
    name: string;
    health: number;
}

interface Role {
    role: string;
    team: string;
    stars?: number
}

const AnnouncementModule = ({ currentPlayer, victim, wounds, cardPlayed, weaponCardPlayed, actionCardPlayed, propertyCardPlayed, playerHit, parryPlayed, battlecryInfo, playersData }: AnnouncementModuleProps) => {

    const parry: PlayableCard =
    {
        type: 'action',
        name: 'Parry'
    }



    return (
        <div>
            {weaponCardPlayed &&
                <>
                    <p>{currentPlayer} attacked {victim} with {cardPlayed?.name} causing {wounds} wound(s)</p>
                    <p>Waiting to see if {victim} will Parry</p>
                </>
            }

            {parryPlayed &&
                <p>{victim} parried the attack from {currentPlayer}</p>

            }

            {playerHit && <p>{victim} took {wounds} wound(s) from {currentPlayer}</p>}

            {cardPlayed?.name === "Divertion" && <p>{currentPlayer} used {cardPlayed.name} against {victim}</p>}

            {cardPlayed?.name === "Breathing" && <p>{currentPlayer} used {cardPlayed.name} and healed to full health and chose {victim} to draw a card</p>}

            {cardPlayed?.name === 'Battlecry' && battlecryInfo.length !== playersData.length - 1 && <p>{currentPlayer} played {cardPlayed.name}. Waiting for players to discard parry or take a wound.</p>}

            {cardPlayed?.name === 'Battlecry' && battlecryInfo.length === playersData.length - 1 && <p>All players have resolved {currentPlayer}'s battlecry</p>}

            {battlecryInfo.length > 0 && battlecryInfo.map(info => {
                return <p>{info}</p>
            })}

            {actionCardPlayed && cardPlayed?.name !== 'Divertion' && cardPlayed?.name !== 'Breathing' && cardPlayed?.name !== 'Battlecry' && <p>{currentPlayer} played {cardPlayed?.name}</p>}
        </div>
    );
};

export default AnnouncementModule;