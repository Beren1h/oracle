import React from 'react';
//import Envelope from './root.jsx';
import Dash from './root.jsx';


const dash = (props) => {
    //console.log('accounts year = ', props.year);
    //console.log('accounts version = ', props.version);
    return (
        <div>
            <Dash 
                year = {props.year} 
            />        
        </div>
    );
};

export default dash;
