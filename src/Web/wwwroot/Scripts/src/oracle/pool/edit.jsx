import React, { Component } from 'react';

class Edit extends Component{
    constructor(props){
        super(props);

        this.state = {
            pool: {},
            status: '',
            message: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    componentWillMount() {
        console.log('props = ', this.props);
        this.setState({
            // pool: this.props.pool
            // pool: { ...this.props.pool}
            pool: Object.assign({}, this.props.pool)
            //{ ...state, visibilityFilter: action.filter }
        });
    }

    onChange() {

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
                value={this.state.pool.amount}
                onChange={(e) => this.onChange('amount', e)}
            />
            <input
                id="pool-note"
                type="text"
                value={this.state.pool.note ? this.state.pool.note : ''}
                onChange={(e) => this.onChange('note', e)}
            />
            <button type="submit" onClick={() => this.props.handleEdit(this.state.pool)}>submit</button>
            <button type="cancel" onClick={this.onCancel}>cancel</button>
        </div>);
    }
}

export default Edit;