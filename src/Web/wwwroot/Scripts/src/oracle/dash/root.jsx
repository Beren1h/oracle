import React, { Component } from 'react';
import { GET} from '../api.js';
import './dash.scss';
import { SortByAlpha } from '../helper.js';
import moment from 'moment';

class Dole extends Component {
    constructor(props) {
        super(props);

        this.state = {
            async: false,
            range: {
                begin: '',
                end: ''
            }
        };

        this.load = this.load.bind(this);

    }

    async componentWillMount(){
        await this.load();
    }

    async load(){

        let range = {};

        if (!this.state.range.begin){
            range = {
                begin: moment().subtract(14, 'days').format('YYYY-MM-DD'),
                end: this.props.year + '-12-31'
            };
        } else {
            range = Object.assign({}, this.state.range);
        }

        const begin = moment(range.begin);
        const end = moment(range.end);

        const getContainers = await GET.container();
        const containers = getContainers.data;

        const accounts = containers.filter(c => c.type == 'account');
        const envelopes = containers.filter(c => c.type == 'envelope');

        const getDoles = await GET.dole();
        const doles = getDoles.data;

        console.log(doles);

        const accountSummary = [];
        for (let account of accounts){

            const thing = {
                account: account,
                doles: doles.filter(d => d.containerId == account._id).sort((a, b) => SortByAlpha(a.date, b.date)),
                balance: 0
            };
            const getTransactions = await GET.transaction(account._id, 'container');
            const transactions = getTransactions.data.sort((a, b) => SortByAlpha(a.date, b.date));

            for (let transaction of transactions){
                const date = moment(transaction.date);
                
                if (date.isAfter(end)){
                    break;
                }

                if (!transaction.pending){
                    if (transaction.accounting == 'debit'){
                        thing.balance -= transaction.amount;
                    } else {
                        thing.balance += transaction.amount;
                    }
                }
            }

            accountSummary.push(thing);
        }


        const envelopeSummary = [];
        for (let envelope of envelopes){
            const getTransactions = await GET.transaction(envelope._id, 'container');
            const transactions = getTransactions.data.sort((a, b) => SortByAlpha(a.date, b.date));

            let hasBeenRed = false;

            const status = {
                _id: envelope._id,
                name: envelope.name,
                balance: 0,
                isBlack: true
            };
            
            for (let transaction of transactions){

                const date = moment(transaction.date);
                
                if (date.isAfter(end)){
                    break;
                }

                if (transaction.accounting == 'debit'){
                    status.balance -= transaction.amount;
                } else {
                    status.balance += transaction.amount;
                }

                if (status.balance <= 0 && !hasBeenRed){
                    status.isBlack = false;
                    hasBeenRed = true;
                }
            }

            envelopeSummary.push(status);
        }


        console.log('e =', envelopeSummary);
        console.log('a =', accountSummary);

        this.setState({
            range: range
        });
    }


    render() {
        return <div>dash</div>;
    }
}

export default Dole;

