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
        <div>
            <p>Draw your first card from the top of the draw pile? </p>
            <button onClick={() => drawCardFromDiscard()}>Yes</button>
            <button onClick={() => handleDrawCards()}>No</button>
        </div>
    );
};

export default IeyasuModule;