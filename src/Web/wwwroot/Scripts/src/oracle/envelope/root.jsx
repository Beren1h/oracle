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
        this.makeGrid = this.makeGrid.bind(this);
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

    makeGrid(){
        const grid = [];

        for (let transaction of this.state.transactions){
            const item = {
                date: transaction.date,
                balance: transaction.balance
            };

            if (transaction.accounting == 'debit'){
                item.credit = 'x',
                item.debit = transaction.amount;
            } else {
                item.debit = 'x',
                item.credit = transaction.amount;
            }
        }

        return <div className="box ledger">
            {
                this.makeA()
            }
        </div>;
    }

    render() {
        return <div className="envelope">
                <div className="box range">range</div>
                    {/* <div className="box ledger">
                        <div className="row">
                            <div>date</div>
                            <div className="accounting">
                                <div>c</div>
                                <div>d</div>
                            </div>
                            <div>balance</div>
                        </div>
                        <div className="row">
                        </div>
                    </div> */}
                    <div className="box ledger">
                        <div className="heading">date</div>
                        <div className="heading">debit</div>
                        <div className="heading">credit</div>
                        <div className="heading">balance</div>
                        {
                            this.state.transactions.map((transaction) => {
                                const grid = [];
                                grid.push (<Date className="date" value={transaction.date} display="text" />);
                                if (transaction.accounting == 'debit'){
                                    grid.push (<Dollars value={transaction.amount} display="text" />);
                                    grid.push (<div></div>);
                                } else {
                                    grid.push (<div></div>);
                                    grid.push (<Dollars value={transaction.amount} display="text" />);
                                }
                                grid.push(<Dollars className="balance" value={transaction.balance} display="text" />);
                                return grid;
                            })
                        }
                    </div>                    
                <div className="box form">form</div>
            </div>;
    //     return <div className="containerx">
    //         <div className="header">
    //             range
    //         </div>
    //         <div className="ledger">
    //         {
    //             this.state.transactions.map((transaction, index) => {
    //                 return <div key={index} className="row">
    //                     <Date className="date" value={transaction.date} display="text" />
    //                     {
    //                         transaction.accounting == 'debit' ?
    //                                 <Dollars className="debit" value={transaction.amount} display="text" />
    //                                 :
    //                                 <Dollars className="credit" value={transaction.amount} display="text" />
                                
    //                     }
    //                     <Dollars className="balance" value={transaction.balance} display="text" />
    //                 </div>;
    //             })
    //         }
    //         </div>
    //         <div className="input">
    //             form
    //         </div>
    //     </div>;
    }
}

export default Envelope;
