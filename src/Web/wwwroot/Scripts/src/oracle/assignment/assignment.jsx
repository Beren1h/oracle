import React, { Component } from 'react';
import { GetAssignments, GetEnvelopes, GetPostResult, GetPostError } from '../api.js';
import { SortByAlpha } from '../helper.js';
import './assignment.scss';
import moment from 'moment';
import Input from './input.jsx';
import { EnsureEmpty } from '../helper.js';

class Assignment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            byDay: [],
            envelope: '',
            yearStart: '2017-01-01',
            yearEnd: '2017-12-31',
            today: moment().add(1, 'years').format('YYYY-MM-DD'),
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
            this.setState({
                summary: summary
            });
        });
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


    byDay(envelope) {

        let byDay = [];
        let assignments = this.state.summary.find((obj) => {
            return obj.envelope === envelope;
        }).assignments;

        // console.log(assignments);
        let today = moment(this.state.today);
        let end = moment(this.state.yearEnd);
        let total = 0;
        let totalByDay = 0;

        for(let j=1; j<=end.diff(today, 'days'); j++){
            let today = moment(this.state.today);
            let day = today.add(j, 'days');
            let filter = assignments.filter((assignment) => {
                return moment(assignment.date).format() == day.format();
            });
            let match = filter[0] ? filter[0] : { _id: null, date: day.format(), amount: 0, note: '' };
            total += match.amount;
            // if(total < 0){
            // console.log('below 0 on ', day.format('YYYY-MM-DD'));
            // }
            // console.log(day.format('YYYY-MM-DD'), match.amount);
            byDay.push({
                _id: match._id,
                date: day.format(),
                amount: match.amount,
                note: EnsureEmpty(match.note)
            });
        }

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

            console.log(this.state.byDay);

            // let assignments = this.state.summary.find((obj) => {
            //     return obj.envelope === this.state.envelope;
            // }).assignments;

            return <Input envelope={this.state.envelope} byDay={this.state.byDay}/>;
        }

        return '';
    }

    render() {
        return <div>
            { 
                this.state.summary.map((loop, index) => {
                    return <div key={index} onClick={() => this.onClick(loop.envelope)}>
                        <span>{loop.envelope}</span>
                        <span>{loop.projectedSum}</span>
                    </div>;
                })
            }
            {
                this.renderInput()
            }
        </div>;
    }
}

export default Assignment;
