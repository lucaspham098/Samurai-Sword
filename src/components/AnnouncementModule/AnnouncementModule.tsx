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
}

interface PlayableCard {
    type: string;
    name: string;
    range?: number;
    damage?: number;
}

const AnnouncementModule = ({ currentPlayer, victim, wounds, cardPlayed, weaponCardPlayed, actionCardPlayed, propertyCardPlayed, playerHit, parryPlayed }: AnnouncementModuleProps) => {

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

            {cardPlayed?.name === 'Battlecry' && <p>{currentPlayer} played {cardPlayed.name}. Waiting for players to discard parry or take a wound.</p>}

            {actionCardPlayed && cardPlayed?.name !== 'Divertion' && cardPlayed?.name !== 'Breathing' && <p>{currentPlayer} played {cardPlayed?.name}</p>}
        </div>
    );
};

export default AnnouncementModule;