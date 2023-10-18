import './AnnouncementModule.scss'

type AnnouncementModuleProps = {
    newTurn: boolean
    emptyDrawDeck: boolean
    currentPlayer: PlayersData | undefined
    cardPlayedBy: PlayersData | undefined
    victim: PlayersData | undefined
    wounds: number | undefined
    cardPlayed: PlayableCard | undefined
    weaponCardPlayed: boolean
    actionCardPlayed: boolean
    propertyCardPlayed: boolean
    playerHit: boolean
    parryPlayed: boolean
    battlecryInfo: string[]
    jujitsuInfo: string[]
    playersData: PlayersData[]
    bushidoWeapon: boolean | undefined
    bushidoInfo: string | undefined
    geishaInfo: string | undefined
    death: boolean
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

const AnnouncementModule = ({ newTurn, emptyDrawDeck, currentPlayer, cardPlayedBy, victim, wounds, cardPlayed, weaponCardPlayed, actionCardPlayed, propertyCardPlayed, playerHit, parryPlayed, battlecryInfo, jujitsuInfo, bushidoWeapon, bushidoInfo, geishaInfo, death, battlecryJujitsuArray, battlecryJujitsuTurn }: AnnouncementModuleProps) => {

    return (
        <div className='announcement-module'>
            {newTurn === true &&
                <>
                    <p className='announcement-module__text'>It is {currentPlayer?.name}'s turn</p>
                </>
            }

            {weaponCardPlayed &&
                <>
                    <p className='announcement-module__text'>{cardPlayedBy?.name} attacked {victim?.name} with {cardPlayed?.name} causing <span className="emphasize">{wounds}</span> wound(s)</p>
                    <p className='announcement-module__text'>Waiting to see if {victim?.name} will Parry</p>
                </>
            }

            {parryPlayed &&
                <p className='announcement-module__text'>{victim?.name} parried the attack from {cardPlayedBy?.name}</p>

            }

            {playerHit && <p className='announcement-module__text'>{victim?.name} took <span className="emphasize">{wounds}</span> wound(s) from {cardPlayedBy?.name}</p>}

            {cardPlayed?.name === "Divertion" && <p className='announcement-module__text'>{cardPlayedBy?.name} used {cardPlayed.name} against {victim?.name}</p>}

            {cardPlayed?.name === "Breathing" && <p className='announcement-module__text'>{cardPlayedBy?.name} used {cardPlayed.name} and healed to full health and chose {victim?.name} to draw a card</p>}

            {cardPlayed?.name === 'Battlecry' && battlecryJujitsuArray.length > 0 &&
                <p className='announcement-module__text'>{cardPlayedBy?.name} played {cardPlayed.name}. Players will take turns discarding a Parry or suffering a wound. It is {battlecryJujitsuTurn?.name}'s turn to resolve Battlecry</p>
            }

            {cardPlayed?.name === 'Jujitsu' && battlecryJujitsuArray.length > 0 &&
                <p className='announcement-module__text'>{cardPlayedBy?.name} played {cardPlayed.name}. Players will take turns discarding a Weapon or suffering a wound. It is {battlecryJujitsuTurn?.name}'s turn to resolve the Jujitsu</p>
            }

            {cardPlayed?.name === 'Battlecry' && battlecryJujitsuArray.length === 0 && <p className='announcement-module__text'>All players have resolved {cardPlayedBy?.name}'s battlecry</p>}

            {cardPlayed?.name === 'Jujitsu' && battlecryJujitsuArray.length === 0 && <p className='announcement-module__text'>All players have resolved {cardPlayedBy?.name}'s jujitsu</p>}

            {cardPlayed?.name === 'Battlecry' && battlecryInfo.length > 0 && battlecryInfo.map((info, index) => {
                return <p key={index}>{info}</p>
            })}

            {cardPlayed?.name === 'Jujitsu' && jujitsuInfo.length > 0 && jujitsuInfo.map((info, index) => {
                return <p key={index}>{info}</p>
            })}

            {actionCardPlayed && !!cardPlayed && cardPlayed?.name !== 'Divertion' && cardPlayed?.name !== 'Breathing' && cardPlayed?.name !== 'Battlecry' && cardPlayed?.name !== 'Jujitsu' && cardPlayed?.name !== 'Geisha' &&
                <p className='announcement-module__text'>{cardPlayedBy?.name} played {cardPlayed?.name}</p>
            }

            {cardPlayed?.name === 'Geisha' && !geishaInfo &&
                <p className='announcement-module__text'> {cardPlayedBy?.name} used Geisha on {victim?.name}. Waiting to see what {cardPlayedBy?.name} will discard.</p>
            }

            {!!geishaInfo && cardPlayed?.name === 'Geisha' &&
                <p className='announcement-module__text'>{geishaInfo}</p>
            }

            {propertyCardPlayed && !!cardPlayed && cardPlayed?.name !== 'Bushido' && <p className='announcement-module__text'>{cardPlayedBy?.name} played {cardPlayed?.name}</p>}

            {propertyCardPlayed && cardPlayed?.name === 'Bushido' &&
                <p className='announcement-module__text'>{cardPlayedBy?.name} gave Bushido to {victim?.name}</p>
            }

            {bushidoWeapon === true &&
                <p className='announcement-module__text'>{currentPlayer?.name} flipped a weapon card for Bushido. Waiting to see if {currentPlayer?.name} will discard a weapon or lose an honour point</p>
            }

            {bushidoWeapon === false &&
                <p className='announcement-module__text'>{currentPlayer?.name} did not flip  weapon card for Bushido. Bushido is passed.</p>
            }

            {bushidoInfo &&
                <p className='announcement-module__text'>{bushidoInfo}</p>
            }

            {death &&
                <p className='announcement-module__text'>{currentPlayer?.name} defeated {victim?.name} and gained an honour point</p>
            }

            {emptyDrawDeck &&
                <p className='announcement-module__text'>The draw deck was emptied, everyone loss an honour point</p>
            }

        </div>
    );
};

export default AnnouncementModule;