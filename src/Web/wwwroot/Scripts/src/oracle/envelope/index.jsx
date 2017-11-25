import React from 'react';
import Ledger from '../ledger/root.jsx';


const envelopes = (props) => {
    return (
        <div>
            <Ledger year={props.year} containerId={props.containerId} editable="debit" />
        </div>
    );
};

export default envelopes;
