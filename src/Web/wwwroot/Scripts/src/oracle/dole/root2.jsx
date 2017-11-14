import React, { Component } from 'react';
import { GetContainers, GetTransaction, GetObjectId, PutTransactionPair, PostTransactionPair, DeleteTransactionPair, PostTransaction, GetTransactionDole } from '../api.js';

class Dole extends Component {
    constructor(props) {
        super(props);

        this.state = {
            parent: {},
            transactions: [],
            pendings: [],            
            envelopes: []
        };

        this.generateObjectId = this.generateObjectId.bind(this);
        this.createTransactionPair = this.createTransactionPair.bind(this);
    }

    async componentWillMount(){

        let parent = {};
        let envelopes = [];
        let transactions = [];

        const getContainers = await GetContainers();
        envelopes = getContainers.data.filter(c => c.type == 'envelope');

        const getTransaction = await GetTransaction(this.props.parentId);
        parent = getTransaction.data[0];
        
        if (!parent.doleId){
            parent.doleId = await this.GenerateObjectId();
        }

        const getTransactions = await GetTransactionDole(parent.doleId);
        transactions = getTransactions.data;

        for (let envelope of envelopes) {
        //envelopes.forEach((envelope) => {
            const credit = transactions.find(t => t.containerId == envelope._id);
            if (credit){
                const debit = transactions.find(t => t.containerId == parent.containerId);
                debit.verb = 'post';
                credit.verb = 'post';
            } else {
                const pair = await this.createTransactionPair(parent, envelope);
                transactions.push(pair[0]);
                transactions.push(pair[1]);
            }
        //});
        }

        console.log('transactions = ', transactions);
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
            verb: 'put'
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
            verb: 'put'
        };

        return [transaction0, transaction1];
    }

    async generateObjectId(){
        const response = await GetObjectId();
        return response.data;
    }

    render() {
        return <div>
            <h3>dole - root</h3>
        </div>;
    }
}

export default Dole;


