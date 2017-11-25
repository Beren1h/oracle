import React from 'react';
import Dole from './root.jsx';

const dole = (props) => {
    return (
        <div>
            <Dole 
                containerId = {props.containerId} 
                doleId = {props.doleId} 
                year = {props.year} 
            />
        </div>
    );
};

export default dole;