import React from 'react';
import Pool from './pool.jsx';

const pools = (props) => {
    console.log('pool year = ', props.year);
    return (
        <div>
            <Pool year={props.year} />
        </div>
    );
};

export default pools;
