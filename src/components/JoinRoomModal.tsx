
import React, { FormEvent } from 'react';

type JoinRoomModalProps = {
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void
    errorMessage: string
}

const JoinRoomModal = ({ handleSubmit, errorMessage }: JoinRoomModalProps) => {

    return (
        <div>
            {!errorMessage ? (
                <form className='joinroom__form' onSubmit={handleSubmit}>
                    <label htmlFor="room">Room Code</label>
                    <input type="text" name='room' />
                    <button>Join</button>
                </form>
            ) :
                <p> {errorMessage}</p>}

        </div>
    );
};

export default JoinRoomModal;