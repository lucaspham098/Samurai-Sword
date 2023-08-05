import React from 'react';
import './GameOverModule.scss'

type GameOverModuleProps = {
    winner: string
    teamNinjaInfo: number | undefined
    teamShogunInfo: number | undefined
}

const GameOverModule = ({ winner, teamNinjaInfo, teamShogunInfo }: GameOverModuleProps) => {
    return (
        <div className='game-over-module'>
            <h2>The Winning Team is {winner}</h2>
            <p>Team Shogun scored {teamShogunInfo}</p>
            <p>Team Ninjs scored {teamNinjaInfo}</p>
        </div>
    );
};

export default GameOverModule;