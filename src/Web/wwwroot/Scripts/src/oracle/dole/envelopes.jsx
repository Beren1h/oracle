import React, { Component } from 'react';

class Envelopes extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return <div>
            <h3>envelopes</h3>
            {
                this.props.containers.map((envelope, index) => {
                    //console.log('map envelopes = ', envelope, index);
                    return <div key={index}>
                        <a onClick={() => this.props.createPending(index)}>{envelope.name}</a>
                    </div>;
                })
            }
        </div>;
    }
}

export default Envelopes;
//(e) => this.onChange('amount', index, e)
