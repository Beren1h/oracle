import React, { Component } from 'react';
import { GET, POST, PUT, DELETE } from '../api.js';
import Date from '../date.jsx';
import Dollars from '../dollars.jsx';
import Checkbox from '../checkbox.jsx';
import { SortByAlpha } from '../helper.js';
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

        this.load = this.load.bind(this);
        this.dateUpdate = this.dateUpdate.bind(this);
        this.rowClick = this.rowClick.bind(this);
        this.renderRow = this.renderRow.bind(this);
        //this.update = this.update.bind(this);
        //this.editAmount = this.editAmount.bind(this);
        //this.editDate = this.editDate.bind(this);
        this.put = this.put.bind(this);
        //this.addAmount = this.addAmount.bind(this);
        //this.addDate = this.addDate.bind(this);
        //this.editPending = this.editPending.bind(this);
        this.editing = this.editing.bind(this);
        this.adding = this.adding.bind(this);
        this.getEditingTransactions = this.getEditingTransactions.bind(this);
        this.post = this.post.bind(this);
        this.delete = this.delete.bind(this);
        this.reload = this.reload.bind(this);
        //this.getAxiosData = this.getAxiosData.bind(this);
    }

    async componentWillMount(){
        await this.load();
    }

    async load(){

        const containers = await GET.container(this.props.containerId);
        //console.log('container data = ', getContainer);
        //const container = getContainer.data.find(c => c._id == this.props.containerId);
        const container = containers.find(c => c._id == this.props.containerId);

        const transactions = await GET.transaction(this.props.containerId, 'container');
        //const getTransactions = await GET.transaction(this.props.containerId, 'container');
        //const transactions = getTransactions.data;

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
            range = Object.assign({}, this.state.range);
        }

        for (let i = 0; i<transactions.length; i++){
            let theme = '';

            if (container.type != 'account' || !transactions[i].pending){
                if (transactions[i].accounting == 'debit'){
                    balance = balance - transactions[i].amount;
                } else {
                    balance = balance + transactions[i].amount;
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
        }, () => {
            //console.log('state = ', this.state);
        });

    }


    dateUpdate(date, identifier){
        const range = Object.assign({}, this.state.range);

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

        //return;
        console.log('transaction _id = ', target._id);

        if (target.accounting != this.props.editable){
            return;
        }
        
        let editing = Object.assign({}, this.state.editing);
        
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
        }, ()  => {
            //console.log('editing state =  ', this.state.editing);
        });
    }

    renderRow(transaction, index){
        const grid = [];
        let mode = '';
        if(transaction.include){

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
                    //onBlur={(amount) => this.editAmount(amount)}
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
                    {/* <a className={'update'} onClick={(mode) =>this.update('update')}> */}
                    <a className={'post'} onClick={this.post}>
                        <i className="fa fa-check" />
                    </a>
                    {/* <a className={'delete'} onClick={(mode) =>this.update('delete')}> */}
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
        } else {
            //console.log('editing id = ', transaction._id);
            return '';
        }
    }

    async getEditingTransactions(){

        const transactions = [];

        const fromState = this.state.transactions.slice(0);
        const transaction = fromState.find(t => t._id == this.state.editing.id);

        transactions.push(transaction);
        
        if (transaction.pairId){
            const pair = await GET.transaction(transaction.pairId);
            //transactions.push(getPair.data[0]);
            transactions.push(pair[0]);
        }

        //console.log('editing transactions = ', transactions);

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

    // async update(mode){
       
    //     const transactions = this.state.transactions.slice(0);
    //     const transaction = transactions.find(t => t._id == this.state.editing.id);

    //     let pair;
        
    //     if (transaction.pairId){
    //         const getPair = await GET.transaction(transaction.pairId);
    //         pair = getPair.data[0];
    //     }
                    
    //     switch (mode){
    //     case 'update':
    //         transaction.date = this.state.editing.date;
    //         transaction.amount = this.state.editing.amount;
    //         transaction.pending = this.state.editing.pending;

    //         POST.transaction(transaction);
            
    //         if (pair){
    //             pair.date = this.state.editing.date;
    //             pair.amount = this.state.editing.amount;
    //             pair.pending = this.state.editing.pending;

    //             POST.transaction(pair);
    //         }
           
    //         break;
    //     case 'delete':
    //         DELETE.transaction(transaction);

    //         if (pair){
    //             DELETE.transaction(pair);
    //         }

    //         break;
    //     }

    //     this.getEditingTransactions();

    //     this.setState({
    //         async: true
    //     }, () => {
    //         this.load();
    //     });
    // }

    // editPending(pending){
    //     //console.log('parent pending = ', pending);
    //     const editing = Object.assign({}, this.state.editing);
    //     editing.pending = pending;
    //     this.setState({
    //         editing: editing
    //     }, () => {
    //         //console.log('amount edit; state editing = ', this.state.editing);
    //     });
    // }

    // editAmount(amount) {
    //     const editing = Object.assign({}, this.state.editing);
    //     editing.amount = amount;
    //     this.setState({
    //         editing: editing
    //     }, () => {
    //         //console.log('amount edit; state editing = ', this.state.editing);
    //     });
    // }

    // editDate(date) {
    //     const editing = Object.assign({}, this.state.editing);
    //     editing.date = date;
    //     this.setState({
    //         editing: editing
    //     }, () => {
    //         //console.log('date edit; state editing = ', this.state.editing);
    //     });
    // }

    // addAmount(amount, identifier) {
    //     const adding = Object.assign({}, this.state.adding);
    //     adding.amount = amount;
    //     this.setState({
    //         adding: adding
    //     }, () => {
    //         //console.log('date add; state adding = ', this.state.adding, identifier);
    //     });
    // }

    // addDate(date, identifier){
    //     const adding = Object.assign({}, this.state.adding);
    //     adding.date = date;
    //     this.setState({
    //         adding: adding
    //     }, () => {
    //         //console.log('date add; state addining = ', this.state.adding, identifier);
    //     });
    // }

    adding(value, identifier){
        const adding = Object.assign({}, this.state.adding);
        adding[identifier] = value;
        this.setState({
            adding: adding
        }, () => {
            //console.log('date edit; state editing = ', this.state.editing);
        });
    }

    editing(value, identifier){
        const editing = Object.assign({}, this.state.editing);
        editing[identifier] = value;
        this.setState({
            editing: editing
        }, () => {
            //console.log('date edit; state editing = ', this.state.editing);
        });
    }

    // async getAxiosData(call){
    //     const raw = await call();
    //     return raw.data();
    // }

    async put() {

        // don't save $0 transactions
        if (this.state.adding.amount <= 0){
            return;
        }

        //const id = await this.getAxiosData(GET.objectId);
        //const getId = await GET.objectId();
        //console.log('get id = ', getId);
        //const id = getId.data;
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

            //const getPairId = await GET.objectId();
            //pairId = getPairId.data;
            const pairId = await GET.objectId();

            const pair = Object.assign({}, shell);

            pair._id = pairId;
            pair.paidId  = id;
            pair.containerId = this.state.parentId;

            // const pair = {
            //     _id: pairId,
            //     date: this.state.adding.date,
            //     amount: this.state.adding.amount,
            //     pairId: id,
            //     containerId: this.state.parentId,
            //     accounting: this.props.editable,
            //     doleId: '',
            //     pending: true
            // };

            PUT.transaction(pair);
        }
        
        const transaction = Object.assign({}, shell);

        transaction._id = id;
        transaction.pairId = pairId;
        transaction.containerId = this.props.containerId;

        // const transaction = {
        //     _id: id,
        //     date: this.state.adding.date,
        //     amount: this.state.adding.amount,
        //     pairId: pairId,
        //     containerId: this.props.containerId,
        //     accounting: this.props.editable,
        //     doleId: '',
        //     pending: true
        // };

        PUT.transaction(transaction);

        this.reload();
        // this.setState({
        //     async: true
        // }, () => {
        //     this.load();
        // });
    }

    render() {
        return <div className="ledger">
            {
                this.state.async &&                    
                    <div className="range box narrow">
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
            <div className="detail box">
                <div key={'x'} className="row heading">
                    <div>clear</div>
                    <div>date</div>
                    <div>debit</div>
                    <div>credit</div>
                    <div>balance</div>
                </div>
                {
                    this.state.transactions.map((transaction, index) => {
                        return this.renderRow(transaction, index);
                    })
                }
            </div>
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
                        <a className="add" onClick={this.put}><i className="fa fa-plus" /></a>
                    </div>
            }
        </div>;
    }
}

export default Ledger;
