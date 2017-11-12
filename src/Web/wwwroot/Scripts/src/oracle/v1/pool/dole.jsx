import React, { Component } from 'react';
import moment from 'moment';
import './pool.scss';
import { GetAssignmentsByPoolId, CommitAssignments, GetEnvelopes, GetPostResult, GetPostError } from '../api.js';
import { EnsureEmpty, SortByAlpha } from '../helper.js';
import numeral from 'numeral';

class Dole extends Component {
    constructor(props) {
        super(props);

        this.state = {
            total: 0.0,
            assignments: [],
            result: {
                status: '',
                message: ''
            }
        };

        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onPost = this.onPost.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onSum = this.onSum.bind(this);
    }

    componentWillMount() {
        let assignments = [];
        GetAssignmentsByPoolId(this.props.pool._id)
            .then((response) => {
                if (response.data.length == 0) {
                    this.props.envelopes.map((envelope, index) => {
                        assignments.push({
                            date: this.props.pool.date,
                            envelope: this.props.envelopes[index],
                            amount: 0,
                            note: '',
                            poolId: this.props.pool._id
                        });
                    });
                } else {
                    assignments = response.data;
                }

                this.setState({
                    total: this.onSum(assignments),
                    assignments: assignments
                });
            })
            .catch((error) => {
                console.log('error = ', GetPostError(error));
            });
    }

    onSum(assignments){
        let sum = 0.0;
        assignments.map((assignment) => {
            sum += parseFloat(assignment.amount);
        });
        return sum;
    }
    onPost() {
        CommitAssignments(this.state.assignments)
            .then((response) => {
                this.setState({
                    result: GetPostResult(response)
                }, () => { 
                    setTimeout(this.props.handleCancel, 1000);
                });
            })
            .catch((error) => {
                this.setState({
                    result: GetPostError(error)
                });
            });      
    }

    onBlur(e) {
        this.setState({
            total: this.onSum(this.state.assignments)
        });
    }

    onChange(field, index, e) {
        let assignments = this.state.assignments.slice();
        assignments[index][field] = e.target.value;
        this.setState({
            assignments: assignments
        });
    }

    onCancel() {
        this.props.handleCancel();
    }

    render() {
        return (<div className={'interactive'}>
            <div className={'list'}>
            {
                this.state.assignments.map((assignment, index) => {
                    return <div key={index}>
                        <input
                            id="dole-envelope"
                            type="text"
                            value={this.state.assignments[index].envelope}
                            disabled={true}
                        />
                        <input
                            id="dole-amount"
                            type="number"
                            value={this.state.assignments[index].amount}
                            onChange={(e) => this.onChange('amount', index, e)}
                            onBlur={this.onBlur}
                        />
                        <input
                            id="dole-note"
                            type="text"
                            value={ EnsureEmpty(this.state.assignments[index].note) }
                            onChange={(e) => this.onChange('note', index, e)}
                        />
                    </div>;
                }) 
            }
            </div>
            <div className={'actions'}>
                <div>
                    {/* <NumberFormat value={this.props.pool.amount} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalPrecision={2} />
                    <NumberFormat value={this.state.total} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalPrecision={2} />
                    <NumberFormat value={this.props.pool.amount - this.state.total} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalPrecision={2} /> */}
                    <label>{numeral(this.props.pool.amount).format('$0,0.00')}</label>
                    <label>{numeral(this.state.total).format('$0,0.00')}</label>
                    <label className={'notice'}>{numeral(this.props.pool.amount - this.state.total).format('$0,0.00')}</label>
                    <a type="submit" onClick={this.onPost}>submit</a>
                    <a type="cancel" onClick={this.onCancel}>cancel</a>
                    <label>{this.state.result.status}</label>
                    <label>{this.state.result.message}</label>
                </div>
            </div>
        </div>);
    }
}

export default Dole;
