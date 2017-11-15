import React, { Component } from 'react';

class Summary extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        //console.log('envelope transactions = ', this.props.transactions);
        // if (this.props.show){
        //     return <div>s</div>;
        // } else {
        //     return <div>x</div>;
        // }

        return <div>
            <h3>summary</h3>
            <h3>{this.props.parent.amount}</h3>
            {
                this.props.transactions.map((transaction, index) => {
                    let display = '';
                    if (transaction.containerId != this.props.parent.containerId){
                        display = transaction.amount;
                    }
                    return display;                })
            }
        </div>;
    }
}

export default Summary;
//(e) => this.onChange('amount', index, e)
