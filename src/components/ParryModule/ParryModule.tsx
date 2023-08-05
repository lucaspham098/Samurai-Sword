import React from 'react';
import './ParryModule.scss'

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
    discardCards: boolean
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

const ParryModule = ({ wounds, indexOfParry, handleParry, handleGetAttacked, cardPlayed, handleBattlecryDiscard, handleBattlecryWound, handleJujitsuWound, bushidoWeapon, handleLoseHonourPoint, victim, handleDiscardRandomCard, handleRemoveArmor, handleRemoveBushido, handleRemoveFastDraw, handleRemoveFocus, discardCards }: ParryModuleProps) => {
    return (
        <div className='choice-module'>
            {cardPlayed?.type === 'weapon' && victim?.character.name !== 'Hanzo' && !discardCards &&
                <>
                    <p>Parry the attack or take {wounds} wound(s)</p>
                    {indexOfParry !== -1 ? <button className='button--small' onClick={() => handleParry()}>Parry</button> : <button className='button--small button--disabled' disabled>Parry</button>}
                    <button className='button--small' onClick={() => handleGetAttacked()}>Get Attacked</button>
                </>
            }

            {cardPlayed?.type === 'weapon' && victim?.character.name === 'Hanzo' && !discardCards &&
                <>
                    <p>Parry the attack with a parry card, select a weapon in hand to use as parry (unless it is your last card), or take {wounds} wound(s)</p>
                    {indexOfParry !== -1 ? <button className='button--small' onClick={() => handleParry()}>Parry</button> : <button className='button--small button--disabled' disabled>Parry</button>}
                    <button className='button--small' onClick={() => handleGetAttacked()}>Get Attacked</button>
                </>
            }

            {cardPlayed?.name === 'Battlecry' && !discardCards &&
                <>
                    <p>Discard a parry or suffer 1 wound</p>
                    {indexOfParry !== -1 ? <button className='button--small' onClick={() => handleBattlecryDiscard()}>Discard Parry</button> : <button className='button--small button--disabled' disabled>Parry</button>}
                    <button className='button--small' onClick={() => handleBattlecryWound()}>Suffer 1 wound</button>
                </>
            }

            {cardPlayed?.name === 'Jujitsu' && !discardCards &&
                <>
                    <p>Select a weapon fromm hand to discard or suffer 1 wound</p>
                    <button className='button--small' onClick={() => handleJujitsuWound()}>Suffer 1 wound</button>
                </>
            }

            {cardPlayed?.name === 'Geisha' && !!victim && !discardCards &&
                <>
                    <p>Choose from the options below</p>
                    <div className="choice-module__button-container">
                        <button className='button--small' onClick={() => handleDiscardRandomCard()}>Discard random card form {victim.character.name}</button>
                        {victim.focus > 0 &&
                            <button className='button--small' onClick={() => handleRemoveFocus()}>Remove 1 Focus from {victim.character.name}</button>
                            // :
                            // <button className='button--small button--disabled' disabled>Remove 1 Focus from {victim.character.name}</button>
                        }
                        {victim.armor > 0 &&
                            <button className='button--small' onClick={() => handleRemoveArmor()}>Remove 1 Armor from {victim.character.name}</button>
                            // :
                            // <button className='button--small button--disabled' disabled>Remove 1 Armor from {victim.character.name}</button>
                        }
                        {victim.fastDraw > 0 &&
                            <button className='button--small' onClick={() => handleRemoveFastDraw()}>Remove 1 Fast Draw from {victim.character.name}</button>
                            // :
                            // <button className='button--small button--disabled' disabled>Remove 1 Fast Draw from {victim.character.name}</button>
                        }
                        {victim.bushido === true &&
                            <button className='button--small' onClick={() => handleRemoveBushido()}>Remove Bushido from {victim.character.name}</button>
                            // :
                            // <button className='button--small button--disabled' disabled>Remove Bushido from {victim.character.name}</button>
                        }
                    </div>

                </>}

            {bushidoWeapon === true && !discardCards &&
                <>
                    <p>Select a weapon fromm hand to discard or lose 1 honour point</p>
                    <button className='button--small' onClick={() => handleLoseHonourPoint()}>Lose 1 Hounour Point</button>
                </>
            }

            {discardCards === true &&
                <p> Please select cards to discard until you have 7 cards in your hand</p>
            }

        </div>
    );
};

export default ParryModule;