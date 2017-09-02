import React, { Component } from 'react';
import moment from 'moment';
import './pool.scss';
import { GetEnvelopes, GetPools, CommitPool, GetPostResult, GetPostError } from '../api.js';
import { SortByAlpha } from '../helper.js';
import Input from './input.jsx';
import Dole from './dole.jsx';
import classNames from 'classnames';

class Pool extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: '',
            mode: '',
            index: '',
            pools: [],
            envelopes: [],
            assignments: []
        };

        this.refreshPoolList = this.refreshPoolList.bind(this);
        this.refreshEnvelopeList = this.refreshEnvelopeList.bind(this);
        this.onDateClick = this.onDateClick.bind(this);
        this.onReset = this.onReset.bind(this);
        this.updateMode = this.updateMode.bind(this);
        this.renderMode = this.renderMode.bind(this);
    }

    componentWillMount() {
        this.refreshPoolList();
        this.refreshEnvelopeList();
    }

    refreshEnvelopeList(){
        GetEnvelopes()
            .then((response) => {
                response.data.sort((a, b) => SortByAlpha(a, b));
                this.setState({
                    envelopes: response.data
                });
            });
    }

    refreshPoolList(){
        GetPools()
            .then((response) => {
                response.data.sort((a, b) => SortByAlpha(a.date, b.date));
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
        console.log('date click ', index);
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
            return <Input
                pool={{date: '', amount: '', note: ''}}
                handleRefresh={this.refreshPoolList}
                handleCancel={this.onReset}
                year={this.props.year}
            />;
            break;
        case 'edit':
            return <Input 
                pool={this.state.pools[this.state.index]} 
                handleRefresh={this.refreshPoolList}
                handleCancel={this.onReset}
            />;
            break;
        case 'dole':
            return  <Dole 
                pool={this.state.pools[this.state.index]}
                envelopes={this.state.envelopes}
                handleCancel={this.onReset}
                handleRefresh={this.refreshPoolList}
            />;
            break;
        }

        return '';
    }

    render() {
        return (<div className={'wrapper'}>
            <div className={'list'}>
                { 
                    this.state.pools.map((pool, index) => {
                        return <div key={index} onClick={() => this.onDateClick(index)}>
                            {pool.date}
                        </div>;
                    })
                }    
            </div>
            <div className={'actions'}>
                <div>
                    <a onClick={() => this.updateMode('new')}>new</a>
                    <a className={classNames({
                        'disabled' : this.state.date == ''
                    })} onClick={() => this.updateMode('edit')}>edit</a>
                    <a className={classNames({
                        'disabled' : this.state.date == ''
                    })} onClick={() => this.updateMode('dole')}>dole</a>
                    <label className={classNames({
                        'hidden' : this.state.date == '',
                        'notice': true
                    })}>{this.state.date}</label>
                </div>
            </div>
            {
                this.renderMode()
            }            
        </div>);
    }
}

export default Pool;
