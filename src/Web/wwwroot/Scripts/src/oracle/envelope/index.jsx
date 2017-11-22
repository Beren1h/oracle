import React from 'react';
//import Envelope from './root.jsx';
import Ledger from '../ledger/root.jsx';


const envelopes = (props) => {
    //console.log('accounts year = ', props.year);
    //console.log('accounts version = ', props.version);
    return (
        <div>
            <Ledger year={props.year} containerId={props.containerId} editable="debit" />
        </div>
    );
};

export default envelopes;
