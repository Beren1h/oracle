import React, { Component } from 'react';
import './bill.scss';
import { GET, POST } from '../api.js';
import moment from 'moment';
import Date from '../date.jsx';
import Dollar from '../dollars.jsx';
import { SortByAlpha } from '../helper.js';


class Bill extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bills: [],
            risks: [],
            nexts: [],
            range: {}
        };

        this.load = this.load.bind(this);
        this.click = this.click.bind(this);
        this.blur = this.blur.bind(this);
        this.post = this.post.bind(this);
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
                begin: moment('2018-01-01'),
                end: moment('2018-01-01').add(1, 'months')
            };
        } else {
            range = {...this.state.range};
        }

        for (let bill of getBills){
            const date = moment(bill.next);

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

        console.log('range = ', range.begin.format('YYYY-MM-DD'), range.end.format('YYYY-MM-DD'));
        this.setState({
            async: true,
            bills: bills.sort((a, b) => SortByAlpha(a.next, b.next)),
            risks: risks.sort((a, b) => SortByAlpha(a.next, b.next)),
            nexts: nexts.sort((a, b) => SortByAlpha(a.next, b.next)),
            range: range
        }, () => {
            //console.log('state = ', this.state);
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
            bill.isDirty = true;
            
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

    async post() {
        for (let bill of this.state.nexts){
            console.log('bill = ', bill);
            if (bill.isDirty){
                await POST.bill(bill);
            }
        }

        this.load();
        // this.setState({
        //     async: false
        // }, () => {
        //     this.load();
        // });

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
            {/* {
                this.state.async &&
                <div className="item scroller">
                    {
                        this.state.bills.map((bill, index) => {
                            return <a key={index} onClick={() => this.click(bill)}>
                                <div className="detail">
                                    <div>{bill.name}</div>
                                    <div>{bill.description}</div>
                                </div>
                                <div className="detail">
                                    <div>{moment(bill.next).format('YYYY-MM-DD')}</div>
                                    <Dollar
                                        value={bill.amount}
                                        isEdit={false}
                                    />
                                </div>
                            </a>;
                        })
                    }
                </div>
            } */}
            <div className="item scroller">
                {
                    this.state.bills.map((bill, index) => {
                        return <a key={index} onClick={() => this.click(bill)}>
                            <div className="detail">
                                <div>{bill.name}</div>
                                <div>{bill.description}</div>
                            </div>
                            <div className="detail">
                                <div>{moment(bill.next).format('YYYY-MM-DD')}</div>
                                <Dollar
                                    value={bill.amount}
                                    isEdit={false}
                                />
                            </div>
                        </a>;
                    })
                }
            </div>
            {/* {
                this.state.async &&
                <div className="next scroller">
                    {
                        this.state.nexts.map((bill, index) => {
                            return <a key={index} onClick={() => this.click(bill)}>
                                <div className="detail">
                                    <div>{bill.name}</div>
                                    <div>{bill.description}</div>
                                </div>
                                <div className="detail">
                                    <div>{moment(bill.next).format('YYYY-MM-DD')}</div>
                                    <Dollar
                                        value={bill.amount}
                                        isEdit={false}
                                    />
                                </div>
                            </a>;
                        })
                    }
                </div>
            } */}
            <div className="next scroller">
                {
                    this.state.nexts.map((bill, index) => {
                        return <a key={index} onClick={() => this.click(bill)}>
                            <div className="detail">
                                <div>{bill.name}</div>
                                <div>{bill.description}</div>
                            </div>
                            <div className="detail">
                                <div>{moment(bill.next).format('YYYY-MM-DD')}</div>
                                <Dollar
                                    value={bill.amount}
                                    isEdit={false}
                                />
                            </div>
                        </a>;
                    })
                }
            </div>
            {/* {
                this.state.async &&
                <div className="risk scroller">
                    {
                        this.state.risks.map((bill, index) => {
                            return <a key={index} onClick={() => this.click(bill)}>
                                <div className="detail">
                                    <div>{bill.name}</div>
                                    <div>{bill.description}</div>
                                </div>
                                <div className="detail">
                                    <div>{moment(bill.next).format('YYYY-MM-DD')}</div>
                                    <Dollar
                                        value={bill.amount}
                                        isEdit={false}
                                    />
                                </div>
                            </a>;
                        })
                    }
                </div>
            } */}
            <div className="risk scroller">
                {
                    this.state.risks.map((bill, index) => {
                        return <a key={index} onClick={() => this.click(bill)}>
                            <div className="detail">
                                <div>{bill.name}</div>
                                <div>{bill.description}</div>
                            </div>
                            <div className="detail">
                                <div>{moment(bill.next).format('YYYY-MM-DD')}</div>
                                <Dollar
                                    value={bill.amount}
                                    isEdit={false}
                                />
                            </div>
                        </a>;
                    })
                }
            </div>
            <div className="actions">
                <a onClick={this.post}>
                    <i className="fa fa-check" />
                </a>
            </div>
        </div>;
    }
}

export default Bill;
