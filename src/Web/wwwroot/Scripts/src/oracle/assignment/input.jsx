import React, { Component } from 'react';
import { EnsureEmpty, EnsureZero } from '../helper.js';
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
        this.buildAssignments(this.props.byDay, this.props.envelope);
    }

    componentWillReceiveProps(nextProps){
        this.buildAssignments(nextProps.byDay, nextProps.envelope);
    }

    recalculateTotals() {
        let assignments = this.state.assignments.slice(0);
        
        let total = 0;

        assignments.map((assignment) => {
            total += parseFloat(EnsureZero(assignment.amount));
            assignment.total = total;
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
        });

    }

    buildAssignments(byDay, envelope) {
        let assignments = [];
        byDay.map((day) => {
            assignments.push({
                _id: day._id,
                date: day.date,
                envelope: envelope,
                amount: day.amount != 0 ? day.amount: '',
                note: day.note,
                poolId: day.poolId,
                total: day.total
            });
        });

        this.setState({
            assignments: assignments
        });
    }

    onPost() {
        let nonZero = [];

        this.state.assignments.map((assignment) => {
            let clone = Object.assign({}, assignment);
            clone.amount = EnsureZero(clone.amount);   
            if (clone.amount != 0 || clone._id){
                nonZero.push(clone);
            }
        });

        CommitAssignments(nonZero)
            .then((response) => {
                this.setState({
                    result: GetPostResult(response)
                }, () => {
                    setTimeout(this.props.handleRefresh, 1000);
                });
            })
            .catch((error) => {
                this.setState({
                    result: GetPostError(error)
                });
            });      
    }

    onChange(field, index, e) {

        let value = e.target.value.replace(',', '').replace('$', '');

        if(value == '-'){
            return;
        }

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
            {
                this.state.result.status ?
                    <div className={'success'}>
                        <h1>{this.state.result.status}</h1>
                    </div>
                    :
                    <div className={'column'}>
                        { 
                            this.state.assignments.map((loop, index) => {
                                return <div key={index}>
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
            }
            {
                !this.state.result.status ?
                    <div className={'column'}>
                        <div className={'fixed'}>
                            <div className={'title'}>{this.props.envelope}</div>
                            <div>
                                <a className={classNames({
                                    'dirty': this.state.isDirty
                                })} onClick={this.onPost}>submit</a>
                            </div>
                            <div className={'error'}>{this.state.result.message}</div>                            
                        </div>
                    </div> :
                    ''         
            }
        </div>;
    }
}

export default Input;
