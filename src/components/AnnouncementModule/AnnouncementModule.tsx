import { UUID } from 'crypto';
import React from 'react';
import { act } from 'react-dom/test-utils';

type AnnouncementModuleProps = {
    currentPlayer: PlayersData | undefined
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
    death: boolean
    lengthForJujitsuBattlecry: number
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

const AnnouncementModule = ({ currentPlayer, victim, wounds, cardPlayed, weaponCardPlayed, actionCardPlayed, propertyCardPlayed, playerHit, parryPlayed, battlecryInfo, jujitsuInfo, playersData, bushidoWeapon, bushidoInfo, geishaInfo, death, lengthForJujitsuBattlecry }: AnnouncementModuleProps) => {

    const parry: PlayableCard =
    {
        type: 'action',
        name: 'Parry'
    }



    return (
        <div>
            {weaponCardPlayed &&
                <>
                    <p>{currentPlayer?.character.name} attacked {victim?.character.name} with {cardPlayed?.name} causing {wounds} wound(s)</p>
                    <p>Waiting to see if {victim?.character.name} will Parry</p>
                </>
            }

            {parryPlayed &&
                <p>{victim?.character.name} parried the attack from {currentPlayer?.character.name}</p>

            }

            {playerHit && <p>{victim?.character.name} took {wounds} wound(s) from {currentPlayer?.character.name}</p>}

            {cardPlayed?.name === "Divertion" && <p>{currentPlayer?.character.name} used {cardPlayed.name} against {victim?.character.name}</p>}

            {cardPlayed?.name === "Breathing" && <p>{currentPlayer?.character.name} used {cardPlayed.name} and healed to full health and chose {victim?.character.name} to draw a card</p>}




            {/* {cardPlayed?.name === 'Battlecry' && ((playersData.findIndex(player => player.character.name === 'Chiyome')) === -1 || (playersData.findIndex(player => player.character.name === 'Chiyome')) !== -1 && currentPlayer?.character.name === 'Chiyome') && battlecryInfo.length !== playersData.length - 1 && <p>{currentPlayer?.character.name} played {cardPlayed.name}. Waiting for players to discard a parry or take a wound.</p>}

            {cardPlayed?.name === 'Battlecry' && (playersData.findIndex(player => player.character.name === 'Chiyome')) !== -1 && currentPlayer?.character.name !== 'Chiyome' && battlecryInfo.length !== playersData.length - 2 && <p>{currentPlayer?.character.name} played {cardPlayed.name}. Waiting for players to discard a weapon or take a wound.</p>} */}

            {cardPlayed?.name === 'Battlecry' && battlecryInfo.length !== lengthForJujitsuBattlecry &&
                <p>{currentPlayer?.character.name} played {cardPlayed.name}. Waiting for players to discard a weapon or take a wound.</p>
            }




            {/* {cardPlayed?.name === 'Jujitsu' && ((playersData.findIndex(player => player.character.name === 'Chiyome')) === -1 || (playersData.findIndex(player => player.character.name === 'Chiyome')) !== -1 && currentPlayer?.character.name === 'Chiyome') && jujitsuInfo.length !== playersData.length - 1 && <p>{currentPlayer?.character.name} played {cardPlayed.name}. Waiting for players to discard a weapon or take a wound.</p>}

            {cardPlayed?.name === 'Jujitsu' && (playersData.findIndex(player => player.character.name === 'Chiyome')) !== -1 && currentPlayer?.character.name !== 'Chiyome' && jujitsuInfo.length !== playersData.length - 2 && <p>{currentPlayer?.character.name} played {cardPlayed.name}. Waiting for players to discard a weapon or take a wound.</p>} */}

            {cardPlayed?.name === 'Jujitsu' && jujitsuInfo.length !== lengthForJujitsuBattlecry &&
                <p>{currentPlayer?.character.name} played {cardPlayed.name}. Waiting for players to discard a weapon or take a wound.</p>
            }




            {cardPlayed?.name === 'Battlecry' && battlecryInfo.length === lengthForJujitsuBattlecry && <p>All players have resolved {currentPlayer?.character.name}'s battlecry</p>}

            {/* {cardPlayed?.name === 'Battlecry' && (playersData.findIndex(player => player.character.name === 'Chiyome')) !== -1 && currentPlayer?.character.name !== 'Chiyome' && battlecryInfo.length === playersData.length - 2 &&
                <p>All players have resolved {currentPlayer?.character.name}'s battlecry</p>
            } */}



            {cardPlayed?.name === 'Jujitsu' && jujitsuInfo.length === lengthForJujitsuBattlecry && <p>All players have resolved {currentPlayer?.character.name}'s jujitsu</p>}

            {/* {cardPlayed?.name === 'Jujitsu' && (playersData.findIndex(player => player.character.name === 'Chiyome')) !== -1 && currentPlayer?.character.name !== 'Chiyome' && jujitsuInfo.length === playersData.length - 2 &&
                <p>All players have resolved {currentPlayer?.character.name}'s jujitsu</p>
            } */}



            {cardPlayed?.name === 'Battlecry' && battlecryInfo.length > 0 && battlecryInfo.map((info, index) => {
                return <p key={index}>{info}</p>
            })}

            {cardPlayed?.name === 'Jujitsu' && jujitsuInfo.length > 0 && jujitsuInfo.map((info, index) => {
                return <p key={index}>{info}</p>
            })}

            {actionCardPlayed && cardPlayed?.name !== 'Divertion' && cardPlayed?.name !== 'Breathing' && cardPlayed?.name !== 'Battlecry' && cardPlayed?.name !== 'Jujitsu' && cardPlayed?.name !== 'Geisha' &&
                <p>{currentPlayer?.character.name} played {cardPlayed?.name}</p>
            }

            {geishaInfo &&
                <p>{geishaInfo}</p>
            }

            {propertyCardPlayed && cardPlayed?.name !== 'Bushido' && <p>{currentPlayer?.character.name} played {cardPlayed?.name}</p>}

            {propertyCardPlayed && cardPlayed?.name === 'Bushido' &&
                <p>{currentPlayer?.character.name} gave Bushido to {victim?.character.name}</p>
            }

            {bushidoWeapon === true &&
                <p>{currentPlayer?.character.name} flipped a weapon card for bushido. Waiting to see if {currentPlayer?.character.name} will discard a weapon or lose a honour point</p>
            }

            {bushidoWeapon === false &&
                <p>{currentPlayer?.character.name} did not flip  weapon card for bushido. Bushido is passed.</p>
            }

            {bushidoInfo &&
                <p>{bushidoInfo}</p>
            }

            {death &&
                <p>{currentPlayer?.character.name} defeated {victim?.character.name} and gained an honour point</p>
            }

        </div>
    );
};

export default AnnouncementModule;