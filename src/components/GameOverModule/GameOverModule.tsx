import React from 'react';


type GameOverModuleProps = {
    winner: string
    endGameInfo: string
}

const GameOverModule = ({ winner, endGameInfo }: GameOverModuleProps) => {
    return (
        <div>
            <h2>The Winning Team is {winner}</h2>
            <p>{endGameInfo}</p>
        </div>
    );
};

export default GameOverModule;