import React from 'react';
import Assignment from './assignment.jsx';

const assignments = (props) => {
    console.log('assignment year = ', props.year);
    return (
        <div>
            <Assignment year={props.year} />
        </div>
    );
};

export default assignments;
