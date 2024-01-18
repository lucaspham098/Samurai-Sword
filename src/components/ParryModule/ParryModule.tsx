import React from 'react';
import './ParryModule.scss'
import { PlayableCard } from '../../utils/types/PlayableCard';

type ParryModuleProps = {
    indexOfPlayer: number
    playersData: PlayersData[]
    currentPlayer: PlayersData | undefined
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

interface PlayersData {
    name: string,
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

const ParryModule = ({ indexOfPlayer, playersData, currentPlayer, wounds, indexOfParry, handleParry, handleGetAttacked, cardPlayed, handleBattlecryDiscard, handleBattlecryWound, handleJujitsuWound, bushidoWeapon, handleLoseHonourPoint, victim, handleDiscardRandomCard, handleRemoveArmor, handleRemoveBushido, handleRemoveFastDraw, handleRemoveFocus, discardCards }: ParryModuleProps) => {
    return (
        <>
            {cardPlayed?.name !== 'Battlecry' && cardPlayed?.name !== 'Jujitsu' &&
                <div className='choice-module'>
                    {cardPlayed?.type === 'weapon' && victim?.character.name !== 'Hanzo' && !discardCards &&
                        <>
                            <p className='choice-module__text'>Parry the attack or suffer <span className="emphasize">{wounds}</span> wound(s)</p>
                            {indexOfParry !== -1 ? <button className='button--small' onClick={() => handleParry()}>Parry</button> : <button className='button--small button--disabled' disabled>Parry</button>}
                            <button className='button--small' onClick={() => handleGetAttacked()}>Get Attacked</button>
                        </>
                    }

                    {cardPlayed?.type === 'weapon' && victim?.character.name === 'Hanzo' && !discardCards &&
                        <>
                            <p className='choice-module__text'>Either discard a Parry, select a Weapon in your hand to use as Parry (unless it is your last card), or suffer <span className="emphasize">{wounds}</span> wound(s)</p>
                            {indexOfParry !== -1 ? <button className='button--small' onClick={() => handleParry()}>Parry</button> : <button className='button--small button--disabled' disabled>Parry</button>}
                            <button className='button--small' onClick={() => handleGetAttacked()}>Get Attacked</button>
                        </>
                    }


                    {cardPlayed?.name === 'Geisha' && !!victim && !discardCards &&
                        <>
                            <p className='choice-module__text'>Choose from the options below</p>
                            <div className="choice-module__button-container">
                                <button className='button--small' onClick={() => handleDiscardRandomCard()}>Discard random card from {victim.name}</button>
                                {victim.focus > 0 &&
                                    <button className='button--small' onClick={() => handleRemoveFocus()}>Remove 1 Focus from {victim.name}</button>
                                }
                                {victim.armor > 0 &&
                                    <button className='button--small' onClick={() => handleRemoveArmor()}>Remove 1 Armor from {victim.name}</button>
                                }
                                {victim.fastDraw > 0 &&
                                    <button className='button--small' onClick={() => handleRemoveFastDraw()}>Remove 1 Fast Draw from {victim.name}</button>
                                }
                                {victim.bushido === true &&
                                    <button className='button--small' onClick={() => handleRemoveBushido()}>Remove Bushido from {victim.name}</button>
                                }
                            </div>

                        </>}

                    {bushidoWeapon === true && !discardCards && playersData.length === 3 && currentPlayer?.role.role === 'Shogun' &&
                        <>
                            <p className='choice-module__text'>Select a Weapon from your hand to discard to keep Bushido in play or discard Bushido</p>
                            <button className='button--small' onClick={() => handleLoseHonourPoint()}>Discard Bushido</button>
                        </>
                    }

                    {bushidoWeapon === true && !discardCards && (playersData.length !== 3 || currentPlayer?.role.role !== 'Shogun') &&
                        <>
                            <p className='choice-module__text'>Select a Weapon from your hand to discard or lose 1 honour point</p>
                            <button className='button--small' onClick={() => handleLoseHonourPoint()}>Lose 1 Hounour Point</button>
                        </>
                    }

                    {discardCards === true &&
                        <p className='choice-module__text'> Please select cards to discard until you have 7 cards in your hand</p>
                    }

                </div>
            }
            {cardPlayed?.name === 'Battlecry' && !discardCards &&
                <div className='choice-module--battlecry-jujitsu'>
                    {playersData[indexOfPlayer].character.name !== 'Hanzo' &&
                        <>
                            <p className='choice-module__text'>Discard a Parry or suffer 1 wound</p>
                            {indexOfParry !== -1 ? <button className='button--small' onClick={() => handleBattlecryDiscard()}>Discard Parry</button> : <button className='button--small button--disabled' disabled>Parry</button>}
                            <button className='button--small' onClick={() => handleBattlecryWound()}>Suffer 1 wound</button>
                        </>
                    }

                    {playersData[indexOfPlayer].character.name === 'Hanzo' &&
                        <>
                            <p className='choice-module__text'>Either discard a Parry, discard a wepaon from your hand to use as a parry (unless it is your last card) or suffer 1 wound</p>
                            {indexOfParry !== -1 ? <button className='button--small' onClick={() => handleBattlecryDiscard()}>Discard Parry</button> : <button className='button--small button--disabled' disabled>Parry</button>}
                            <button className='button--small' onClick={() => handleBattlecryWound()}>Suffer 1 wound</button>
                        </>
                    }
                </div>
            }

            {cardPlayed?.name === "Jujitsu" && !discardCards &&
                <div className='choice-module--battlecry-jujitsu'>
                    <>
                        <p className='choice-module__text'>Select a Weapon from your hand to discard or suffer 1 wound</p>
                        <button className='button--small' onClick={() => handleJujitsuWound()}>Suffer 1 wound</button>
                    </>
                </div>
            }
        </>

    );
};

export default ParryModule;