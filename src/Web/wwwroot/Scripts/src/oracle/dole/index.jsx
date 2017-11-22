import React from 'react';
import Dole from './root.jsx';

const dole = (props) => {
    //console.log(props);
    //console.log('dole year = ', props.year);
    //console.log('dole version = ', props.version);
    //console.log('dole parent id = ', props.parentId);
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