import React, { Component } from 'react';
import NumberFormat from 'react-number-format';

class Envelopes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: 0
        };

        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    componentWillMount(){
        //console.log('dollars props = ', this.props);
        this.setState({
            amount: this.props.initial
        }, () => {
            //console.log('dollars state = ', this.state);
        });
    }

    onFocus(e){
        e.target.select();
    }

    onChange(e){
        console.log(e.target.value);
        this.setState({
            amount: e.target.value.replace(',', '').replace('$', '')
        }, () => {
            //console.log('state workinf = ', this.state.amount, parseFloat(this.state.amount));
        });
    }

    onBlur(e){
        // const date = moment(this.state.year + '-' + e.target.value).format('YYYY-MM-DD');

        // if (date == 'Invalid date'){
        //     return;
        // }

        this.props.callback(this.state.amount);
    }

    render() {
        return <NumberFormat 
            value={this.state.amount} 
            displayType={'input'} 
            thousandSeparator={true} 
            prefix={'$'} 
            decimalPrecision={2}
            onFocus={this.onFocus} 
            onChange={this.onChange} 
            onBlur={this.onBlur} 
        />;
    }
}

export default Envelopes;
