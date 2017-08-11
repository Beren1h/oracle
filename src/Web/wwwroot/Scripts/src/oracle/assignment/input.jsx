import React, { Component } from 'react';
import { EnsureEmpty } from '../helper.js';
import { CommitAssignments, GetPostResult, GetPostError } from '../api.js';


class Input extends Component{
    constructor(props){
        super(props);

        this.state = {
            assignment: {
                date: '',
                envelope: this.props.envelope,
                amount: 0,
                note: ''
            },
            result: {
                status: '',
                message: ''
            }
        };

        this.onChange = this.onChange.bind(this);
        this.onPost = this.onPost.bind(this);
    }

    componentWillMount() {
        let assignments = [];
        this.props.byDay.map((day) => {
            assignments.push({
                _id: day._id,
                date: day.date,
                envelope: this.props.envelope,
                amount: day.amount,
                note: day.note,
                poolId: day.poolId
            });
        });

        this.setState({
            assignments: assignments
        });
    }

    onPost() {

        //console.log(this.state.assignments)

        let nonZero = [];

        this.state.assignments.map((assignment) => {
            if(assignment.amount != 0){
                nonZero.push(assignment);
            }
        });

        //console.log(nonZero);

        CommitAssignments(nonZero)
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

    onChange(field, index, e) {
        let assignments = this.state.assignments;
        let assignment = assignments[index];
        // let update = { 
        //     assignment: this.state.assignments[index]
        // };
        //update.assignment[field] = e.target.value;
        assignment[field] = e.target.value;
        //this.setState(update);
        this.setState({
            assignments: assignments
        });
    }

    render() {
        return <div>
            { 
                this.state.assignments.map((loop, index) => {
                    console.log(loop);
                    return <div key={index}>
                        <input
                            id="assignment-date"
                            type="text"
                            value={loop.date}
                            disabled={true}
                        />   
                        <input
                            id="assignment-amount"
                            type="text"
                            value={loop.amount}
                            disabled={loop.poolId}
                            onChange={(e) => this.onChange('amount', index, e)}
                        />
                        <input
                            id="assignment-note"
                            type="text"
                            value={ EnsureEmpty(loop.note) }
                            disabled={loop.poolId}
                            onChange={(e) => this.onChange('note', index, e)}
                        />
                    </div>;
                })
            }
            <button type="submit" onClick={this.onPost}>submit</button>
            <button type="cancel" onClick={this.onCancel}>cancel</button>
            <h3>{this.props.envelope}</h3>
            <h3>{this.state.result.status}</h3>
            <h3>{this.state.result.message}</h3>
        </div>;
    }
}

export default Input;
