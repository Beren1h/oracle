import React from 'react';
import Account from './root.jsx';


const accounts = (props) => {
    //console.log('accounts year = ', props.year);
    //console.log('accounts version = ', props.version);
    return (
        <div>
            <Account year={props.year} containerId={props.containerId} />
        </div>
    );
};

export default accounts;
