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

    onPost() {
        CommitAssignments([this.state.assignment])
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

    onChange(field, e) {
        let update = { 
            assignment: this.state.assignment
        };
        update.assignment[field] = e.target.value;
        this.setState(update);
    }

    render() {
        return <div>
            { 
                this.props.byDay.map((loop, index) => {
                    return <div key={index} onClick={() => this.onClick(loop.envelope)}>
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
                            onChange={(e) => this.onChange('amount', e)}
                        />
                        <input
                            id="assignment-note"
                            type="text"
                            value={ EnsureEmpty(loop.note) }
                            onChange={(e) => this.onChange('note', e)}
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
