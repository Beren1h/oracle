import React, { Component } from 'react';
import { GET } from '../api.js';
import Date from '../date.jsx';
import Dollars from '../dollars.jsx';

class Envelope extends Component {
    constructor(props) {
        super(props);

        this.state = {
            async: false,
            transactions: []
        };

        this.load = this.load.bind(this);
    }

    async componentWillMount(){
        await this.load();
    }

    async load(){
        const getTransactions = await GET.transaction(this.props.containerId, 'container');
        const transactions = getTransactions.data;
        
        this.setState({
            transactions: transactions
        });

    }


    render() {
        return <div>
            {
                this.state.transactions.map((transaction, index) => {
                    return <div key={index}>
                        <div>{transaction.date}</div>
                        {
                            transaction.accounting == 'debit' ?
                                <div>
                                    <div>debit</div>
                                    <div>x</div>
                                </div> :
                                <div>
                                    <div>x</div>
                                    <div>credit</div>
                                </div>
                                
                        }
                        <div>balance</div>
                    </div>;
                })
            }
        </div>;
    }
}

export default Envelope;
