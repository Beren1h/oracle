import React, { Component } from 'react';
import { GetContainers, GetTransaction, GetObjectId, PutTransaction, PostTransaction, GetTransactionDole } from '../api.js';
import Envelopes from './envelopes.jsx';
import Pending from './pending.jsx';

class Dole extends Component {
    constructor(props) {
        super(props);

        this.state = {
            parent: {},
            doles: [],            
            envelopes: [],
            pendings: []
        };

        this.createPending = this.createPending.bind(this);
        this.removePending = this.removePending.bind(this);
        this.GenerateObjectId = this.GenerateObjectId.bind(this);
        this.save = this.save.bind(this);
    }

    async componentWillMount() {

        GetTransaction(this.props.parentId)
            .then((response) => {
                // console.log('parent = ', response.data[0]);
                this.setState({
                    parent: response.data[0]
                }, () => {
                    if (this.state.parent.doleId){
                        GetTransactionDole(this.state.parent.doleId)
                            .then((response) => {
                                this.setState({
                                    doles: response.data
                                }, () => {
                                    // console.log(this.state.doles);
                                })
                            });
                    }
                });
            });

        GetContainers()
            .then((response) => {
                this.setState({
                    envelopes: response.data.filter(c => c.type == 'envelope')
                }, () => {
                    //console.log('will mount envelopes = ', this.state.envelopes);
                });
            });
    }

    createPending(index) {
        //console.log('state envelopes = ', this.state.envelopes);
        const envelopes = this.state.envelopes.slice(0);
        const pendings = this.state.pendings.slice(0);
        //const envelope = envelopes.find(e => e.id == id);
        const envelope = envelopes[index];
        //console.log('envelopes = ', envelopes);
        //console.log('envelope = ', envelope, index, id);
        
        envelopes.splice(index, 1);

        pendings.push({
            envelope: envelope,
            amount: 0,
        });

        this.setState({
            pendings: pendings,
            envelopes: envelopes
        }, () => {
            // console.log('pendings = ', this.state.pendings);
        });
    }

    removePending(index){
        // console.log('envelopes = ', this.state.envelopes);
        // console.log('pendings = ', this.state.pendings);

        const envelopes = this.state.envelopes.slice(0);
        const pendings = this.state.pendings.slice(0);
        const envelope = pendings[index].envelope;
        
        pendings.splice(index, 1);
        envelopes.push(envelope);

        this.setState({
            pendings: pendings,
            envelopes: envelopes
        }, () => {
            // console.log('final envelopes = ', this.state.envelopes);
            // console.log('final pendings = ', this.state.pendings);  
        });
    }

    async GenerateObjectId(){
        const response = await GetObjectId();
        return response.data;
    }

    async save() {
        const parent = Object.assign({}, this.state.parent);

        if (parent.doleId){
            await put(parent);
        } else {
            await post(parent);
        }
    }

    async post(parent) {

        return true;
    }

    async put(parent) {
        //console.log('parent = ', this.state.parent);
        //console.log('save = ', this.state.pendings);

        //const parent = Object.assign({}, this.state.parent);
        //console.log('parent dole id = ', parent.doleId);
        
        // if(parent.doleId){
        //     return;
        // }

        //const id0Response = await GetObjectId();
        //const id1Response = await GetObjectId();

        const id0 = await this.GenerateObjectId();
        const id1 = await this.GenerateObjectId();
        const doleId = parent.doleId ? parent.doleId : await this.GenerateObjectId();

        this.state.pendings.map((pending) => {
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
            }
            PutTransaction(transaction0, transaction1);
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
            <Envelopes containers={this.state.envelopes} createPending={this.createPending} />
            <Pending pendings={this.state.pendings} removePending={this.removePending} />
            <a onClick={this.save}>save</a>
        </div>;
    }
}

export default Dole;
