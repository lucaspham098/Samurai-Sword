import React from 'react';

type AttackModuleProps = {
    attacker: string
    victim: string
    wounds: number | undefined
    weaponCard: PlayableCard | undefined
}

interface PlayableCard {
    type: string;
    name: string;
    range?: number;
    damage?: number;
}

const AttackModule = ({ attacker, victim, wounds, weaponCard }: AttackModuleProps) => {
    return (
        <div>
            <p>{attacker} attacked {victim} with {weaponCard?.name} causing {wounds} wound(s) </p>
            <p>Waiting to see if {victim} will Parry</p>
        </div>
    );
};

export default AttackModule;