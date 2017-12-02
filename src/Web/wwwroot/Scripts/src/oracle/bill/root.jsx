import React, { Component } from 'react';
import './bill.scss';
import { GET, POST } from '../api.js';
import moment from 'moment';
import Date from '../date.jsx';


class Bill extends Component {
    constructor(props) {
        super(props);

        this.state = {
            async: false,
            bills: [],
            risks: [],
            nexts: [],
            range: {}
        };

        this.load = this.load.bind(this);
        this.click = this.click.bind(this);
        this.blur = this.blur.bind(this);
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
                begin: moment(),
                end: moment().add(1, 'months')
            };
        } else {
            range = {...this.state.range};
        }

       // console.log('range = ', range.begin.format('YYYY-MM-DD'), range.end.format('YYYY-MM-DD'));

        for (let bill of getBills){
            const date = moment(bill.next);
            //console.log('date = ', date.format('YYYY-MM-DD'), date.isBetween(range.being, range.end, '[]'), range.begin.format('YYYY-MM-DD'), range.end.format('YYYY-MM-DD'));
            console.log('date = ', date.format('YYYY-MM-DD'), date.isSameOrAfter(range.begin) && date.isSameOrBefore(range.end), range.begin.format('YYYY-MM-DD'), range.end.format('YYYY-MM-DD'));
            // if (date.isBetween(range.being, range.end, '[]')){
            //     bill.location = 'bills';
            //     bills.push(bill);
            // }

            if (date.isSameOrAfter(range.begin) && date.isSameOrBefore(range.end)){
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

        console.log('bills = ', bills);
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
    
            current[moveFrom].splice(current[moveFrom].indexOf(bill), 1);
            
            bill.location = moveTo;
            
            if (moveTo == 'nexts'){
                const frequency = bill.frequency.split(' ');
                bill.next = moment(bill.next).add(frequency[0], frequency[1]).format('YYYY-MM-DD');
            }
            
            current[moveTo].push(bill);
            
            this.setState(current, () => {
                //console.log('click state = ', this.state);
            },() => {
                this.load();
            });
        }
    }

    blur(date, identifier){
        const range = {...this.state.range};
        const x = moment(date);
        
        if (identifier == 'begin'){
            range.begin = x;
        } else {
            range.end = x;
        }

        this.setState({
            range: range
        }, () => {
            this.load();
        });
    }
    
    render() {
        return <div className="bill">
            <div className="range">
                <div>bills</div>
                <div>
                    <Date 
                        identifier="begin"
                        value={this.state.range.begin} 
                        onBlur={this.blur}
                    /> <span>to</span>
                    <Date 
                        identifier="end"
                        value={this.state.range.end} 
                        onBlur={this.blur}
                    />
                </div>
            </div>
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
