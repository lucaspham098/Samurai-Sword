import React from 'react';

type IeyasuModuleProps = {
    drawCardFromDiscard: () => void
    drawCards: (number: number) => void
}


const IeyasuModule = ({ drawCardFromDiscard, drawCards }: IeyasuModuleProps) => {
    return (
        <div>
            <p>Draw your first card from the top of the draw pile? </p>
            <button onClick={() => drawCardFromDiscard()}>Yes</button>
            <button onClick={() => drawCards(2)}>No</button>
        </div>
    );
};

export default IeyasuModule;