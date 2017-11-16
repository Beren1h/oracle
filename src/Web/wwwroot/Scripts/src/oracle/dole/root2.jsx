import React, { Component } from 'react';
import { GetContainers, GetDole, PostDole, PutDole, GetTransactionDole, GetObjectId, GetTransaction, PostTransaction, PutTransaction, DeleteTransaction  } from '../api.js';
import Envelopes from './envelopes2.jsx';
import Transactions from './transactions.jsx';
import Summary from './summary.jsx';
import moment from 'moment';
import './dole.scss';
import Date from '../date.jsx';
import Dollars from '../dollars.jsx';

class Dole extends Component {
    constructor(props) {
        super(props);

        this.state = {
            async: false,
            //date: '',
            //amount: 0,
            show: true,
            parent: {},
            transactions: [],
            envelopes: [],
            dole: {}
        };

        this.generateObjectId = this.generateObjectId.bind(this);
        this.createTransactionPair = this.createTransactionPair.bind(this);
        this.getTransactionSlice = this.getTransactionSlice.bind(this);
        this.onDisplay = this.onDisplay.bind(this);
        this.onHide = this.onHide.bind(this);
        this.dateUpdate = this.dateUpdate.bind(this);
        this.dollarsUpdate = this.dollarsUpdate.bind(this);
        this.save = this.save.bind(this);
        this.load = this.load.bind(this);

    }

    async componentWillMount(){
        await this.load();
    }

    async load(){
        let envelopes = [];
        let transactions = [];
        let dole = {};

        const getContainers = await GetContainers();
        envelopes = getContainers.data.filter(c => c.type == 'envelope');

        const getDole = await GetDole(this.props.doleId);
        dole = getDole.data[0];

        if (dole){
            dole = dole;
            dole.verb = 'post';
        } else {
            dole = {
                _id:  this.props.doleId,
                date: moment(this.props.year + '-' + moment().format('MM-DD')).format('YYYY-MM-DD'),
                amount: 0,
                containerId: this.props.containerId,
                verb: 'put'
            };
        }

        const getTransactions = await GetTransactionDole(this.props.doleId);
        transactions = getTransactions.data;

        for (let envelope of envelopes) {
            const credit = transactions.find(t => t.containerId == envelope._id);
            if (credit){
                const debit = transactions.find(t => t.pairId == credit._id);
                debit.verb = 'post';
                credit.verb = 'post';
                credit.focus = false;
                credit.envelope = envelope;
            } else {
                const pair = await this.createTransactionPair(dole.date, envelope);
                transactions.push(pair[0]);
                transactions.push(pair[1]);
            }
        }

        this.setState ({
            dole: dole,
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
        const dole = Object.assign({}, this.state.dole);

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

        if (dole.verb == 'post'){
            PostDole(dole)
                .then(() => {
                    this.setState({
                        show: false,
                        async: false
                    }, () => {
                        this.load();
                    });
                });
        } else {
            PutDole(dole)
                .then(() => {
                    const current = window.location.href;
                    window.location.href = current + '?doleId=' + dole._id;
                });
        }


    }

    dateUpdate(date){
        const transactions = this.state.transactions.slice(0);
        const dole = Object.assign({}, this.state.dole);
        
        for (let transaction of transactions){
            transaction.date = date;
        }

        dole.date = date;

        this.setState({
            transactions: transactions,
            dole: dole
        }, () => {
            //console.log('blur state = ', this.state);
        });
    };

    dollarsUpdate(amount){
        const dole = Object.assign({}, this.state.dole);
        dole.amount = amount;
        this.setState({
            dole: dole
        });
    }

    render() {
        if (this.state.show){
            return <div>
                {
                    this.state.async &&
                    <div>
                        <div className={'container'}>
                            <div className={'heading'}>
                            <label>date</label>
                            <Date
                                onBlur={this.dateUpdate}
                                value={this.state.dole.date}
                            />
                            </div>
                            <div className={'heading'}>
                            <label>amount</label>
                            <Dollars
                                onBlur={this.dollarsUpdate}
                                value={this.state.dole.amount}
                            />
                            </div>
                            <div className={'save'}>
                                <a onClick={this.save}>save</a>
                            </div>
                        </div>
                        <div className={'container'}>
                            <Envelopes 
                                containerId={this.props.containerId} 
                                transactions={this.getTransactionSlice('envelope')} 
                                onDisplay={this.onDisplay} 
                            />
                            <Transactions 
                                containerId={this.props.containerId} 
                                transactions={this.getTransactionSlice('pending')} 
                                onHide={this.onHide} 
                                amount={this.state.dole.amount} 
                            />
                        </div>
                    </div>
                }
            </div>;
        }

        return <h1>saving</h1>;
    }
}

export default Dole;
