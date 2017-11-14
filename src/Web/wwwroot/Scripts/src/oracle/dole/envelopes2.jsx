import React, { Component } from 'react';

class Envelopes extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        //console.log('envelope transactions = ', this.props.transactions);
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
                    //}
                })
                // this.props.containers.map((pending, index) => {
                //     if (!pending.display){
                //         return <div key={index}>
                //             <a onClick={() => this.props.createPending(pending.envelope._id)}>{pending.envelope.name}</a>
                //         </div>;
                //     }
                // })
            }
        </div>;
    }
}

export default Envelopes;
//(e) => this.onChange('amount', index, e)
