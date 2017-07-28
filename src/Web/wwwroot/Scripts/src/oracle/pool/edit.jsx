import React, { Component } from 'react';
import { CommitPool, GetPostResult, GetPostError } from '../api.js';

class Edit extends Component{
    constructor(props){
        super(props);

        this.state = {
            pool: {
                date: '',
                amount: '',
                note: ''
            },
            result: {
                status: '',
                message: ''
            }
        };

        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onPost = this.onPost.bind(this);
    }

    componentWillMount() {
        this.setState({
            pool: Object.assign({}, this.props.pool)
        });
    }

    onChange(field, e) {
        let update = { 
            pool: this.state.pool
        };
        update.pool[field] = e.target.value;
        this.setState(update);
    }

    onCancel(){
        this.setState({
            pool: this.props.pool
        });
        this.props.handleCancel();
    }

    onPost() {
        CommitPool(this.state.pool)
            .then((response) => {
                this.setState({
                    result: GetPostResult(response)
                });
                setTimeout(this.props.handleRefresh, 1500);
            })
            .catch((error) => {
                this.setState({
                    result: GetPostError(error)
                });
            });      
    }

    render() {
        return (<div>
            { this.props.pool.date ?
                <span>
                    {this.state.pool.date}
                </span>
                :
                <input
                    id="pool-date"
                    type="text"
                    value={this.state.pool.date}
                    onChange={(e) => this.onChange('date', e)}
                />            
            }
            <input
                id="pool-amount"
                type="text"
                value={this.state.pool.amount}
                onChange={(e) => this.onChange('amount', e)}
            />
            <input
                id="pool-note"
                type="text"
                value={this.state.pool.note ? this.state.pool.note : ''}
                onChange={(e) => this.onChange('note', e)}
            />
            <button type="submit" onClick={this.onPost}>submit</button>
            <button type="cancel" onClick={this.onCancel}>cancel</button>
            <h3>{this.state.result.status}</h3>
            <h3>{this.state.result.message}</h3>
        </div>);
    }
}

export default Edit;