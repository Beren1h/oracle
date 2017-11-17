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
        this.setState({
            amount: this.props.value
        }, () => {
            //console.log('dollars state = ', this.state);
        });
    }

    onFocus(e){
        e.target.select();
    }

    onChange(e){
        const amount = e.target.value.replace(',', '').replace('$', '');
        this.setState({
            amount: amount
        }, () => {
            if (this.props.onChange){
                this.props.onChange(amount, this.props.transaction);
            }
        });
    }

    onBlur(e){
        if (this.props.onBlur){
            this.props.onBlur(this.state.amount);
        }
    }

    render() {
        return <NumberFormat
            id={this.props.id}
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
