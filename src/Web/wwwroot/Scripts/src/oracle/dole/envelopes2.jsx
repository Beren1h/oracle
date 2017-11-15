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
                this.props.transactions.map((transaction, index) => {
                    let display = '';
                    if (transaction.containerId != this.props.parent.containerId){
                        display = <div key={index}>
                            <a onClick={() => this.props.onDisplay(transaction)}>{transaction.envelope.name}</a>
                        </div>;
                    }
                    return display;
                })
            }
        </div>;
    }
}

export default Envelopes;
