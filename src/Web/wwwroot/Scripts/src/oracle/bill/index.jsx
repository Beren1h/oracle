import React from 'react';
import Bill from './root.jsx';


const bill = (props) => {
    return (
        <div>
            <Bill 
                year = {props.year} 
            />        
        </div>
    );
};

export default bill;
