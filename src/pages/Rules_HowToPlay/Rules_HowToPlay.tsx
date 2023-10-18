import React, { useState } from 'react';
import './Rules_HowToPlay.scss'
import back_button from '../../assets/images/icons/back_button.svg'
import rules_cover from '../../assets/images/rules/rules_cover.jpeg'
import rules_1 from '../../assets/images/rules/rules_1.jpeg'
import rules_2 from '../../assets/images/rules/rules_2.jpeg'
import rules_3 from '../../assets/images/rules/rules_3.jpeg'
import rules_4 from '../../assets/images/rules/rules_4.jpeg'
import rules_5 from '../../assets/images/rules/rules_5.jpeg'
import rules_6 from '../../assets/images/rules/rules_6.jpeg'
import rules_7 from '../../assets/images/rules/rules_7.jpeg'
import rules_8 from '../../assets/images/rules/rules_8.jpeg'
import rules_9 from '../../assets/images/rules/rules_9.jpeg'
import rules_10 from '../../assets/images/rules/rules_10.jpeg'
import HomeButton from '../../components/HomeButton/HomeButton';
import TabTitleChanger from '../../components/TabTitleChanger/TabTitleChanger';

const Rules_HowToPlay = () => {

    const [page, setPage] = useState<number>(0)

    const ruleBook = [
        {
            img: rules_cover,
            id: 1
        },
        {
            img: rules_1,
            id: 2
        },
        {
            img: rules_2,
            id: 3
        },
        {
            img: rules_3,
            id: 4
        },
        {
            img: rules_4,
            id: 5
        },
        {
            img: rules_5,
            id: 6
        },
        {
            img: rules_6,
            id: 7
        },
        {
            img: rules_7,
            id: 8
        },
        {
            img: rules_8,
            id: 9
        },
        {
            img: rules_9,
            id: 10
        },
        {
            img: rules_10,
            id: 11
        },
    ]

    const handlePageForward = () => {
        if (!!ruleBook[page + 1]) {
            setPage(page + 1)
        }
    }
    const handlePageBackward = () => {
        if (!!ruleBook[page - 1]) {
            setPage(page - 1)
        }
    }

    return (
        <div>
            <TabTitleChanger />
            <HomeButton />

            <h1 className='rules__title'>Rules & How To Play</h1>

            <h2 className='rules__heading'>How To Play</h2>
            <ul className="rules__text-container">
                <li className='rules__text'>hover over cards, character cards, role cards to enlarge them for easier reading</li>
                <li className='rules__text'>click on a card to play card</li>
                <li className='rules__text'>if card requires target to be picked, click card first then click target's character card</li>
                <li className='rules__text'>red highlighter shows whos turn it is</li>
                <li className='rules__text'>end turn by pressing end turn button</li>
            </ul>

            <h2 className='rules__heading'>Rule Book</h2>
            <div className="rules__img-container">
                <img className='rules__img' src={ruleBook[page].img} />
            </div>
            <h3 className='rules__subheading'>{ruleBook[page].id}/11</h3>
            <div className="rules__button-container">
                <img src={back_button} onClick={handlePageBackward} className='rules__button' />
                <img src={back_button} onClick={handlePageForward} className='rules__button rules__button--mirrored' />
            </div>

        </div>
    );
};

export default Rules_HowToPlay;