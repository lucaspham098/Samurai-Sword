import React from 'react';
import './HomeButton.scss'
import { useNavigate } from 'react-router-dom';


const HomeButton = () => {

    const navigate = useNavigate()

    const handleNavigateHome = () => {
        navigate('/')
    }

    return (
        <div className="home-button__container" onClick={handleNavigateHome}>
            <h1 className='home-button home-button--top'>SAMURAI</h1>
            <div className='home-button__divider'></div>
            <h1 className='home-button home-button--bottom'>SWORD</h1>
        </div>
    );
};

export default HomeButton;