import React from 'react';
import './BattlecryJujitsuAnnouncementModule.scss'

type BattlecryJujitsuAnnouncementModuleProps = {
    cardPlayed: PlayableCard
    cardPlayedBy: PlayersData | undefined
    battlecryInfo: string[]
    jujitsuInfo: string[]
    battlecryJujitsuArray: PlayersData[]
    battlecryJujitsuTurn: PlayersData | undefined
}

interface PlayableCard {
    type: string;
    name: string;
    range?: number;
    damage?: number;
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

const BattlecryJujitsuAnnouncementModule = ({ cardPlayed, cardPlayedBy, battlecryInfo, jujitsuInfo, battlecryJujitsuTurn, battlecryJujitsuArray }: BattlecryJujitsuAnnouncementModuleProps) => {
    return (
        <div className='battlecry-jujitsu-module'>

            {cardPlayed.name === 'Battlecry' && battlecryJujitsuArray.length > 0 &&
                <h2 className='battlecry-jujitsu-module__title'>It is {battlecryJujitsuTurn?.name}'s turn to resolve {cardPlayedBy?.name}'s Battlecry</h2>
            }

            {cardPlayed.name === 'Battlecry' && battlecryJujitsuArray.length === 0 &&
                <h2 className='battlecry-jujitsu-module__title'>All players have resolved {cardPlayedBy?.name}'s Battlecry</h2>
            }

            {cardPlayed.name === 'Battlecry' && battlecryInfo.length < 0 &&
                battlecryInfo.map((info, index) => {
                    return <p className='battlecry-jujitsu-module__text' key={index}>{info}</p>
                })
            }

            {cardPlayed.name === 'Jujitsu' && battlecryJujitsuArray.length > 0 &&
                <h2 className='battlecry-jujitsu-module__title'>It is {battlecryJujitsuTurn?.name}'s turn to resolve {cardPlayedBy?.name}'s Jujitsu</h2>
            }

            {cardPlayed.name === 'Battlecry' && battlecryJujitsuArray.length === 0 &&
                <h2 className='battlecry-jujitsu-module__title'>All players have resolved {cardPlayedBy?.name}'s Jujitsu</h2>
            }

            {cardPlayed.name === 'Battlecry' && jujitsuInfo.length < 0 &&
                jujitsuInfo.map((info, index) => {
                    return <p className='battlecry-jujitsu-module__text' key={index}>{info}</p>
                })
            }

        </div>
    );
};

export default BattlecryJujitsuAnnouncementModule;