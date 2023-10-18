import React, { useEffect } from 'react';

const TabTitleChanger = () => {

    useEffect(() => {
        document.title = 'Samurai Sword'
    }, [])

    return (
        <div>

        </div>
    );
};

export default TabTitleChanger;