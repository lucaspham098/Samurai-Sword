import React from 'react';

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
        </div>
    );
};

export default AnnouncementModule;