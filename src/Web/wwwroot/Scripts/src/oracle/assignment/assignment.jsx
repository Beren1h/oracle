import React, { Component } from 'react';
import { GetAssignments, GetEnvelopes, GetPostResult, GetPostError } from '../api.js';
import { SortByAlpha } from '../helper.js';
import './assignment.scss';
import moment from 'moment';
import Input from './input.jsx';
import { EnsureEmpty } from '../helper.js';
import NumberFormat from 'react-number-format';
import classNames from 'classnames';

class Assignment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            byDay: [],
            envelope: '',
            yearStart: this.props.year + '-01-01',
            yearEnd: this.props.year + '-12-31',
            today: moment().subtract(14, 'days').format('YYYY-MM-DD'),
            assignments: [],
            envelopes: [],
            summary:[]
        };

        this.refreshAssignments = this.refreshAssignments.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.buildSummary = this.buildSummary.bind(this);
        this.onClick = this.onClick.bind(this);
        this.byDay = this.byDay.bind(this);
        this.renderInput = this.renderInput.bind(this);
    }

    componentWillMount() {
        this.refreshData();
    }

    refreshData() {
        GetEnvelopes()
            .then((response) => {
                response.data.sort((a, b) => SortByAlpha(a, b));
                this.setState({
                    envelopes: response.data
                }, () => {
                    this.refreshAssignments();
                });
            });
    }

    refreshAssignments() {
        GetAssignments()
            .then((response) => {
                response.data.sort((a, b) => SortByAlpha(a.envelope, b.envelope));
                this.setState({
                    assignments: response.data
                }, () => {
                    this.buildSummary();
                });
            });
    }

    buildSummary() {
        let summary = [];
        this.state.envelopes.forEach((envelope) => {
            let matches = this.state.assignments.filter(assignment => {
                return assignment.envelope == envelope;
            });
            let total = 0;
            let pastTotal = 0;
            matches.forEach((match) => {
                if (match.date < moment(this.state.today).format('YYYY-MM-DD')) {
                    pastTotal += match.amount;
                } else {
                    total += match.amount;
                }
            });
            summary.push({
                envelope: envelope,
                historicSum: pastTotal,
                projectedSum: total,
                assignments: matches
            });
            // console.log(summary);
            this.setState({
                summary: summary,
                envelope: ''
            });
        });
    }

    byDay(envelope) {
        let byDay = [];
        let assignments = this.state.summary.find((obj) => {
            return obj.envelope === envelope;
        }).assignments;

        // let today = moment(this.state.today).subtract(14, 'days');
        let today = moment(this.state.today);
        let end = moment(this.state.yearEnd);
        let total = 0;
        let totalByDay = 0;

        for(let j=1; j<=end.diff(today, 'days'); j++){
            // let today = moment(this.state.today).subtract(14, 'days');
            let today = moment(this.state.today);
            let day = today.add(j, 'days');
            let filter = assignments.filter((assignment) => {
                return moment(assignment.date).format() == day.format();
            });
            let match = filter[0] ? filter[0] : { _id: null, date: day.format(), amount: 0, note: '', poolId: null };
            total += match.amount;
            byDay.push({
                _id: match._id,
                date: day.format(),
                amount: match.amount,
                note: EnsureEmpty(match.note),
                poolId: match.poolId,
                total: total
            });
        }
        // console.log(byDay);
        this.setState({
            byDay: byDay
        });
    }

    onClick(envelope) {
        this.setState({
            envelope: envelope
        });

        this.byDay(envelope);
    }

    renderInput() {
        if (this.state.envelope){
            let historic = this.state.summary.filter(item => {
                return item.envelope == this.state.envelope;
            });
            // console.log(historic[0].historicSum);
            // console.log(this.state.envelope);
            return <Input 
                envelope={this.state.envelope} 
                byDay={this.state.byDay}
                historicSum={historic[0].historicSum}
                handleRefresh={this.refreshData}
                />;
        }
        return '';
    }

    render() {
        return <div className={'assignment'}>
            <div className={'item'}>
                <div className={'summary'}>
                    { 
                        this.state.summary.map((loop, index) => {
                            return <div className={classNames({
                                'row': true,
                                'warning': parseFloat(loop.projectedSum) + parseFloat(loop.historicSum) < 0
                            })} key={index} onClick={() => this.onClick(loop.envelope)}>
                                <span>{loop.envelope}</span>
                                <NumberFormat value={loop.projectedSum + loop.historicSum} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalPrecision={2} />
                            </div>;
                        })
                    }
                </div>
            </div>
            <div className={'item'}>
                {
                    this.renderInput()
                }
            </div>
        </div>;
    }
}

export default Assignment;
