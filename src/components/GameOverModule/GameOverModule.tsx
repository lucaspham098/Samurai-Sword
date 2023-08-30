import React from 'react';
import './GameOverModule.scss'

type GameOverModuleProps = {
    winner: string
    teamNinjaInfo: number | undefined
    teamShogunInfo: number | undefined
    deadlyStrikeNinja: boolean
}

const GameOverModule = ({ winner, teamNinjaInfo, teamShogunInfo, deadlyStrikeNinja }: GameOverModuleProps) => {
    return (
        <div className='game-over-module'>
            {deadlyStrikeNinja &&
                <p>Ninja team lost 3 honour points due to deadly strike rule</p>
            }
            <h2>The Winning Team is {winner}</h2>
            <p>Team Shogun scored {teamShogunInfo}</p>
            <p>Team Ninjas scored {teamNinjaInfo}</p>
        </div>
    );
};

export default GameOverModule;