import React, { Component } from 'react';

class Transaction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            transactions: []
        };

        this.onChange = this.onChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps){
            this.setState({
                transactions: nextProps.transactions
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
            // if (transaction.dole.focus){
            //     const dom = document.getElementById(transaction.dole.envelope._id);
            //     if (dom){
            //         dom.focus();
            //     }
            // }
        }
        // this.props.transactions.forEach((transaction) => {
        //     if (pending.focus){
        //         const dom = document.getElementById(pending.envelope._id);
        //         if (dom){
        //             dom.focus();
        //         }
        //     }
        // });
    }


    onChange(e, transaction){
        const transactions = this.state.transactions.slice(0);
        const amount = e.target.value;
        
        console.log('t = ', transactions);
        const pair = transactions.find(t => t.pairId == transaction._id);

        transaction.amount = amount;
        pair.amount = amount;
        //transactions[index].amount = amount;

        this.setState({
            transactions: transactions
        });
    }

    handleFocus(e) {
        //console.log('SET FOCUS!!!');
        e.target.select();
    }

    render() {
        //console.log('render pendings = ', this.state.pendings);
        //console.log('rendering pendings');
        return <div>
            <h3>transactions</h3>
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
                    // if (transaction.containerId != this.props.parent.containerId){
                    //     return;
                    // }
                    // return <div key={index}>
                    //     <a onClick={() => this.props.onHide(transaction)}>{transaction.dole.envelope.name}</a>
                    //     <input id={transaction.dole.envelope._id} type="text" onChange={(e) => this.onChange(e, transaction)} value={transaction.amount} onFocus={this.handleFocus} />
                    //</div>;
                })
            }
        </div>;
    }
}

export default Transaction;
