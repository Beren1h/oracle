import React, { Component } from 'react';
import { GetContainers, GetDole, GetTransactionDole, GetObjectId, GetTransaction, PostTransaction, PutTransaction, DeleteTransaction  } from '../api.js';
import Envelopes from './envelopes2.jsx';
import Transactions from './transactions.jsx';
import Summary from './summary.jsx';
import moment from 'moment';
import './dole.scss';
import Date from '../date.jsx';
import Dollars from '../dollars.jsx';

//import InputMask from 'react-input-mask';

import NumberFormat from 'react-number-format';

class Dole extends Component {
    constructor(props) {
        super(props);

        this.state = {
            async: false,
            date: '',
            //mmdd: '',
            amount: 0,
            show: true,
            parent: {},
            transactions: [],
            envelopes: []
        };

        this.generateObjectId = this.generateObjectId.bind(this);
        this.createTransactionPair = this.createTransactionPair.bind(this);
        this.getTransactionSlice = this.getTransactionSlice.bind(this);
        this.onDisplay = this.onDisplay.bind(this);
        this.onHide = this.onHide.bind(this);
        this.dateUpdate = this.dateUpdate.bind(this);
        this.dollarsUpdate = this.dollarsUpdate.bind(this);
        // this.onChange = this.onChange.bind(this);
        // this.onBlur = this.onBlur.bind(this);
        // this.onFocus = this.onFocus.bind(this);
        this.save = this.save.bind(this);
        this.load = this.load.bind(this);

    }

    async componentWillMount(){
        await this.load();
    }

    async load(){
        //let parent = {};
        //let date = '';
        //let amount = 0;
        //let mmdd = '';
        let envelopes = [];
        let transactions = [];
        let dole = {
            //_id:
            //date: '',
            //amount: 0,
            //verb: ''
        };

        const getContainers = await GetContainers();
        envelopes = getContainers.data.filter(c => c.type == 'envelope');

        const getDole = await GetDole(this.props.doleId);
        dole = getDole.data[0];

        if (dole){
            //date = dole.date;
            //amount = dole.amount;
            dole = dole;
            dole.verb = 'put';
        } else {
            dole = {
                _id:  await this.generateObjectId(),
                date: moment(this.props.year + '-' + moment().format('MM-DD')).format('YYYY-MM-DD'),
                amount: 0,
                containerId: this.props.doleId,
                verb: 'put'
            };
            //date = moment(this.props.year + '-' + moment().format('MM-DD')).format('YYYY-MM-DD');
        }

        //console.log(date, amount);
        //const getTransaction = await GetTransaction(this.props.parentId);
        //parent = getTransaction.data[0];
        
        //if (!parent.doleId){
        //    parent.doleId = await this.generateObjectId();
        //} 

        const getTransactions = await GetTransactionDole(this.props.doleId);
        transactions = getTransactions.data;

        // if (!this.props.isNew){
        //     date = moment(transactions[0].date).format('MM-DD');
        // } else {

        // }

        //date = !this.props.isNew ? moment(transactions[0].date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        //mmdd = moment(date).format('MM-DD');
        
        //console.log('date = ', date);

        for (let envelope of envelopes) {
            const credit = transactions.find(t => t.containerId == envelope._id);
            if (credit){
                const debit = transactions.find(t => t.pairId == credit._id);
                debit.verb = 'post';
                credit.verb = 'post';
                credit.focus = false;
                credit.envelope = envelope;
            } else {
                const pair = await this.createTransactionPair(date, envelope);
                transactions.push(pair[0]);
                transactions.push(pair[1]);
            }
        }

        this.setState ({
            //parent: parent,
            //containerId: this.props.containerId, 
            date: date,
            amount: amount,
            dole: dole,
            //mmdd: mmdd,
            transactions: transactions,
            envelopes: envelopes,
            show: true,
            async: true
        }, () => {
            console.log('state = ', this.state);
        });
    }

    async createTransactionPair(date, envelope){

        const id0 = await this.generateObjectId();
        const id1 = await this.generateObjectId();

        const transaction0 = {
            _id: id0,
            date: date,
            amount: 0,
            pairId: id1,
            containerId: this.props.containerId,
            accounting: 'debit',
            doleId: this.props.doleId,
            pending: true,
            verb: 'ignore'
        };
        const transaction1 = {
            _id: id1,
            date: date,
            amount: 0,
            pairId: id0,
            containerId: envelope._id,
            accounting: 'credit',
            doleId: this.props.doleId,
            pending: false,
            verb: 'ignore',
            envelope: envelope,
            focus: false
        };

        return [transaction0, transaction1];
    }

    async generateObjectId(){
        const response = await GetObjectId();
        return response.data;
    }

    onDisplay(transaction){
        const transactions = this.state.transactions.slice(0);
        const t1 = transactions.find(t => t._id == transaction._id);
        const t0 = transactions.find(t => t._id == t1.pairId);
        
        for (let transaction of transactions){
            transaction.focus = false;
        }

        let verb = '';

        switch(t1.verb){
        case 'delete':
            verb = 'post';
            break;
        case 'ignore':
            verb = 'put';
            break;
        }

        t0.verb = verb;
        t1.verb = verb;
        t1.focus = true;

        this.setState({
            transactions: transactions
        });
    }

    onHide(transaction){
        const transactions = this.state.transactions.slice(0);
        const t1 = transactions.find(t => t._id == transaction._id);
        const t0 = transactions.find(t => t._id == t1.pairId);
        
        let verb = '';
        
        switch(t1.verb){
        case 'post':
            verb = 'delete';
            break;
        case 'put':
            verb = 'ignore';
            break;
        }

        t0.verb = verb;
        t1.verb = verb;
        t1.focus = false;

        this.setState({
            transactions: transactions
        });    
    }

    getTransactionSlice(type){
        let matches = [];
        switch(type){
        case 'envelope':
            matches = this.state.transactions.filter(t => t.verb == 'ignore' || t.verb == 'delete');
            break;
        case 'pending':
            matches = this.state.transactions.filter(t => t.verb == 'put' || t.verb == 'post');
            break;
        }

        return matches;
    }

    save(){
        const transactions = this.state.transactions.slice(0);

        const put = transactions.filter(t => t.verb == 'put');
        const post = transactions.filter(t => t.verb == 'post');
        const del = transactions.filter(t => t.verb == 'delete');

        for (let transaction of put){
            PutTransaction(transaction);
        }

        for (let transaction of post){
            PostTransaction(transaction);
        }

        for (let transaction of del){
            DeleteTransaction(transaction);
        }

        //PostTransaction(this.state.parent);

        this.setState({
            show: false,
            async: false
        }, () => {
            this.load();
        });
    }

    dateUpdate(date){
        const transactions = this.state.transactions.slice(0);
        
        for (let transaction of transactions){
            transaction.date = date;
        }

        this.setState({
            transactions: transactions,
            date: date
        }, () => {
            //console.log('blur state = ', this.state);
        });
    };

    dollarsUpdate(amount){
        this.setState({
            amount: amount
        });
    }

    render() {
        if (this.state.show){
            return <div>
                {
                    this.state.async &&
                    <div>
                        <Date
                            callback={this.dateUpdate}
                            initial={this.state.date}
                        />
                        <Dollars
                            callback={this.dollarsUpdate}
                            initial={this.state.amount}
                        />
                        <Envelopes 
                            containerId={this.props.containerId} 
                            transactions={this.getTransactionSlice('envelope')} 
                            onDisplay={this.onDisplay} 
                        />
                        <Transactions 
                            containerId={this.props.containerId} 
                            transactions={this.getTransactionSlice('pending')} 
                            onHide={this.onHide} 
                            amount={this.state.amount} 
                        />
                    </div>
                }
                {/* <InputMask 
                    mask="99-99" 
                    maskChar=" " 
                    placeholder="MM-DD" 
                    value={this.state.mmdd} 
                    onFocus={this.onFocus} 
                    onChange={this.onChange} 
                    onBlur={this.onBlur} 
                /> */}
                {/* <NumberFormat 
                    value={this.state.amount} 
                    displayType={'text'} 
                    thousandSeparator={true} 
                    prefix={'$'} 
                    decimalPrecision={2} 
                /> */}
                {/* <Envelopes parent={this.state.parent} transactions={this.getTransactionSlice('envelope')} onDisplay={this.onDisplay} />
                <Transactions parent={this.state.parent} transactions={this.getTransactionSlice('pending')} onHide={this.onHide} /> */}
                <a onClick={this.save}>save</a>
            </div>;
        }

        return <h1>saving</h1>;
    }
}

export default Dole;
