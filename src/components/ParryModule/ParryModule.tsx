import React from 'react';

type ParryModuleProps = {
    wounds: number | undefined
    indexOfParry: number
    handleParry: () => void
    handleGetAttacked: () => void
    cardPlayed: PlayableCard | undefined
    handleBattlecryDiscard: () => void
    handleBattlecryWound: () => void
}

interface PlayableCard {
    type: string;
    name: string;
    range?: number;
    damage?: number;
}

const ParryModule = ({ wounds, indexOfParry, handleParry, handleGetAttacked, cardPlayed, handleBattlecryDiscard, handleBattlecryWound }: ParryModuleProps) => {
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
                    {indexOfParry !== -1 ? <button onClick={() => handleBattlecryDiscard()}>Discard Parry</button> : <button disabled>Parry</button>}
                    <button onClick={() => handleBattlecryWound()}>Suffer 1 wound</button>
                </>
            }



        </div>
    );
};

export default ParryModule;