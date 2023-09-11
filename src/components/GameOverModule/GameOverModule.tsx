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
        <div className='game-over'>
            {!victoryOfTheSwordMaster &&
                <h1 className='game-over__title'>The Winning Team is {winner}</h1>
            }

            {victoryOfTheSwordMaster && !deadlyStrikeNinja && !deadlyStrikeShogun &&
                <h2 className='game-over__heading'>The Winning Team is {currentPlayer?.role.team} due to the Victory Of The Sword Master Rule</h2>
            }

            {victoryOfTheSwordMaster && (deadlyStrikeNinja || deadlyStrikeShogun) &&
                <h2 className='game-over__heading'>The Game ended due to the Victory Of The Sword Master Rule. The Winning Team is {winner} </h2>
            }


            <div className="game-over__score-container">
                <p className='game-over__score'>Team Shogun Honour Points : {teamShogunInfo}</p>
                <p className='game-over__score'>Team Ninja Honour Points : {teamNinjaInfo}</p>
                {teamRoninInfo &&
                    <p className='game-over__score'>Team Ronin Honour Points : {teamRoninInfo}</p>
                }
            </div>

            {deadlyStrikeNinja &&
                <p className='game-over__extra-info'>Team Ninja lost 3 honour points due to deadly strike rule</p>
            }

            {deadlyStrikeShogun &&
                <p className='game-over__extra-info'>Team Shogun lost 3 honour points due to deadly strike rule</p>
            }
        </div>
    );
};

export default GameOverModule;