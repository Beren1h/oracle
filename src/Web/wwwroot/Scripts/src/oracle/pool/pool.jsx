import React, { Component } from 'react';
import './pool.scss';

class Pool extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: '',
            amount: '',
            note: ''
        };

        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onClick() {
        console.log(this.state);
    }

    onChange(field, e) {
        const update = {};
        update[field] = e.target.value;
        this.setState(update);
    }

    render() {
        return (<div>
            <input
                id="pool-date"
                type="text"
                value={this.state.date}
                onChange={(e) => this.onChange('date', e)}
            />
            <input
                id="pool-amount"
                type="text"
                value={this.state.amount}
                onChange={(e) => this.onChange('amount', e)}
            />
            <input
                id="pool-note"
                type="text"
                value={this.state.note}
                onChange={(e) => this.onChange('note', e)}
            />
            <button type="submit" onClick={this.onClick}>submit</button>
        </div>);
    }
}

export default Pool;