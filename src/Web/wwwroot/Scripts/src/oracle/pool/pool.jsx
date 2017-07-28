import React, { Component } from 'react';
import moment from 'moment';
import './pool.scss';
import { GetPools, CommitPool, GetPostResult, GetPostError } from '../api.js';
import New from './new.jsx';
import Edit from './edit.jsx';

class Pool extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: '',
            mode: '',
            index: '',
            pools: []
        };

        this.refreshPoolList = this.refreshPoolList.bind(this);
        this.onDateClick = this.onDateClick.bind(this);
        this.onReset = this.onReset.bind(this);
        this.updateMode = this.updateMode.bind(this);
        this.renderMode = this.renderMode.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    componentWillMount() {
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
                this.onReset();
            });
    }

    onReset() {
        this.setState({
            mode: 'off',
            date: ''
        });
    }

    onDateClick(index) {
        if (this.state.mode != 'off'){
            return;
        }

        let selected = this.state.pools[index];
        this.setState({
            date: selected.date,
            index: index
        });
    }

    formatDates(pools){
        pools.forEach((pool) => {
            pool.date = moment(pool.date).format('MM-DD-YYYY');
        });
        return pools;
    }

    updateMode(mode) {
        this.setState({
            mode: mode
        });
    }

    renderMode() {
        switch (this.state.mode){
        case 'new':
            return <Edit
                pool={{date: '', amount: '', note: ''}}
                handleRefresh={this.refreshPoolList}
                handleCancel={this.onReset}
            />;
            break;
        case 'edit':
            return this.state.index && <Edit 
                pool={this.state.pools[this.state.index]} 
                handleRefresh={this.refreshPoolList}
                handleCancel={this.onReset}
            />;
            break;
        case 'dole':
            break;
        }

        return '';
    }

    handleEdit(pool) {
        CommitPool(pool)
            .then((response) => {
                this.setState({
                    result: GetPostResult(response)
                });
                this.refreshPoolList();
            })
            .catch((error) => {
                this.setState({
                    mode: 'off',
                    result: GetPostError(error)
                });
            });      
    }

    render() {
        return (<div>
            <h3>{this.state.result}</h3>
            { this.state.mode == 'off' &&
                <div>
                    <h3>{this.state.date}</h3>
                    <button onClick={() => this.updateMode('new')}>new</button>
                    <button onClick={() => this.updateMode('edit')}>edit</button>
                    <button onClick={() => this.updateMode('dole')}>dole</button>
                    { 
                        this.state.pools.map((pool, index) => {
                            return <div key={index} onClick={() => this.onDateClick(index)}>
                                {pool.date}
                            </div>;
                        })
                    }
                </div>
            }
            {
                this.renderMode()
            }
        </div>);
    }
}

export default Pool;
