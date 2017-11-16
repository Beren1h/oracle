import React, { Component } from 'react';

class Envelopes extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {

        return <div className={'envelopes'}>
            <div className={'inputs'}>
            {
                this.props.transactions.map((transaction, index) => {
                    let display = '';
                    if (transaction.containerId != this.props.containerId){
                        display = <div key={index} className={'input'}>
                            <a onClick={() => this.props.onDisplay(transaction)}>{transaction.envelope.name}</a>
                        </div>;
                    }
                    return display;
                })
            }
            </div>
        </div>;
    }
}

export default Envelopes;
