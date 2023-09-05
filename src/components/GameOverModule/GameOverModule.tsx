import React from 'react';
import './GameOverModule.scss'

type GameOverModuleProps = {
    winner: string
    teamNinjaInfo: number | undefined
    teamShogunInfo: number | undefined
    teamRoninInfo: number | undefined
    deadlyStrikeNinja: boolean
    deadlyStrikeShogun: boolean
    victoryOfTheSwordMaster: boolean
    currentPlayer: PlayersData | undefined
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

const GameOverModule = ({ winner, teamNinjaInfo, teamShogunInfo, deadlyStrikeNinja, deadlyStrikeShogun, victoryOfTheSwordMaster, currentPlayer, teamRoninInfo }: GameOverModuleProps) => {
    return (
        <div className='game-over-module'>
            {victoryOfTheSwordMaster && !deadlyStrikeNinja && !deadlyStrikeShogun &&
                <h2>The Winning Team is {currentPlayer?.role.team} due to the Victory Of The Sword Master Rule</h2>
            }
            {victoryOfTheSwordMaster && (deadlyStrikeNinja || deadlyStrikeShogun) &&
                <h2>The Game ended due to the Victory Of The Sword Master Rule. The Winning Team is {winner} </h2>
            }
            {deadlyStrikeNinja &&
                <p>Team Ninja lost 3 honour points due to deadly strike rule</p>
            }
            {deadlyStrikeShogun &&
                <p>Team Shogun lost 3 honour points due to deadly strike rule</p>
            }
            {!victoryOfTheSwordMaster &&
                <h2>The Winning Team is {winner}</h2>
            }
            <p>Team Shogun scored {teamShogunInfo}</p>
            <p>Team Ninja scored {teamNinjaInfo}</p>
            {teamNinjaInfo &&
                <p>Team Ronin scored {teamRoninInfo}</p>
            }
        </div>
    );
};

export default GameOverModule;