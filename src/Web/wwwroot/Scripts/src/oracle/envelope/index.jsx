import React from 'react';
import Envelope from './root.jsx';


const envelopes = (props) => {
    //console.log('accounts year = ', props.year);
    //console.log('accounts version = ', props.version);
    return (
        <div>
            <Envelope year={props.year} containerId={props.container} />
        </div>
    );
};

export default envelopes;
