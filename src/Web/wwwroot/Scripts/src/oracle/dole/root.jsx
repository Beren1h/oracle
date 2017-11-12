import React, { Component } from 'react';
import { GetContainers, GetTransaction } from '../api.js';
import Envelopes from './envelopes.jsx';
import Pending from './pending.jsx';

class Dole extends Component {
    constructor(props) {
        super(props);

        console.log('root props = ', this.props);

        this.state = {
            parent: {},
            envelopes: [],
            pendings: []
        };

        this.createPending = this.createPending.bind(this);
        this.removePending = this.removePending.bind(this);
        this.save = this.save.bind(this);
    }

    componentWillMount() {

        GetTransaction(this.props.parentId)
            .then((response) => {
                if (response.data.doleId){

                }
                this.setState({
                    parent: response.data
                })
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

    save() {
        console.log('parent = ', this.state.parent);
        console.log('save = ', this.state.pendings);
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
