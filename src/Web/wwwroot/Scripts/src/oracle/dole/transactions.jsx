import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import Dollars from '../dollars.jsx';
import { SortByAlpha } from '../helper.js';

class Transaction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            transactions: []
        };

        this.onChange = this.onChange.bind(this);
        this.summary = this.summary.bind(this);
    }

    componentWillMount(){
        this.setState({
            transactions: this.props.transactions,
            summary: this.summary(this.props.transactions, this.props.containerId, this.props.amount)
        });
    }

    componentWillReceiveProps(nextProps){
        if (nextProps){
            this.setState({
                transactions: nextProps.transactions.sort((a, b) => SortByAlpha(a.envelope.name, b.envelope.name)),
                summary: this.summary(nextProps.transactions, nextProps.containerId, nextProps.amount)
            }, () => {
                //console.log('receive pendings = ', this.state.pendings);
            });
        }
    }

    componentDidUpdate(prevProps, prevState){
        for (let transaction of this.props.transactions){
            if (transaction.focus){
                const dom = document.getElementById(transaction.envelope._id);
                //console.log('dom = ', dom, transaction);
                if (dom){
                    dom.focus();
                }
            }            
        }
    }

    onChange(amount, transaction){
        const transactions = this.state.transactions.slice(0);

        transaction.amount = amount;

        this.setState({
            transactions: transactions,
            summary: this.summary(transactions, this.props.containerId, this.props.amount)
        }, () => {
            // console.log(total);
        });
    }

    summary(transactions, containerId, amount){
        let total = 0;
        for (let transaction of transactions){
            if (transaction.containerId != containerId){
                const amount = parseFloat(transaction.amount);
                total += amount;
            }
        }
        return {
            credit: parseFloat(amount),
            debit: total,
            balance: parseFloat(amount) - total
        };
    }

    render() {
        return <div className={'transactions'}>
            <div className={'inputs'}>
                {
                    this.state.transactions.map((transaction, index) => {
                        let display = '';
                        if (transaction.containerId != this.props.containerId){
                            display = <div key={index} className={'input'}>
                                <Dollars id={transaction.envelope._id} value={transaction.amount} transaction={transaction} onChange={this.onChange} />
                                <a onClick={() => this.props.onHide(transaction)}>{transaction.envelope.name}</a>
                            </div>;
                        }
                        return display;
                    })
                }
                <div className="input summary2">
                    {
                        this.state.transactions.length > 0 &&
                            <NumberFormat 
                                value={this.state.summary.balance} 
                                displayType={'text'} 
                                thousandSeparator={true} 
                                prefix={'$'}
                                decimalPrecision={2}
                            />
                    }
                </div>
            </div>
        </div>;
    }
}

export default Transaction;
