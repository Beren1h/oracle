import React, { Component } from 'react';
import { CommitPool, GetPostResult, GetPostError } from '../api.js';
import { EnsureEmpty } from '../helper.js';
import NumberFormat from 'react-number-format';
import InputMask from 'react-input-mask';
import classNames from 'classnames';

class Input extends Component{
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
            },
            mask: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onPost = this.onPost.bind(this);
    }

    componentWillMount() {
        this.setState({
            pool: Object.assign({}, this.props.pool),
            mask: '99-99' + this.props.year
        });
    }

    onChange(field, e) {
        let value = e.target.value.replace(',', '').replace('$', '');
        let update = { 
            pool: this.state.pool
        };
        update.pool[field] = value;
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

    render() {
        return <div className={'interactive'}>
            <div className={'list'}>
                {/* <input
                    className={classNames({
                        'hidden': this.props.pool.date
                    })}
                    id="pool-date"
                    type="text"
                    value={this.state.pool.date}
                    onChange={(e) => this.onChange('date', e)}
                /> */}
                <InputMask
                    id='pool-date'
                    value={this.state.pool.date}
                    onChange={(e) => this.onChange('date', e)}
                    mask={this.state.mask}
                    maskChar=' '
                />
                {/* <input
                    id="pool-amount"
                    type="text"
                    value={this.state.pool.amount}
                    onChange={(e) => this.onChange('amount', e)}
                /> */}
                <NumberFormat
                    id="pool-amount"
                    thousandSeparator={true} 
                    prefix={'$'}                            
                    decimalPrecision={2}
                    allowNegative={false}
                    type="text"
                    value={this.state.pool.amount}
                    onChange={(e) => this.onChange('amount', e)}
                />
                {/* <input
                    id="pool-note"
                    type="text"
                    value={ EnsureEmpty(this.state.pool.note) }
                    onChange={(e) => this.onChange('note', e)}
                /> */}
            </div>
            <div className={'actions'}>
                <div>
                    <a type="submit" onClick={this.onPost}>submit</a>
                    <a type="cancel" onClick={this.onCancel}>cancel</a>
                    <label>{this.state.result.status}</label>
                    <label>{this.state.result.message}</label>   
                </div>             
            </div>  
        </div>;
    }
}

export default Input;