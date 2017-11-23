import React, { Component } from 'react';
import { GET} from '../api.js';
import './dash.scss';
import { SortByAlpha } from '../helper.js';
import moment from 'moment';
import Date from '../date.jsx';
import Dollars from '../dollars.jsx';

class Dole extends Component {
    constructor(props) {
        super(props);

        this.state = {
            async: false,
            envelopes: [],
            accounts: [],
            range: {
                begin: '',
                end: ''
            }
        };

        this.load = this.load.bind(this);
        this.updateDate = this.updateDate.bind(this);
    }

    async componentWillMount(){
        await this.load();
    }

    async load(){

        let range = {};
        const url = 'http://localhost:5000/oracle';

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

        const accountSummary = [];
        for (let account of accounts){

            const adjusted = doles.filter(d => d.containerId == account._id).sort((a, b) => SortByAlpha(a.date, b.date));
            const adjustedDoles = [];

            for (let dole of adjusted) {
                const date = moment(dole.date);
                if (date.isSameOrBefore(end)){
                    dole.url = url + '/dole/' + account._id + '?doleId=' + dole._id;
                    adjustedDoles.push(dole);
                }
            }

            const status = {
                account: account,
                doles: adjustedDoles,
                balance: 0,
                url: url + '/account/' + account._id
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
                        status.balance -= transaction.amount;
                    } else {
                        status.balance += transaction.amount;
                    }
                }
            }

            accountSummary.push(status);
        }


        const envelopeSummary = [];
        for (let envelope of envelopes.sort((a, b) => SortByAlpha(a.name, b.name))){
            const getTransactions = await GET.transaction(envelope._id, 'container');
            const transactions = getTransactions.data.sort((a, b) => SortByAlpha(a.date, b.date));

            let hasBeenRed = false;

            const status = {
                envelope: envelope,
                balance: 0,
                isBlack: true,
                url: url + '/envelope/' + envelope._id
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

                if (status.balance < 0 && !hasBeenRed){
                    status.isBlack = false;
                    hasBeenRed = true;
                }
            }

            envelopeSummary.push(status);
        }

        this.setState({
            async: true,
            range: range,
            envelopes: envelopeSummary,
            accounts: accountSummary
        }, () => {
            //console.log('state  = ', this.state);
        });
    }

    updateDate(date){
        const range = Object.assign({}, this.state.range);
        range.end = date;
        this.setState({
            range: range,
            async: false
        }, () => {
            this.load();
        });
    }

    render() {
        return <div className="dash">
            <div className="head top">
                <Date 
                    value={this.state.range.end}
                    onBlur={this.updateDate}
                />                    
            </div>
            <div className="envelopes column">
                <div className="head">
                    envelopes
                </div>
                {
                    this.state.envelopes.map((envelope, index) =>  {
                        let theme = 'dark';
                        if (index % 2 == 0){
                            theme = 'light';
                        }
                        if (!envelope.isBlack){
                            theme = 'red';
                        }
                        return <div key={index} className={'summary ' + theme}>
                            <a href={envelope.url} target="_blank">
                                {envelope.envelope.name}
                            </a>
                            <a href={envelope.url} target="_blank">
                                <Dollars
                                    value={envelope.balance}
                                    isEdit={false}
                                />
                            </a>
                        </div>;
                    })
                }                
            </div>
            <div className="accounts column">
                <div className="head">
                    accounts
                </div>
                {
                    this.state.accounts.map((account, index) => {
                        let theme = 'dark';
                        if (index % 2 == 0){
                            theme = 'light';
                        }
                        return <div key={index} className={'summary ' + theme}>
                            <a href={account.url} target="_blank">
                                {account.account.name}
                            </a>
                            <a href={account.url} target="_blank">
                                <Dollars
                                    value={account.balance}
                                    isEdit={false}
                                />
                            </a>
                        </div>;
                    })
                }
            </div>
            {
                this.state.accounts.map((account, index) => {
                    return <div key={index} className="dole-list column">
                        <div className="head">
                            {account.account.name} dole
                        </div>
                        {
                            account.doles.map((dole, index) => {
                                let theme = 'dark';
                                if (index % 2 == 0){
                                    theme = 'light';
                                }
                                return <div key={index} className={'summary ' + theme}>
                                    <a href={dole.url} target="_blank">
                                        <Date
                                            value={dole.date}
                                            isEdit={false}
                                        />
                                    </a>
                                    <a href={dole.url} target="_blank">
                                        <Dollars
                                            value={dole.amount}
                                            isEdit={false}
                                        />
                                    </a>
                                </div>;
                            })
                        }
                    </div>;
                })
            }
        </div>;
    }
}

export default Dole;

