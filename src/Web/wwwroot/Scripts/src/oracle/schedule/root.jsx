import React, { Component } from 'react';
import moment from 'moment';
import './schedule.scss';


class Schedule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            start: '',
            end: '2018-12-31',
            frequency: '1',
            period: 'months',
            result: []
        };

        this.calculate = this.calculate.bind(this);
        this.onStartChange = this.onStartChange.bind(this);
        this.onCombinedChange = this.onCombinedChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    componentWillMount(){
        this.setState({
            end: this.props.year + '-12-31'    
        });
    }

    calculate(){
        const end = moment(this.state.end);

        let current = moment(this.state.start);
        let result = [];

        for (let i = 0; i < 100; i ++){
            current = current.add(this.state.frequency, this.state.period);

            if (current.isSameOrBefore(end)){
                result.push(current.format('YYYY-MM-DD'));
            } 
        }

        this.setState({
            result: result
        });
    }

    onStartChange(e){
        this.setState({
            start: e.target.value
        });
    }

    onCombinedChange(e){
        let split = e.target.value.split(' ');
        this.setState({
            frequency: split[0],
            period: split[1]
        });
    }

    onBlur(){
        this.calculate();
    }

    render() {
        return <div>
            <input type="text" value={this.state.start} onChange={this.onStartChange} onBlur={this.onBlur} />
            <input type="text" value={this.state.combined} onChange={this.onCombinedChange} onBlur={this.onBlur} />
            <ul>
                {
                    this.state.result.map((result, index) => {
                        return <li key={index}>{result}</li>;
                    })
                }
            </ul>
        </div>;
    }
}

export default Schedule;
