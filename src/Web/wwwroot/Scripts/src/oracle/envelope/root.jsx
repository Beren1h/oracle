import React, { Component } from 'react';
import { GET } from '../api.js';
import Date from '../date.jsx';
import Dollars from '../dollars.jsx';
import { SortByAlpha } from '../helper.js';
import moment from 'moment';
import './envelope.scss';

class Envelope extends Component {
    constructor(props) {
        super(props);

        this.state = {
            async: false,
            transactions: [],
            rows: [],
        };

        this.load = this.load.bind(this);
    }

    async componentWillMount(){
        await this.load();
    }

    async load(){
        const getTransactions = await GET.transaction(this.props.containerId, 'container');
        const transactions = getTransactions.data;

        transactions.sort((a, b) => SortByAlpha(a.date, b.date));

        let balance = 0;


         for (let transaction of transactions){
             if (transaction.accounting == 'debit'){
                 balance = balance - transaction.amount;
             } else {
                 balance = balance + transaction.amount;
        
             }
             console.log(transaction.amount, transaction.accounting, balance);
             transaction.balance = balance;
         }

        
        this.setState({
            transactions: transactions
        });

    }


    render() {
        return <div className="containerx">
            <div className="head">
                range
            </div>
            <div className="body">
                <div className="ledger">
                {
                    this.state.transactions.map((transaction, index) => {
                        return <div key={index} className="row">
                            <Date value={transaction.date} display="text" />
                            {
                                transaction.accounting == 'debit' ?
                                    <div>
                                        <Dollars value={transaction.amount} display="text" />
                                        <span>x</span>
                                    </div> :
                                    <div>
                                        <span>x</span>
                                        <Dollars value={transaction.amount} display="text" />
                                    </div>
                                    
                            }
                            <Dollars value={transaction.balance} display="text" />
                        </div>;
                    })
                }
                </div>
                <div className="input">
                    form
                </div>
            </div>
        </div>;
    }
}

export default Envelope;
