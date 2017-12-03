import React, { Component } from 'react';
import { GET, POST, PUT, DELETE } from '../api.js';
import Date from '../date.jsx';
import Dollars from '../dollars.jsx';
import Checkbox from '../checkbox.jsx';
import { SortByAlpha, Round } from '../helper.js';
import moment from 'moment';
import './ledger.scss';

class Ledger extends Component {
    constructor(props) {
        super(props);

        this.state = {
            async: false,
            parentId: '',
            transactions: [],
            pairs: [],
            range: {
                begin: '',
                end: ''
            },
            adding: {
                date: '',
                amount: 0
            },
            editing: {
                id: '',
                on: false
            }
        };

        this.dateUpdate = this.dateUpdate.bind(this);
        this.rowClick = this.rowClick.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.editing = this.editing.bind(this);
        this.adding = this.adding.bind(this);
        this.getEditingTransactions = this.getEditingTransactions.bind(this);
        this.put = this.put.bind(this);
        this.post = this.post.bind(this);
        this.delete = this.delete.bind(this);
        this.load = this.load.bind(this);
        this.reload = this.reload.bind(this);
        this.renderDetail = this.renderDetail.bind(this);
    }

    async componentWillMount(){
        await this.load();
    }

    componentDidUpdate(){
        const h0 = document.documentElement.clientHeight;
        const h1 = window.screen.height;
        const h2 = document.querySelector('.range').clientHeight;
        const h3 = document.querySelector('.form').clientHeight;
        const h4 = document.querySelector('.detail').clientHeight;
        const h5 = document.querySelector('.ledger').clientHeight;
        console.log('client h = ', h0);
        console.log('window h = ', h1);
        console.log('range h = ', h2);
        console.log('form h = ', h3);
        console.log('detail h = ', h4);
        console.log('ledger h = ', h5);
        console.log('differental = ', h0 - (h2 + h3 + h4));
        console.log('differental 2 = ', h5 - (h2 + h3 + h4));
        
    }

    async load(){

        const containers = await GET.container(this.props.containerId);
        const container = containers.find(c => c._id == this.props.containerId);

        const transactions = await GET.transaction(this.props.containerId, 'container');

        transactions.sort((a, b) => SortByAlpha(a.date, b.date));

        let balance = 0;
        let now = moment();
        let once = 0;
        let index = 0;
        let range = {};
        let pairs = [];
        
        if (!this.state.range.begin){
            range = {
                begin: moment().subtract(14, 'days').format('YYYY-MM-DD'),
                end: this.props.year + '-12-31'
            };
        } else {
            range = {...this.state.range};
        }

        for (let i = 0; i<transactions.length; i++){
            let theme = '';

            if (container.type != 'account' || !transactions[i].pending){
                if (transactions[i].accounting == 'debit'){
                    balance = Round(balance) - Round(transactions[i].amount);
                } else {
                    balance = Round(balance) + Round(transactions[i].amount);
                }
            }

            transactions[i].balance = balance;
            theme = 'light';

            let current = moment(transactions[i].date);
            
            if (i % 2 != 0){
                theme = 'dark';
            }

            if (current.isAfter(now)){
                theme = theme + ' future';
                if (once == 0){
                    theme = theme + ' divider';
                    once = 1;
                }
            }

            transactions[i].theme = theme;

            if (current.isBetween(range.begin, range.end, null, '[]')){
                transactions[i].include = true;
            }
        }
       
        this.setState({
            transactions: transactions,
            parentId: container.parentId,
            container: container,
            async: true,
            range: range,
            adding: {
                date: now.format('YYYY-MM-DD'),
                amount: 0
            },
            editing: {
                id: '',
                on: false
            }
        });

    }


    dateUpdate(date, identifier){
        const range = {...this.state.range};

        if (identifier == 'begin'){
            range.begin = date;
        } else {
            range.end = date;
        }

        this.setState({
            range: range
        }, () => {
            this.load();
        });        
    }

    rowClick(target){

        // leave this one; easy access to transaction ids
        console.log('transaction _id = ', target._id);

        if (target.accounting != this.props.editable){
            return;
        }
        
        let editing = {...this.state.editing};
        
        if (editing.id == target._id){
            editing.on = !editing.on;
        } else {
            editing = {
                id: target._id,
                date: target.date,
                amount: target.amount,
                pending: target.pending,
                on: true
            };
        }

        this.setState({
            editing: editing
        });
    }

    async getEditingTransactions(){

        const transactions = [];

        const fromState = this.state.transactions.slice(0);
        const transaction = fromState.find(t => t._id == this.state.editing.id);

        transactions.push(transaction);
        
        if (transaction.pairId){
            const pair = await GET.transaction(transaction.pairId);
            transactions.push(pair[0]);
        }

        return transactions;
    }

    reload(){
        this.setState({
            async: true
        }, () => {
            this.load();
        });
    }

    async delete(){
        const transactions = await this.getEditingTransactions();
        
        for (let transaction of transactions){
            DELETE.transaction(transaction);
        }

        this.reload();
    }

    async post(){
        const transactions = await this.getEditingTransactions();

        for (let transaction of transactions){
            transaction.date = this.state.editing.date;
            transaction.amount = this.state.editing.amount;
            transaction.pending = this.state.editing.pending;
            
            POST.transaction(transaction);
        }

        this.reload();
    }

    adding(value, identifier){
        const adding = {...this.state.adding};
        adding[identifier] = value;
        this.setState({
            adding: adding
        });
    }

    editing(value, identifier){
        const editing = {...this.state.editing};
        editing[identifier] = value;
        this.setState({
            editing: editing
        });
    }

    async put() {

        // don't save $0 transactions
        if (this.state.adding.amount <= 0){
            return;
        }

        const id = await GET.objectId();

        let pairId = '';

        const shell = {
            _id: '',
            date: this.state.adding.date,
            amount: this.state.adding.amount,
            pairId: '',
            containerId: '',
            accounting: this.props.editable,
            doleId: '',
            pending: true            
        };

        if (this.state.container.type == 'envelope'){

            pairId = await GET.objectId();

            const pair = {...shell};

            pair._id = pairId;
            pair.pairId  = id;
            pair.containerId = this.state.parentId;

            PUT.transaction(pair);
        }
        
        const transaction = {...shell};

        transaction._id = id;
        transaction.pairId = pairId;
        transaction.containerId = this.props.containerId;

        PUT.transaction(transaction);

        this.reload();
    }

    renderDetail(){
        const content = [];
        const detail = 
            <div key="detail" className="detail">
                <div className="header">
                    <div>clear</div>
                    <div>date</div>
                    <div>debit</div>
                    <div>credit</div>
                    <div>balance</div>
                </div>
                <div className="scroller">
                    {
                        this.state.transactions.map((transaction, index) => {
                            return this.renderRow(transaction, index);
                        })
                    } 
                </div>
            </div>;

        content.push(detail);

        return content;
    }

    renderRow(transaction, index){
        const grid = [];
        let mode = '';

        if(!transaction.include){
            return <div></div>;
        }

        const isEdit = this.state.editing.id == transaction._id && this.state.editing.on;

        let dateTarget = !isEdit ? transaction.date : this.state.editing.date;
        let amountTarget = !isEdit ? transaction.amount : this.state.editing.amount;
        let pendingTarget = !isEdit ? transaction.pending : this.state.editing.pending;

        grid.push(<Checkbox 
            key={index + 'pending'}
            className="pending" 
            checked={pendingTarget} 
            isEdit={isEdit}
            identifier="pending" 
            onChange={this.editing} />
        );

        grid.push (
            <Date 
                id={transaction._id + 'date'}
                key={index + 'date'} 
                className="date" 
                value={dateTarget} 
                isEdit={isEdit}
                identifier="date" 
                onBlur={this.editing} 
            />
        );
        
        if (transaction.accounting == 'debit'){
            grid.push (<Dollars 
                id={transaction._id}
                key={index + 'dollars'} 
                value={amountTarget} 
                isEdit={isEdit} 
                identifier="amount"
                onBlur={this.editing} 
            />);
            grid.push (<div key={index + 'empty'}></div>);
        } else {
            grid.push (<div key={index + 'empty'}></div>);
            grid.push (<Dollars 
                id={transaction._id}
                key={index + 'dollars'} 
                value={amountTarget} 
                isEdit={isEdit} 
                identifier="amount"
                onBlur={this.editing} 
            />);
        }

        let balance = 'black';
        if (transaction.balance < 0){
            balance = 'red';
        } 

        if(!isEdit){
            grid.push(<Dollars 
                key={index + 'balance'} 
                className={balance} 
                value={transaction.balance} 
                isEdit={false} />);
        } else {
            grid.push(<div className={'actions'} key={index + 'balance'}>
                <a className={'post'} onClick={this.post}>
                    <i className="fa fa-check" />
                </a>
                <a className={'delete'} onClick={this.delete}>
                    <i className="fa fa-times" />
                </a>
            </div>);
            mode = 'edit';
        }

        return <div key={index} 
            className={'row ' + transaction.theme + ' ' + mode}
            onClick={() => this.rowClick(transaction)} >
            {grid}
        </div>;
    }
    
    render() {
        return (
            <div className="ledger">
                {
                    this.state.async &&
                        <div className="range">
                            <div className="tag">{this.state.container.name} {this.state.container.type}</div>
                            <div>
                                <Date 
                                    identifier="begin"
                                    value={this.state.range.begin} 
                                    onBlur={this.dateUpdate}
                                /> <span>to</span>
                                <Date 
                                    identifier="end"
                                    value={this.state.range.end} 
                                    onBlur={this.dateUpdate}
                                />
                            </div>
                        </div>
                }
                {
                    this.state.async &&
                        this.renderDetail()
                }
                {
                    this.state.async &&
                        <div className="form">
                            <Date
                                className="date"
                                value={this.state.adding.date} 
                                identifier="date"
                                onBlur={this.adding}
                            />
                            <Dollars
                                className={this.props.editable}
                                value={this.state.adding.amount}
                                identifier="amount"
                                onBlur={this.adding}
                            />
                            <a className="add" onClick={this.put}>
                                <i className="fa fa-plus" />
                            </a>
                        </div>
                }
            </div>
        );
    }
}

export default Ledger;
