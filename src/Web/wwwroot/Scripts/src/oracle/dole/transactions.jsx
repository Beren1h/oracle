import React, { Component } from 'react';

class Transaction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            transactions: []
        };

        this.onChange = this.onChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.summary = this.summary.bind(this);
    }

    componentWillMount(){
        this.setState({
            transactions: this.props.transactions,
            summary: this.summary(this.props.transactions, this.props.parent)
        });
    }

    componentWillReceiveProps(nextProps){
        if (nextProps){
            this.setState({
                transactions: nextProps.transactions,
                summary: this.summary(nextProps.transactions, nextProps.parent)
            }, () => {
                //console.log('receive pendings = ', this.state.pendings);
            });
        }
    }

    componentDidUpdate(prevProps, prevState){
        for (let transaction of this.props.transactions){
            if (transaction.focus){
                const dom = document.getElementById(transaction.envelope._id);
                if (dom){
                    dom.focus();
                }
            }            
        }
    }

    onChange(e, transaction){
        const transactions = this.state.transactions.slice(0);
        const amount = e.target.value;
        
        const pair = transactions.find(t => t.pairId == transaction._id);

        transaction.amount = amount;
        pair.amount = amount;

        this.setState({
            transactions: transactions,
            summary: this.summary(transactions, this.props.parent)
        }, () => {
            // console.log(total);
        });
    }

    summary(transactions, parent){
        let total = 0;
        for (let transaction of transactions){
            if (transaction.containerId != parent.containerId){
                const amount = parseFloat(transaction.amount);
                total += amount;
            }
        }
        return {
            credit: parseFloat(parent.amount),
            debit: total,
            balance: parseFloat(parent.amount) - total
        };
    }

    handleFocus(e) {
        e.target.select();
    }

    render() {
        return <div>
            <h3>transactions</h3>
            <h3>{this.state.summary.credit}</h3>
            <h3>{this.state.summary.debit}</h3>
            <h3>{this.state.summary.balance}</h3>
            {
                this.state.transactions.map((transaction, index) => {
                    let display = '';
                    if (transaction.containerId != this.props.parent.containerId){
                        display = <div key={index}>
                            <a onClick={() => this.props.onHide(transaction)}>{transaction.envelope.name}</a>
                            <input id={transaction.envelope._id} type="text" onChange={(e) => this.onChange(e, transaction)} value={transaction.amount} onFocus={this.handleFocus} />
                        </div>;
                    }
                    return display;
                })
            }
        </div>;
    }
}

export default Transaction;
