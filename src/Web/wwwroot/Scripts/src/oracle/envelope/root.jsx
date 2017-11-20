import React, { Component } from 'react';
import { GET, POST, PUT, DELETE } from '../api.js';
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
        this.update = this.update.bind(this);
        this.editAmount = this.editAmount.bind(this);
        this.editDate = this.editDate.bind(this);
        this.addTransaction = this.addTransaction.bind(this);
        this.addAmount = this.addAmount.bind(this);
        this.addDate = this.addDate.bind(this);
        this.editAmountClick = this.editAmountClick.bind(this);
        //this.editDateFocus = this.editDate.bind(this);
        //this.onClick = this.onClick.bind(this);
    }

    async componentWillMount(){
        await this.load();
    }

    async load(){

        const getContainer = await GET.container(this.props.containerId);
        const container = getContainer.data.find(c => c._id == this.props.containerId);

        const getTransactions = await GET.transaction(this.props.containerId, 'container');
        const transactions = getTransactions.data;

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
                //begin: this.props.year + '-01-01',
                end: this.props.year + '-12-31'
            };
        } else {
            range = Object.assign({}, this.state.range);
        }

        for (let i = 0; i<transactions.length; i++){
            let theme = '';
            if (transactions[i].accounting == 'debit'){
                balance = balance - transactions[i].amount;
            } else {
                balance = balance + transactions[i].amount;
            }
            transactions[i].balance = balance;
            //transactions[i].theme = 'light';
            theme = 'light';

            let current = moment(transactions[i].date);
            
            if (i % 2 != 0){
                //transactions[i].theme = 'dark';
                theme = 'dark';
            }

            if (current.isAfter(now)){
                theme = theme + ' future';
            }

            transactions[i].theme = theme;
            //transactions[i].include = false;

            if (current.isBetween(range.begin, range.end, null, '[]')){
                transactions[i].include = true;
            }
            // if (current.isSameOrAfter(now) && once == 0){
            //     once = 1;
            //     index = i;
            // }
        }
       
        this.setState({
            transactions: transactions,
            parentId: container.parentId,
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

        //console.log('range = ', range);

        this.setState({
            range: range
        }, () => {
            this.load();
        });        
    }

    rowClick(target){

        let editing = Object.assign({}, this.state.editing);

        if (editing.id == target._id){
            editing.on = !editing.on;
        } else {
            editing = {
                id: target._id,
                date: target.date,
                amount: target.amount,
                on: true
            };
        }

        // if (!editing.id){
        //     editing = {
        //         id: target._id,
        //         date: target.date,
        //         amount: target.amount,
        //         on: true
        //     };
        // }

        console.log('editing = ', editing);

        this.setState({
            editing: editing
        }, ()  => {
            console.log('editing state =  ', this.state.editing);
        });

        // let editing = Object.assign({}, this.state.editing);

        // if (target._id == editing.id){
        //     editing.on = !editing.on;
        // } else {
        //     editing = {
        //         id: target._id,
        //         date: target.date,
        //         amount: target.amont,
        //         on: true
        //     };
        // }

        // if(target._id == this.state.editing.id){
        //     return;
        // }

        // let editing = {
        //     id: ''
        // };

        // if (!this.state.editing.id){
        //     editing = {
        //         id: target._id,
        //         date: target.date,
        //         amount: target.amont
        //     }

        // }

        // this.setState({
        //     editing: editing         
        // }, () => {
        //     console.log('editing state = ', this.state.editing);
        // });

    }

    renderRow(transaction, index){
        const grid = [];
        //console.log(this.state.editing, transaction._id);
        let mode = '';
        //console.log('render row', this.state.editing);
        if(transaction.include){

            const isEdit = this.state.editing.id == transaction._id && this.state.editing.on;
            //const readOnly = this.state.editing.id != transaction._id && !this.state.editing.on;
            //const readOnly = this.state.editing.id != transaction._id || !this.state.editing.on;
            //console.log(readOnly, this.state.editing, transaction._id);
            //const display = 'input';

            let dateTarget = !isEdit ? transaction.date : this.state.editing.date;
            let amountTarget = !isEdit ? transaction.amount : this.state.editing.amount;

            grid.push (<Date 
                id={transaction._id + 'date'}
                key={index + 'date'} 
                className="date" 
                value={dateTarget} 
                readOnly={!isEdit} 
                onBlur={this.editDate} 
            />);

            // if (transaction.theme != 'now'){
            //     grid.push (<Date key={index + 'date'} className="date" value={transaction.date} readOnly={readOnly} display={display} />);
            // } else {
            //     grid.push(<div key={index + 'date'}></div>);
            // }
            
            if (transaction.accounting == 'debit'){
                grid.push (<Dollars 
                    id={transaction._id}
                    key={index + 'dollars'} 
                    value={amountTarget} 
                    readOnly={!isEdit} 
                    onBlur={(amount) => this.editAmount(amount)} 
                    onClick={() => this.editAmountClick()}
                    editing={this.state.editing}
                />);
                grid.push (<div key={index + 'empty'}></div>);
            } else {
                grid.push (<div key={index + 'empty'}></div>);
                grid.push (<Dollars 
                    id={transaction._id}
                    key={index + 'dollars'} 
                    value={amountTarget} 
                    readOnly={!isEdit} 
                    onBlur={this.editAmount} 
                    onClick={() => this.editAmountClick()}
                    editing={this.state.editing}
                />);
            }

            let balance = 'black';
            if (transaction.balance < 0){
                balance = 'red';
            } 

            if(!isEdit){
                grid.push(<Dollars key={index + 'balance'} className={balance} value={transaction.balance} readOnly="true" />);
            } else {
                grid.push(<div className={'actions'} key={index + 'balance'}>
                    <a className={'update'} onClick={(e, mode) =>this.update(e, 'update')}>&#10004;</a>
                    <a className={'delete'} onClick={(e, mode) =>this.update(e, 'delete')}>&#10006;</a>
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

    async update(e, mode){
        //const value = e.target.value;
        //console.log(e, this.state.editing);
        //e.stopPropagation();
        
        const transactions = this.state.transactions.slice(0);
        const transaction = transactions.find(t => t._id == this.state.editing.id);

        switch (mode){
        case 'update':
            transaction.date = this.state.editing.date;
            transaction.amount = this.state.editing.amount;

            //POST.transaction(transaction);

            const getPair = await GET.transaction(transaction.pairId);
            const pair = getPair.data[0];
            
            if (pair){
                console.log('in = ', pair, this.state.editing);
                pair.date = this.state.editing.date;
                pair.amount = this.state.editing.amount;
                console.log('out = ', pair);
                //POST.transaction(pair);
            }

            console.log('post transaction = ', transaction);
            console.log('post pair = ', pair);
            
            break;
        case 'delete':
            DELETE.transaction(transaction);
            //transactions.splice(transactions.indexOf(transaction), 1);
            break;
        }

        //this.load();

        this.setState({
            async: true
        }, () => {
            this.load();
        });
        // this.setState({
        //     // transactions : transactions,
        //     // editing: {
        //     //     id: ''
        //     // },
        //     async: true
        // }, () => {
        // });

    }

    editAmount(amount) {
        const editing = Object.assign({}, this.state.editing);
        editing.amount = amount;
        this.setState({
            editing: editing
        }, () => {
            //console.log('amount edit; state editing = ', this.state.editing);
        });
    }

    editDate(date) {
        const editing = Object.assign({}, this.state.editing);
        editing.date = date;
        this.setState({
            editing: editing
        }, () => {
            //console.log('date edit; state editing = ', this.state.editing);
        });
    }

    addAmount(amount, identifier) {
        const adding = Object.assign({}, this.state.adding);
        adding.amount = amount;
        this.setState({
            adding: adding
        }, () => {
            //console.log('date add; state adding = ', this.state.adding, identifier);
        });
    }

    addDate(date, identifier){
        const adding = Object.assign({}, this.state.adding);
        adding.date = date;
        this.setState({
            adding: adding
        }, () => {
            //console.log('date add; state addining = ', this.state.adding, identifier);
        });
    }

    editAmountClick(){

        // const editing = Object.assign({}, this.state.editing);

        // editing.on = true;

        // this.setState({
        //     editing: editing
        // }, () => {
        //     console.log('editing dollar focus state = ', this.state.editing);
        // });
    }

    async addTransaction() {

        if (this.state.adding.amount <= 0){
            return;
        }

        const getId = await GET.objectId();
        const getPairId = await GET.objectId();

        const id = getId.data;
        const pairId = getPairId.data;

        
        const transaction = {
            _id: id,
            date: this.state.adding.date,
            amount: this.state.adding.amount,
            pairId: pairId,
            containerId: this.props.containerId,
            accounting: 'debit',
            doleId: '',
            pending: true
        };

        const pair = {
            _id: pairId,
            date: this.state.adding.date,
            amount: this.state.adding.amount,
            pairId: id,
            containerId: this.state.parentId,
            accounting: 'debit',
            doleId: '',
            pending: true
        };

        PUT.transaction(transaction);
        PUT.transaction(pair);

        this.setState({
            async: true
        }, () => {
            this.load();
        });

        //console.log('transactions = ', transaction, pair);
    }

    render() {
        //console.log(this.state.target);
        return <div className="envelope">
            {
                this.state.async &&                    
                    <div className="box range">
                        <label>start</label>
                        <label>end</label>
                        <Date 
                            identifier="begin"
                            value={this.state.range.begin} 
                            onBlur={this.dateUpdate}
                        />
                        <Date 
                            identifier="end"
                            value={this.state.range.end} 
                            onBlur={this.dateUpdate}
                        />
                    </div>
            }
            <div className="box ledger">
                <div key={'x'} className="row heading">
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
                        <div className="box form">
                            <Date 
                                value={this.state.adding.date} 
                                identifier="addDate"
                                onBlur={this.addDate}
                            />
                            <Dollars
                                value={this.state.adding.amount}
                                identifier="addDollars"
                                onBlur={this.addAmount}
                            />
                            <a onClick={this.addTransaction}>&#10010;</a>
                        </div>
            }
        </div>;
    }
}

export default Envelope;
