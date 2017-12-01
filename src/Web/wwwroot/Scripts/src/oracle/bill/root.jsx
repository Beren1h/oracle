import React, { Component } from 'react';
import './bill.scss';
import { GET, POST } from '../api.js';
import moment from 'moment';


class Bill extends Component {
    constructor(props) {
        super(props);

        this.state = {
            async: false,
            bills: [],
            risks: [],
            nexts: [],
            range: {
                begin: '',
                end: ''
            }
        };

        this.load = this.load.bind(this);
        this.click = this.click.bind(this);
    }

    async componentWillMount(){
        await this.load();
    }

    async load(){
        const bills = [];
        const risks = [];
        const nexts = [];
        let range = {};

        const getBills = await GET.bill();

        if (!this.state.range.begin){
            range = {
                begin: moment().format('YYYY-MM-DD'),
                end: moment().add(1, 'months').format('YYYY-MM-DD')
            };
        } else {
            range = {...this.state.range};
        }

        for (let bill of getBills){
            const date = moment(bill.next);
            if (date.isBetween(range.being, range.end, [])){
                bill.location = 'bills';
                bills.push(bill);
            }

            if (date.isBefore(range.begin)){
                bill.location = 'risks';
                risks.push(bill);
            }

            if (date.isAfter(range.end)){
                bill.location = 'nexts';
                nexts.push(bill);
            }
        }

        this.setState({
            bills: bills,
            risks: risks,
            nexts: nexts,
            range: range
        }, () => {
            console.log('state = ', this.state);
        });
    }

    click(bill){

        let moveFrom;
        let moveTo;

        switch(bill.location){
        case 'risks':
            moveTo = 'bills';
            moveFrom = 'risks';
            break;
        case 'bills':
            moveTo = 'nexts';
            moveFrom = 'bills';
            break;
        }

        if (moveTo){

            const current = {...this.state};

            console.log('moveTo = ', moveTo, 'moveFrom = ', moveFrom);
            console.log('before = ', current);
    
            current[moveFrom].splice(current[moveFrom].indexOf(bill), 1);
            
            bill.location = moveTo;
            
            if (moveTo == 'nexts'){
                const frequency = bill.frequency.split(' ');
                bill.next = moment(bill.next).add(frequency[0], frequency[1]).format('YYYY-MM-DD');
            }
            
            current[moveTo].push(bill);
            
            this.setState(current, () => {
                //console.log('click state = ', this.state);
            });
        }
    }
    
    render() {
        return <div className="bill">
            <div className="range">range</div>
            <div className="risk">
                {
                    this.state.risks.map((bill, index) => {
                        return <a key={index} onClick={() => this.click(bill)}>
                            <div>{bill.name}</div>
                            <div>{moment(bill.next).format('YYYY-MM-DD')}</div>
                        </a>;
                    })
                }
            </div>
            <div className="item">
                {
                    this.state.bills.map((bill, index) => {
                        return <a key={index} onClick={() => this.click(bill)}>
                            <div>{bill.name}</div>
                            <div>{moment(bill.next).format('YYYY-MM-DD')}</div>
                        </a>;
                    })
                }
            </div>
            <div className="next">
                {
                    this.state.nexts.map((bill, index) => {
                        return <a key={index} onClick={() => this.click(bill)}>
                            <div>{bill.name}</div>
                            <div>{moment(bill.next).format('YYYY-MM-DD')}</div>
                        </a>;
                    })
                }
            </div>
        </div>;
    }
}

export default Bill;
