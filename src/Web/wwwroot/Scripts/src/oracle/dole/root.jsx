import React, { Component } from 'react';
// import { GET, PUT, POST, DELETE, GetContainers, GetDole, PostDole, PutDole, GetObjectId, GetTransaction, PostTransaction, PutTransaction, DeleteTransaction  } from '../api.js';
import { GET, PUT, POST, DELETE } from '../api.js';
import Envelopes from './envelopes.jsx';
import Transactions from './transactions.jsx';
import moment from 'moment';
import './dole.scss';
import Date from '../date.jsx';
import Dollars from '../dollars.jsx';

class Dole extends Component {
    constructor(props) {
        super(props);

        this.state = {
            async: false,
            show: true,
            parent: {},
            container: {},
            transactions: [],
            envelopes: [],
            dole: {}
        };

        this.generateObjectId = this.generateObjectId.bind(this);
        this.createTransaction = this.createTransaction.bind(this);
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

        const getContainers = await GET.container();
        envelopes = getContainers.data.filter(c => c.type == 'envelope');
        const account = getContainers.data.find(c => c._id == this.props.containerId);

        const getDole = await GET.dole(this.props.doleId);
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

        const getTransactions = await GET.transaction(this.props.doleId, 'dole');
        transactions = getTransactions.data;

        for (let envelope of envelopes) {
            const credit = transactions.find(t => t.containerId == envelope._id);
            if (credit){
                credit.verb = 'post';
                credit.focus = false;
                credit.envelope = envelope;
            } else {
                const transaction = await this.createTransaction(dole.date, envelope);
                transactions.push(transaction);
            }
        }

        this.setState ({
            dole: dole,
            transactions: transactions,
            container: account,
            envelopes: envelopes,
            show: true,
            async: true
        }, () => {
            console.log('state = ', this.state);
        });
    }

    async createTransaction(date, envelope){
        
        const id = await this.generateObjectId();
        
        const transaction = {
            _id: id,
            date: date,
            amount: 0,
            pairId: '',
            containerId: envelope._id,
            accounting: 'credit',
            doleId: this.props.doleId,
            pending: true,
            verb: 'ignore',
            envelope: envelope,
            focus: false
        };

        return transaction;
    }

    async generateObjectId(){
        const response = await GET.objectId();
        return response.data;
    }

    onDisplay(transaction){
        const transactions = this.state.transactions.slice(0);
        const pointer = transactions.find(t => t._id == transaction._id);
        
        for (let transaction of transactions){
            transaction.focus = false;
        }

        let verb = '';

        switch(pointer.verb){
        case 'delete':
            verb = 'post';
            break;
        case 'ignore':
            verb = 'put';
            break;
        }

        pointer.verb = verb;
        pointer.focus = true;

        this.setState({
            transactions: transactions
        });
    }

    onHide(transaction){
        const transactions = this.state.transactions.slice(0);
        const pointer = transactions.find(t => t._id == transaction._id);
        
        let verb = '';
        
        switch(pointer.verb){
        case 'post':
            verb = 'delete';
            break;
        case 'put':
            verb = 'ignore';
            break;
        }

        pointer.verb = verb;
        pointer.focus = false;

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

        for (let transaction of transactions){
            transaction.pending = moment().isSameOrBefore(this.state.dole.date);
        }

        for (let transaction of put){
            PUT.transaction(transaction);
        }

        for (let transaction of post){
            POST.transaction(transaction);
        }

        for (let transaction of del){
            DELETE.transaction(transaction);
        }

        if (dole.verb == 'post'){
            POST.dole(dole)
                .then(() => {
                    this.setState({
                        show: false,
                        async: false
                    }, () => {
                        this.load();
                    });
                });
        } else {
            PUT.dole(dole)
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
        
        const now = moment();
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
            const mark = this.state.dole.verb == 'post' ? 'fa-check' : 'fa-plus';
            return <div className="dole">
                <div className="head">
                    <div className="tag">{this.state.container.name} {this.state.container.type} dole</div>
                    <div>
                        <Date
                            onBlur={this.dateUpdate}
                            value={this.state.dole.date}
                        /> 
                        <span>for</span>
                        <Dollars
                            onBlur={this.dollarsUpdate}
                            value={this.state.dole.amount}
                        />
                    </div>                    
                </div>
                <div className="body">
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
                <div className="action">
                    <a onClick={this.save}><i className={'fa ' + mark}/></a>
                </div>
            </div>;
        } else {
            return <h1>saving</h1>;
        }
    }
}

export default Dole;
