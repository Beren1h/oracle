import React, { Component } from 'react';
import { GetContainers, GetTransaction, GetObjectId, PutTransactionPair, PostTransactionPair, DeleteTransactionPair, PostTransaction, GetTransactionDole } from '../api.js';
import Envelopes from './envelopes.jsx';
import Pending from './pending.jsx';
import { SortByAlpha } from '../helper.js';

class Dole extends Component {
    constructor(props) {
        super(props);

        this.state = {
            parent: {},
            transactions: [],            
            envelopes: [],
            pendings: []
        };

        this.displayPending = this.displayPending.bind(this);
        this.hidePending = this.hidePending.bind(this);
        this.GenerateObjectId = this.GenerateObjectId.bind(this);
        this.createTransactionPair = this.createTransactionPair.bind(this);
        this.save = this.save.bind(this);
        this.save2 = this.save2.bind(this);
        this.put = this.put.bind(this);
        this.post = this.post.bind(this);
    }

    async componentWillMount() {

        let pendings = [];
        let doles = [];
        let parent = {};
        let envelopes = [];
        let transactions = [];

        const getContainers = await GetContainers();
        envelopes = getContainers.data.filter(c => c.type == 'envelope');

        const getTransaction = await GetTransaction(this.props.parentId);
        parent = getTransaction.data[0];

        if (parent.doleId){
            const getTransactionDole = await GetTransactionDole(parent.doleId);
            transactions = getTransactionDole.data;

            envelopes.forEach((envelope) => {
                const transaction = transactions.find(t => t.containerId == envelope._id);
                if (transaction){
                    pendings.push({
                        amount: transaction.amount,
                        envelope: envelope,
                        display: true,
                        focus: false
                    });
                } else {
                    pendings.push({
                        amount: 0,
                        envelope: envelope,
                        display: false,
                        focus: false
                    });
                }
            });

            // transactions.map((transaction) => {
            //     if (transaction.containerId != parent.containerId){
            //         const envelope = envelopes.find(e => e._id == transaction.containerId);
            //         pendings.push({
            //             amount: transaction.amount,
            //             envelope: envelope,
            //             display: true
            //         })
            //         envelopes.splice(envelopes.indexOf(envelope), 1);
            //     }
            // });
        } else {
            envelopes.forEach((envelope) => {
                pendings.push({
                    amount: 0,
                    envelope: envelope,
                    display: false,
                    focus: false
                });
            });
        }

        this.setState({
            envelopes: envelopes.sort((a, b) => SortByAlpha(a.name, b.name)),
            parent: parent,
            pendings: pendings.sort((a, b) => SortByAlpha(a.envelope.name, b.envelope.name)),
            transactions: transactions
        }, () => {
            console.log(this.state);
        });

        // console.log(containers);
        // GetTransaction(this.props.parentId)
        //     .then((response) => {
        //         // console.log('parent = ', response.data[0]);
        //         this.setState({
        //             parent: response.data[0]
        //         }, () => {
        //             if (this.state.parent.doleId){
        //                 GetTransactionDole(this.state.parent.doleId)
        //                     .then((response) => {
        //                         this.setState({
        //                             doles: response.data
        //                         }, () => {
        //                             // console.log(this.state.doles);
        //                             // const pendings = [];
        //                             // this.state.doles.map((dole) => {
        //                             //     if (dole.containerId != this.state.parent.containerId){
        //                             //         const envelope = this.state.eb
        //                             //         pendings.push(new {
        //                             //             amount: dole.amount,
        //                             //             envelope: 
        //                             //         })
        //                             //     }
        //                             // });
        //                         })
        //                     });
        //             }
        //         });
        //     });

        // GetContainers()
        //     .then((response) => {
        //         this.setState({
        //             envelopes: response.data.filter(c => c.type == 'envelope')
        //         }, () => {
        //             //console.log('will mount envelopes = ', this.state.envelopes);
        //         });
        //     });
    }

    displayPending(id) {
        // clone arrays from state before modifying
        const pendings = this.state.pendings.slice(0);

        pendings.forEach((pending) => {
            pending.focus = false;
        });

        //if already a pending matching the envelope update else create a new pending
        const pending = pendings.find(p => p.envelope._id == id);

        //pending.options = {};
        
        //pending.options['autoFocus'] = 'autoFocus';

        pending.display = true;
        pending.focus = true;

        // pendings[index].amount = pending.amount;
        // pendings[index].display = true;
        // pendings[index].focus = true;

        // const index = pendings.indexOf(pending);
        // if (index != -1){
        //     pendings[index].amount = pending.amount;
        //     pendings[index].display = true;
        //     pendings[index].focus = true;
        // } else {
        //     pendings.push({
        //         envelope: envelope.find(e => e._id == id),
        //         amount: 0,
        //         display: true,
        //         focus: true
        //     });
        // }
        //console.log(pendings);
        this.setState({
            pendings: pendings.sort((a, b) => SortByAlpha(a.envelope.name, b.envelope.name))
            //envelopes: envelopes.sort((a, b) => SortByAlpha(a.envelope.name, b.envelope.name))
        }, () => {
            //console.log('pendings = ', this.state.pendings);
        });
    }

    hidePending(id){
        // clone state array before modifying
        const pendings = this.state.pendings.slice(0);

        // find pending by envelope id and set it hidden
        //const envelope = pendings.find(p => p.envelope._id == id).envelope;

        const pending = pendings.find(p => p.envelope._id == id);

        pending.display = false;
        //pending.focus = false;
        //pendings.find(p => p.envelope._id == id).display = false;

        this.setState({
            pendings: pendings
        });
    }

    async GenerateObjectId(){
        const response = await GetObjectId();
        return response.data;
    }

    async createTransactionPair(pending, parent){

        const id0 = await this.GenerateObjectId();
        const id1 = await this.GenerateObjectId();

        const transaction0 = {
            _id: id0,
            date: parent.date,
            amount: pending.amount,
            pairId: id1,
            containerId: parent.containerId,
            accounting: 'debit',
            doleId: doleId,
            pending: true
        };
        const transaction1 = {
            _id: id1,
            date: parent.date,
            amount: pending.amount,
            pairId: id0,
            containerId: pending.envelope._id,
            accounting: 'credit',
            doleId: doleId,
            pending: false
        };

        return [transaction0, transaction1];
    }

    save2(){
        const parent = Object.assign({}, this.state.parent);
        const transactions = this.state.transactions.slice(0);

        this.state.pendings.forEach((pending) => {
            let transaction0 = transactions.find(t => t.containerId == pending.envelope._id);
            let transaction1 = transactions.find(t => t.containerId == parent.containerId);
            console.log('transaction0 = ', transaction0);
            //console.log('transaction1 = ', transaction1);
            if (!transaction0){
                //console.log('put ', pending);
                if (pending.display && parseFloat(pending.amount) > 0){
                    console.log('put ', pending);
                }
            } else {
                if (pending.display && parseFloat(pending.amount) > 0){
                    console.log('post ', pending);
                } else {
                    console.log('delete ', pending);
                }
            }
        });
    }



    async save() {
        const parent = Object.assign({}, this.state.parent);

        if (parent.doleId){
            await this.post(parent);
        } else {
            this.state.pendings
            await this.put(parent);
        }
    }

    async post(parent) {
        const transactions = this.state.transactions.slice(0);
        this.state.pendings.map((pending) => {
            let transaction0 = transactions.find(t => t.containerId == pending.envelope._id);
            let transaction1 = transactions.find(t => t.containerId == parent.containerId);
            if (pending.display && parseFloat(pending.amount) > 0){
                if (transaction0 && transaction1) {
                    transaction0.amount = pending.amount;
                    transaction1.amount = pending.amount;
                } else {
                    this.put(parent);
                }
                PostTransactionPair(transaction0, transaction1);
            } else {
                //transactions.splice(transactions.indexOf(transaction0), 1);
                //transactions.splice(transactions.indexOf(transaction1), 1);
                DeleteTransactionPair(transaction0, transaction1);
            }
        });

        this.setState({
            transactions: transactions
        }, () => {
            //console.log(this.state.transactions);
        });
    }

    async put(parent, pending) {
        //console.log('parent = ', this.state.parent);
        //console.log('save = ', this.state.pendings);

        //const parent = Object.assign({}, this.state.parent);
        //console.log('parent dole id = ', parent.doleId);
        
        // if(parent.doleId){
        //     return;
        // }

        //const id0Response = await GetObjectId();
        //const id1Response = await GetObjectId();
        const transactions = this.state.transactions.slice(0);
        let transaction0 = transactions.find(t => t.containerId == pending.envelope._id);
        let transaction1 = transactions.find(t => t.containerId == parent.containerId);

        const id0 = await this.GenerateObjectId();
        const id1 = await this.GenerateObjectId();
        const doleId = parent.doleId ? parent.doleId : await this.GenerateObjectId();


        this.state.pendings.map((pending) => {
            if (pending.display && parseFloat(pending.amount) > 0 && !transaction0 && !transaction1){
                const transaction0 = {
                    _id: id0,
                    date: parent.date,
                    amount: pending.amount,
                    pairId: id1,
                    containerId: parent.containerId,
                    accounting: 'debit',
                    doleId: doleId,
                    pending: true
                };
                const transaction1 = {
                    _id: id1,
                    date: parent.date,
                    amount: pending.amount,
                    pairId: id0,
                    containerId: pending.envelope._id,
                    accounting: 'credit',
                    doleId: doleId,
                    pending: false
                };
                PutTransactionPair(transaction0, transaction1);
            } else {
                console.log('fail pending = ', pending);
            }
        });

        parent.doleId = doleId;

        this.setState({
            parnet: parent
        }, () => {
            PostTransaction(parent);
        });

    }

    render() {
        return <div>
            <h3>dole - root</h3>
            <Envelopes pendings={this.state.pendings.filter(p => p.display == false)} displayPending={this.displayPending} />
            <Pending pendings={this.state.pendings.filter(p => p.display == true)} hidePending={this.hidePending} />
            <a onClick={this.save2}>save</a>
        </div>;
    }
}

export default Dole;

