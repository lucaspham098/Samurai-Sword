import './JoinRoomModal.scss'
import exit_button from '../assets/images/icons/exit_button.svg'
import React, { FormEvent } from 'react';

type JoinRoomModalProps = {
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void
    errorMessage: string
    handleCloseModal: () => void
    handleRemoveError: () => void
}

const JoinRoomModal = ({ handleSubmit, errorMessage, handleCloseModal, handleRemoveError }: JoinRoomModalProps) => {

    return (
        <div>
            <form className='joinroom__form' onSubmit={handleSubmit}>
                <img className='joinroom__form-button' src={exit_button} alt="back button" onClick={() => { handleCloseModal() }} />
                <label className='joinroom__form-label' htmlFor="room" >Room Code</label>
                <input className='joinroom__form-input' type="text" name='room' onChange={() => { handleRemoveError() }} />
                <button className='button button--form'>Join</button>
                {errorMessage !== '' &&
                    <p className='joinroom__form-error'> {errorMessage}</p>
                }
            </form>
        </div>
    );
};

export default JoinRoomModal;