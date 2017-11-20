import React, { Component } from 'react';
import NumberFormat from 'react-number-format';

class Envelopes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: 0,
            readOnly: false
        };

        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    componentWillMount(){
        this.setState({
            amount: this.props.value,
            display: this.props.readOnly ? 'text' : 'input'
        }, () => {
            //console.log('dollars state = ', this.state);
        });
    }

    componentWillReceiveProps(nextProps){
        if (nextProps){
            this.setState({
                amount: nextProps.value,
                display: nextProps.readOnly ? 'text' : 'input'
            }, () => {
                //console.log('nextProps dollars state = ', this.state);
            });
        }
    }

    onClick(e){
        e.target.focus();
        //e.stopPropagation();
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
        if (this.props.onBlur){
            if (this.props.identifier){
                this.props.onBlur(this.state.amount, this.props.identifier);
            } else {
                this.props.onBlur(this.state.amount);
            }
        }        
    }

    render() {
        return <NumberFormat
            id={this.props.id}
            className={this.props.className}
            value={this.state.amount} 
            displayType={this.state.display} 
            thousandSeparator={true} 
            prefix={'$'} 
            decimalPrecision={2}
            onFocus={this.onFocus} 
            onChange={this.onChange} 
            onBlur={this.onBlur} 
            onClick={this.onClick}
        />;
    }
}

export default Envelopes;
