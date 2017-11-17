import React, { Component } from 'react';
import moment from 'moment';
import InputMask from 'react-input-mask';

class Envelopes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            year: '',
            date: '',
            mmdd: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    componentWillMount(){
        //console.log('date props = ', this.props);
        const m = moment(this.props.initial);

        this.setState({
            year: m.format('YYYY'),
            date: m.format('YYYY-MM-DD'),
            mmdd: m.format('MM-DD')
        }, () => {
            //console.log('date state = ', this.state);
        });
    }

    onFocus(e){
        e.target.select();
    }

    onChange(e){
        this.setState({
            mmdd: e.target.value
        });
    }

    onBlur(e){
        const date = moment(this.state.year + '-' + e.target.value).format('YYYY-MM-DD');

        if (date == 'Invalid date'){
            return;
        }

        this.props.onBlur(date);
    }

    render() {
        return <InputMask 
            mask="99-99" 
            maskChar=" " 
            placeholder="MM-DD"
            value={this.state.mmdd} 
            onFocus={this.onFocus} 
            onChange={this.onChange} 
            onBlur={this.onBlur} 
        />;
    }
}

export default Envelopes;
