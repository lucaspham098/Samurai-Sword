import React from 'react';
import { act } from 'react-dom/test-utils';

type AnnouncementModuleProps = {
    currentPlayer: string
    victim: PlayersData | undefined
    wounds: number | undefined
    cardPlayed: PlayableCard | undefined
    weaponCardPlayed: boolean
    actionCardPlayed: boolean
    propertyCardPlayed: boolean
    playerHit: boolean
    parryPlayed: boolean
    battlecryInfo: string[]
    jujitsuInfo: string[]
    playersData: PlayersData[]
    bushidoWeapon: boolean | undefined
    bushidoInfo: string | undefined
    geishaInfo: string | undefined
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

const AnnouncementModule = ({ currentPlayer, victim, wounds, cardPlayed, weaponCardPlayed, actionCardPlayed, propertyCardPlayed, playerHit, parryPlayed, battlecryInfo, jujitsuInfo, playersData, bushidoWeapon, bushidoInfo, geishaInfo }: AnnouncementModuleProps) => {

    const parry: PlayableCard =
    {
        type: 'action',
        name: 'Parry'
    }



    return (
        <div>
            {weaponCardPlayed &&
                <>
                    <p>{currentPlayer} attacked {victim?.socketID} with {cardPlayed?.name} causing {wounds} wound(s)</p>
                    <p>Waiting to see if {victim?.socketID} will Parry</p>
                </>
            }

            {parryPlayed &&
                <p>{victim?.socketID} parried the attack from {currentPlayer}</p>

            }

            {playerHit && <p>{victim?.socketID} took {wounds} wound(s) from {currentPlayer}</p>}

            {cardPlayed?.name === "Divertion" && <p>{currentPlayer} used {cardPlayed.name} against {victim?.socketID}</p>}

            {cardPlayed?.name === "Breathing" && <p>{currentPlayer} used {cardPlayed.name} and healed to full health and chose {victim?.socketID} to draw a card</p>}

            {cardPlayed?.name === 'Battlecry' && battlecryInfo.length !== playersData.length - 1 && <p>{currentPlayer} played {cardPlayed.name}. Waiting for players to discard a parry or take a wound.</p>}

            {cardPlayed?.name === 'Jujitsu' && jujitsuInfo.length !== playersData.length - 1 && <p>{currentPlayer} played {cardPlayed.name}. Waiting for players to discard a weapon or take a wound.</p>}

            {cardPlayed?.name === 'Battlecry' && battlecryInfo.length === playersData.length - 1 && <p>All players have resolved {currentPlayer}'s battlecry</p>}

            {cardPlayed?.name === 'Jujitsu' && jujitsuInfo.length === playersData.length - 1 && <p>All players have resolved {currentPlayer}'s jujitsu</p>}

            {cardPlayed?.name === 'Battlecry' && battlecryInfo.length > 0 && battlecryInfo.map((info, index) => {
                return <p key={index}>{info}</p>
            })}

            {cardPlayed?.name === 'Jujitsu' && jujitsuInfo.length > 0 && jujitsuInfo.map((info, index) => {
                return <p key={index}>{info}</p>
            })}

            {actionCardPlayed && cardPlayed?.name !== 'Divertion' && cardPlayed?.name !== 'Breathing' && cardPlayed?.name !== 'Battlecry' && cardPlayed?.name !== 'Jujitsu' && cardPlayed?.name !== 'Geisha' &&
                <p>{currentPlayer} played {cardPlayed?.name}</p>
            }

            {geishaInfo &&
                <p>{geishaInfo}</p>
            }

            {propertyCardPlayed && cardPlayed?.name !== 'Bushido' && <p>{currentPlayer} played {cardPlayed?.name}</p>}

            {propertyCardPlayed && cardPlayed?.name === 'Bushido' &&
                <p>{currentPlayer} gave Bushido to {victim?.socketID}</p>
            }

            {bushidoWeapon === true &&
                <p>{currentPlayer} flipped a weapon card for bushido. Waiting to see if {currentPlayer} will discard a weapon or lose a honour point</p>
            }

            {bushidoWeapon === false &&
                <p>{currentPlayer} did not flip  weapon card for bushido. Bushido is passed.</p>
            }

            {bushidoInfo &&
                <p>{bushidoInfo}</p>
            }

        </div>
    );
};

export default AnnouncementModule;