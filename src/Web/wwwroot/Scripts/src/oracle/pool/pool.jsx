import React, { Component } from 'react';
import moment from 'moment';
import './pool.scss';
import { InsertPool, GetPools, GetPostResult, GetPostError } from '../api.js';

class Pool extends Component {
    constructor(props) {
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
            pools: []
        };

        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handlePostResult = this.handlePostResult.bind(this);
        this.handlePoolClick = this.handlePoolClick.bind(this);
        this.refreshPoolList = this.refreshPoolList.bind(this);
        this.formatDates = this.formatDates.bind(this);
    }

    componentWillMount(){
        this.refreshPoolList();
    }

    refreshPoolList(){
        GetPools()
            .then((response) => {
                response.data.sort((a, b) => {
                    if(a.date < b.date){
                        return -1;
                    }
                    if(a.date > b.date){
                        return 1;
                    }
                    return 0;
                });
                this.setState({
                    pools: this.formatDates(response.data)
                });
            });
    }

    formatDates(pools){
        pools.forEach((pool) => {
            pool.date = moment(pool.date).format('MM-DD-YYYY');
        });
        return pools;
    }

    handlePostResult(result) {
        this.setState({
            result: {
                status: result.status,
                message: result.message
            }
        });
    }

    handlePoolClick(index){
        this.setState({
           pool: Object.assign({}, this.state.pools[index])
        });
    }

    onClick() {
        InsertPool(this.state.pool)
            .then((response) => {
                this.handlePostResult(GetPostResult(response));
                this.refreshPoolList();
            })
            .catch((error) => {
                this.handlePostResult(GetPostError(error));
            });
    }

    onChange(field, e) {
        let update = { 
            pool: this.state.pool
        };
        update.pool[field] = e.target.value;
        this.setState(update);
    }

    render() {
        return (<div>
            <h3>{this.state.result.status}</h3>
            <h3>{this.state.result.message}</h3>
            <input
                id="pool-date"
                type="text"
                value={this.state.pool.date}
                onChange={(e) => this.onChange('date', e)}
            />
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
            <button type="submit" onClick={this.onClick}>submit</button>
            {
                this.state.pools.map((pool, index) => {
                    return <div key={index} onClick={() => this.handlePoolClick(index)}>{pool.date}</div>;
                })
            }            
        </div>);
    }
}

export default Pool;