import React from 'react';

type ParryModuleProps = {
    wounds: number | undefined
    usersHand: PlayableCard[]
    indexOfParry: number
    handleParry: () => void
    handleGetAttacked: () => void
}

interface PlayableCard {
    type: string;
    name: string;
    range?: number;
    damage?: number;
}

const ParryModule = ({ wounds, usersHand, indexOfParry, handleParry, handleGetAttacked }: ParryModuleProps) => {
    return (
        <div>
            <p>index of parry is {indexOfParry}</p>
            <p>Parry the attack or take {wounds} wound(s)</p>
            {indexOfParry !== -1 ? <button onClick={() => handleParry()}>Parry</button> : <button disabled>Parry</button>}
            <button onClick={() => handleGetAttacked()}>Get Attacked</button>
        </div>
    );
};

export default ParryModule;