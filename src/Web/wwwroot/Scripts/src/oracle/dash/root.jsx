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
                envelope: envelope,
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
            async: true,
            range: range,
            envelopes: envelopeSummary,
            accounts: accountSummary
        }, () => {
            console.log('state  = ', this.state);
        });
    }


    render() {
        return <div className="dash">
            <div className="head top">
                <Date 
                    value={this.state.range.end}
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
                        return <div key={index} className={'summary ' + theme}>
                            <a href="#" target="_blank">
                                {envelope.envelope.name}
                            </a>
                            <a href="#" target="_blank">
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
                            <a href="#" target="_blank">
                                {account.account.name}
                            </a>
                            <Dollars
                                value={account.balance}
                                isEdit={false}
                            />
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
                                    <Date
                                        value={dole.date}
                                        isEdit={false}
                                    />
                                    <Dollars
                                        value={dole.amount}
                                        isEdit={false}
                                    />
                                </div>;
                            })
                        }
                    </div>;
                })
            }
        </div>;
        // return <div className="dash">
        //                     <div className="head">
        //                 <Date
        //                     value={this.state.range.end} 
        //                     //onBlur={this.addDate}
        //                 />                
        //             </div>
        //             <div className="body">
        //                 <div className="envelopes">
        //                     {
        //                         this.state.envelopes.map((envelope, index) =>  {
        //                             return <div key={index} className="row">
        //                                 <div>{envelope.envelope.name}</div>
        //                                 <Dollars
        //                                     value={envelope.balance}
        //                                     isEdit={false}
        //                                 />
        //                             </div>;
        //                         })
        //                     }
        //                 </div>
        //                 <div className="accounts">
        //                     <div className="heading">accounts</div>
        //                     {
        //                         this.state.accounts.map((account, index) => {
        //                             return <div key={index} className="row">
        //                                 <div>{account.account.name}</div>
        //                                 <Dollars
        //                                     value={account.balance}
        //                                     isEdit={false}
        //                                 />
        //                                 <div className="doles">
        //                                     {
        //                                         account.doles.map((dole, index) => {
        //                                             let theme = 'dark';
        //                                             if (index % 2 == 0) {
        //                                                 theme = 'light';
        //                                             }
        //                                             return <div key={index} className={'row ' + theme}>
        //                                                     <a target="_blank" href="#"><Date
        //                                                         value={dole.date}
        //                                                         isEdit={false}
        //                                                     /> </a>
        //                                                     <a target="_blank" href="#"><Dollars
        //                                                         value={dole.amount}
        //                                                         isEdit={false}
        //                                                     /></a>
        //                                                 </div>;
        //                                         })
        //                                     }
        //                                 </div>
        //                                 <div className="add">plus</div>
        //                             </div>;
        //                         })
        //                     }
        //                 </div>
        //             </div>
        // </div>;
    }
}

export default Dole;

