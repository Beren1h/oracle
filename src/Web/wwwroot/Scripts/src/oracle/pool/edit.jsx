import React, { Component } from 'react';

class Edit extends Component{
    constructor(props){
        super(props);

        this.state = {
            status: '',
            message: ''
        }
    }

    componentWillMount() {
        console.log('props = ', this.props);
    }

    render() {
        return (<div>
            <h3>{this.state.status}</h3>
            <h3>{this.state.message}</h3>
            <span>
                {this.props.pool.date}
            </span>
            <input
                id="pool-amount"
                type="text"
                value={this.props.pool.amount}
                onChange={(e) => this.onChange('amount', e)}
            />
            <input
                id="pool-note"
                type="text"
                value={this.props.pool.note ? this.props.pool.note : ''}
                onChange={(e) => this.onChange('note', e)}
            />
            <button type="submit" onClick={this.props.handleEdit}>submit</button>
        </div>);
    }
}

export default Edit;