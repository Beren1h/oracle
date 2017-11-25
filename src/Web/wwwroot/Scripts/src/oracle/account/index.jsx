import React from 'react';
import Ledger from '../ledger/root.jsx';


const accounts = (props) => {
    return (
        <div>
            <Ledger year={props.year} containerId={props.containerId} editable="credit" />
        </div>
    );
};

export default accounts;
