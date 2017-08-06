import React, { Component } from 'react';
import moment from 'moment';
import './pool.scss';
import { GetAssignmentsByPoolId, CommitAssignments, GetEnvelopes, GetPostResult, GetPostError } from '../api.js';
import { EnsureEmpty, SortByAlpha } from '../helper.js';
import Input from './input.jsx';

class Pool extends Component {
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
        // this.onCancel = this.onCancel.bind(this);
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

        // this.props.envelopes.map((envelope, index) => {
        //     assignments.push({
        //         date: this.props.pool.date,
        //         envelope: this.props.envelopes[index],
        //         amount: 0,
        //         note: '',
        //         poolId: this.props.pool._id
        //     });
        // });
    }

    onSum(assignments){
        let sum = 0.0;
        assignments.map((assignment) => {
            sum += parseFloat(assignment.amount);
        });
        // setState({
        //     total: sum
        // })
        return sum;
    }
    onPost() {
        // let assignments = this.state.assignments.slice();
        // assignments.map((assignment, index) => {
        //     assignment.amount = assignment.amount ? assignment.amount : 0
        // });
        // this.setState({
        //     assignments: assignments
        // });
        CommitAssignments(this.state.assignments)
            .then((response) => {
                this.setState({
                    result: GetPostResult(response)
                });
                // setTimeout(this.props.handleRefresh, 1000);
            })
            .catch((error) => {
                this.setState({
                    result: GetPostError(error)
                });
            });      
    }

    onBlur(e) {
        // let pool = parseFloat(this.props.pool.amount);
        // let total = parseFloat(this.state.total);
        // console.log(pool, total);
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

    render() {
        return (<div>
            <h3>{this.props.pool.date}</h3>
            <h3>{this.props.pool.amount}</h3>
            <h3>{this.state.total}</h3>
            <h3>{this.props.pool.amount - this.state.total}</h3>
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
            <button type="submit" onClick={this.onPost}>submit</button>
            <button type="cancel" onClick={this.onCancel}>cancel</button>
            <h3>{this.state.result.status}</h3>
            <h3>{this.state.result.message}</h3>
        </div>);
    }
}

export default Pool;
