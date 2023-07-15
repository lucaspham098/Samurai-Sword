import React from 'react';

type ParryModuleProps = {
    wounds: number | undefined
    indexOfParry: number
    handleParry: () => void
    handleGetAttacked: () => void
    cardPlayed: PlayableCard | undefined
    handleBattlecryDiscard: () => void
    handleBattlecryWound: () => void
    handleJujitsuWound: () => void
    bushidoWeapon: boolean | undefined
    handleLoseHonourPoint: () => void
    victim: PlayersData | undefined
    handleDiscardRandomCard: () => void
    handleRemoveFocus: () => void
    handleRemoveArmor: () => void
    handleRemoveFastDraw: () => void
    handleRemoveBushido: () => void
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
    honourPoints: number,
    focus: number,
    armor: number,
    fastDraw: number,
    bushido: boolean
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

const ParryModule = ({ wounds, indexOfParry, handleParry, handleGetAttacked, cardPlayed, handleBattlecryDiscard, handleBattlecryWound, handleJujitsuWound, bushidoWeapon, handleLoseHonourPoint, victim, handleDiscardRandomCard, handleRemoveArmor, handleRemoveBushido, handleRemoveFastDraw, handleRemoveFocus }: ParryModuleProps) => {
    return (
        <div>
            {cardPlayed?.name !== 'Battlecry' && cardPlayed?.name !== 'Jujitsu' && cardPlayed?.name !== 'Geisha' && bushidoWeapon === undefined &&
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

            {cardPlayed?.name === 'Jujitsu' &&
                <>
                    <p>Select a weapon fromm hand to discard or suffer 1 wound</p>
                    <button onClick={() => handleJujitsuWound()}>Suffer 1 wound</button>
                </>
            }

            {cardPlayed?.name === 'Geisha' && !!victim &&
                <>
                    <p>Choose form the options below</p>
                    <button onClick={() => handleDiscardRandomCard()}>Discard random card form {victim.socketID}</button>
                    {victim.focus > 0 ?
                        <button onClick={() => handleRemoveFocus()}>Remove 1 Focus from {victim.socketID}</button>
                        :
                        <button disabled>Remove 1 Focus from {victim.socketID}</button>}
                    {victim.armor > 0 ?
                        <button onClick={() => handleRemoveArmor()}>Remove 1 Armor from {victim.socketID}</button>
                        :
                        <button disabled>Remove 1 Armor from {victim.socketID}</button>
                    }
                    {victim.fastDraw > 0 ?
                        <button onClick={() => handleRemoveFastDraw()}>Remove 1 Fast Draw from {victim.socketID}</button>
                        :
                        <button disabled>Remove 1 Fast Draw from {victim.socketID}</button>
                    }
                    {victim.bushido === true ?
                        <button onClick={() => handleRemoveBushido()}>Remove Bushido from {victim.socketID}</button>
                        :
                        <button disabled>Remove Bushido from {victim.socketID}</button>
                    }
                </>}

            {bushidoWeapon === true &&
                <>
                    <p>Select a weapon fromm hand to discard or lose 1 honour point</p>
                    <button onClick={() => handleLoseHonourPoint()}>Lose 1 Hounour Point</button>
                </>
            }

        </div>
    );
};

export default ParryModule;