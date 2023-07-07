import React from 'react';

type ParryModuleProps = {
    wounds: number | undefined
    usersHand: PlayableCard[]
    indexOfParry: number
    handleParry: () => void
    handleGetAttacked: () => void
    cardPlayed: PlayableCard | undefined
}

interface PlayableCard {
    type: string;
    name: string;
    range?: number;
    damage?: number;
}

const ParryModule = ({ wounds, usersHand, indexOfParry, handleParry, handleGetAttacked, cardPlayed }: ParryModuleProps) => {
    return (
        <div>
            {cardPlayed?.name !== 'Battlecry' && cardPlayed?.name !== 'Jujitsu' &&
                <>
                    <p>Parry the attack or take {wounds} wound(s)</p>
                    {indexOfParry !== -1 ? <button onClick={() => handleParry()}>Parry</button> : <button disabled>Parry</button>}
                    <button onClick={() => handleGetAttacked()}>Get Attacked</button>
                </>
            }
            {cardPlayed?.name === 'Battlecry' &&
                <>
                    <p>Discard a parry or suffer 1 wound</p>
                    {indexOfParry !== -1 ? <button onClick={() => handleParry()}>Discard Parry</button> : <button disabled>Parry</button>}
                    <button>Suffer 1 wound</button>
                </>
            }



        </div>
    );
};

export default ParryModule;