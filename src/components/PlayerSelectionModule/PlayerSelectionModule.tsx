import React from 'react';


type PlayerSelectionModuleProps = {
    selectingPlayer: boolean
    selectedCard: PlayableCard | undefined
}



interface PlayableCard {
    type: string;
    name: string;
    range?: number;
    damage?: number;
}

const PlayerSelectionModule = ({ selectingPlayer, selectedCard }: PlayerSelectionModuleProps) => {
    return (
        < >
            {selectingPlayer && selectedCard?.type === "weapon" &&
                <div className='choice-module'>
                    <p className='choice-module__text'> Select the player you would like to attack</p>
                </div>
            }
            {selectingPlayer && selectedCard?.name === "Divertion" &&
                <div className='choice-module'>
                    <p className='choice-module__text'> Select the player you would like to take a card from</p>
                </div>
            }
            {selectingPlayer && selectedCard?.name === "Breathing" &&
                <div className='choice-module'>
                    <p className='choice-module__text'> Select the player you would like to draw a card</p>
                </div>
            }
            {selectingPlayer && selectedCard?.name === "Geisha" &&
                <div className='choice-module'>
                    <p className='choice-module__text'> Select the player you would to remove a card from</p>
                </div>
            }
            {selectingPlayer && selectedCard?.name === "Bushido" &&
                <div className='choice-module'>
                    <p className='choice-module__text'> Select the player you would to give Bushido to</p>
                </div>
            }
        </>
    );
};

export default PlayerSelectionModule;