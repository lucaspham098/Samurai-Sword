import React from 'react';

type IeyasuModuleProps = {
    drawCardFromDiscard: () => void
    drawCards: (number: number) => void
    playersData: PlayersData[]
    currentPlayer: PlayersData | undefined
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

interface PlayableCard {
    type: string;
    name: string;
    range?: number;
    damage?: number;
}

const IeyasuModule = ({ drawCardFromDiscard, drawCards, playersData, currentPlayer }: IeyasuModuleProps) => {

    const handleDrawCards = () => {
        if (playersData.length === 3 && currentPlayer?.role.role === 'Shogun') {
            drawCards(3)
        } else {
            drawCards(2)
        }
    }

    return (
        <div className='choice-module'>
            <p className='choice-module__text'>Draw your first card from the top of the draw pile? </p>
            <div className="choice-module__button-container">
                <button className='button button--small' onClick={() => drawCardFromDiscard()}>Yes</button>
                <button className='button button--small' onClick={() => handleDrawCards()}>No</button>
            </div>
        </div>
    );
};

export default IeyasuModule;