import React, { Component } from 'react';
import { GetContainers, GetTransactionDole, GetObjectId, GetTransaction, PostTransaction, PutTransaction, DeleteTransaction  } from '../api.js';
import Envelopes from './envelopes2.jsx';
import Transactions from './transactions.jsx';
import Summary from './summary.jsx';
import './dole.scss';


class Dole extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
        this.save = this.save.bind(this);
        this.load = this.load.bind(this);
    }

    async componentWillMount(){
        this.load();
    }

    async load(){
        let parent = {};
        let envelopes = [];
        let transactions = [];

        const getContainers = await GetContainers();
        envelopes = getContainers.data.filter(c => c.type == 'envelope');

        const getTransaction = await GetTransaction(this.props.parentId);
        parent = getTransaction.data[0];
        
        if (!parent.doleId){
            parent.doleId = await this.generateObjectId();
        } 

        const getTransactions = await GetTransactionDole(parent.doleId);
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
                const pair = await this.createTransactionPair(parent, envelope);
                transactions.push(pair[0]);
                transactions.push(pair[1]);
            }
        }

        this.setState ({
            parent: parent, 
            transactions: transactions,
            envelopes: envelopes,
            show: true
        }, () => {
            //console.log('state ', this.state.transactions);
        });
    }

    async createTransactionPair(parent, envelope){

        const id0 = await this.generateObjectId();
        const id1 = await this.generateObjectId();

        const transaction0 = {
            _id: id0,
            date: parent.date,
            amount: 0,
            pairId: id1,
            containerId: parent.containerId,
            accounting: 'debit',
            doleId: parent.doleId,
            pending: true,
            verb: 'ignore'
        };
        const transaction1 = {
            _id: id1,
            date: parent.date,
            amount: 0,
            pairId: id0,
            containerId: envelope._id,
            accounting: 'credit',
            doleId: parent.doleId,
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

        PostTransaction(this.state.parent);

        this.setState({
            show: false 
        }, () => {
            this.load();
        });
    }

    render() {
        if (this.state.show){
            return <div>
                <Envelopes parent={this.state.parent} transactions={this.getTransactionSlice('envelope')} onDisplay={this.onDisplay} />
                <Transactions parent={this.state.parent} transactions={this.getTransactionSlice('pending')} onHide={this.onHide} />
                <a onClick={this.save}>save</a> 
            </div>;
        }

        return <h1>saving</h1>;
    }
}

export default Dole;
