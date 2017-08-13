import React, { Component } from 'react';
import { EnsureEmpty } from '../helper.js';
import { CommitAssignments, GetPostResult, GetPostError } from '../api.js';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import classNames from 'classnames';


class Input extends Component{
    constructor(props){
        super(props);

        this.state = {
            assignment: {
                date: '',
                envelope: this.props.envelope,
                amount: 0,
                note: '',
                total: 0
            },
            isDirty: false,
            result: {
                status: '',
                message: ''
            }
        };

        this.onChange = this.onChange.bind(this);
        this.onPost = this.onPost.bind(this);
        this.buildAssignments = this.buildAssignments.bind(this);
        this.recalculateTotals = this.recalculateTotals.bind(this);
    }

    componentWillMount() {
        this.buildAssignments(this.props.byDay);
    }

    componentWillReceiveProps(nextProps){
        this.buildAssignments(nextProps.byDay);
    }

    recalculateTotals() {
        let assignments = this.state.assignments.slice(0);
        let total = 0;

        assignments.map((assigment) => {
            total += parseFloat(assigment.amount);
            assigment.total = total;
        });

        this.setState({
            assignments: assignments
        }, () => {
            let isDirty = false;
            for(let i = 0; i <= assignments.length -1; i++){
                if(assignments[i].amount != this.props.byDay[i].amount){
                    isDirty = true;
                    break;
                }
            }

            this.setState({
                isDirty: isDirty
            });

            // console.log('is dirty', isDirty)
        });

    }

    buildAssignments(byDay) {
        //console.log(byDay);
        let assignments = [];
        byDay.map((day) => {
            // console.log(day.total, this.props);
            assignments.push({
                _id: day._id,
                date: day.date,
                envelope: this.props.envelope,
                amount: day.amount,
                note: day.note,
                poolId: day.poolId,
                total: day.total
            });
        });

        // console.log(assignments);
        this.setState({
            assignments: assignments
        });
    }

    onPost() {
        let nonZero = [];

        this.state.assignments.map((assignment) => {
            if(assignment.amount != 0 || assignment._id ){
                nonZero.push(assignment);
            }
        });

        CommitAssignments(nonZero)
            .then((response) => {
                this.setState({
                    result: GetPostResult(response)
                });
                setTimeout(this.props.handleRefresh, 1000);
            })
            .catch((error) => {
                this.setState({
                    result: GetPostError(error)
                });
            });      
    }

    onChange(field, index, e) {

        let value = e.target.value.replace(',', '').replace('$', '');

        let assignments = this.state.assignments;
        let assignment = assignments[index];

        assignment[field] = value;

        this.setState({
            assignments: assignments
        });

        this.recalculateTotals();
    }

    render() {
        return <div className={'detail'}>
            <div className={'column'}>
            { 
                this.state.assignments.map((loop, index) => {
                    return <div className={'b'} key={index}>
                        <input
                            className={classNames({
                                'poolId': loop.poolId
                            })}
                            id="assignment-date"
                            type="text"
                            value={moment(loop.date).format('YYYY-MM-DD')}
                            disabled={true}
                        />   
                        <NumberFormat
                            id="assignment-amount"
                            className={classNames({
                                'poolId': loop.poolId
                            })}
                            thousandSeparator={true} 
                            prefix={'$'}                            
                            decimalPrecision={2}
                            allowNegative={true}
                            type="text"
                            value={loop.amount}
                            disabled={loop.poolId}
                            onChange={(e) => this.onChange('amount', index, e)}
                        />
                        <NumberFormat
                            id="assignment-sum"
                            className={classNames({
                                'poolId': loop.poolId,
                                'warning': loop.total + this.props.historicSum < 0
                            })}
                            thousandSeparator={true} 
                            prefix={'$'}                            
                            decimalPrecision={2}
                            allowNegative={true}
                            type="text"
                            value={loop.total + this.props.historicSum}
                            disabled={true}
                        />
                    </div>;
                })
            }
            </div>
            <div className={'column'}>
                <div className={'fixed'}>
                    <div className={'title'}>{this.props.envelope}</div>
                    <div className={'item2'}>
                        <a className={classNames({
                            'dirty': this.state.isDirty
                        })} onClick={this.onPost}>submit</a>
                    </div>
                    <div>{this.state.result.status}</div>
                    <div>{this.state.result.message}</div>
                </div>
            </div>            
        </div>;
    }
}

export default Input;
