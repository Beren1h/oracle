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
        this.onClick = this.onClick.bind(this);
    }

    componentWillMount(){
        this.setState({
            amount: this.props.value,
            display: this.props.readOnly ? 'text' : 'input'
        }, () => {
            //console.log('dollars state = ', this.state, this.props);
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

    componentDidUpdate(prevProps, prevState){
        if (!this.props.readOnly && this.state.isme){
            const dom = document.getElementById(this.props.id);
            if (dom){
                dom.focus();
                this.setState({
                    isme: false
                });
            }
        }
    }

    onClick(e){

        console.log('click');

        this.setState({
            isme: true  
        });

        if(!this.props.readOnly){
            e.stopPropagation();
        }
        // if (!this.props.readOnly){
        //     const dom = document.getElementById(this.props.id);
        //     if (dom){
        //         dom.focus();
        //     }
        // }

        //console.log('a click', this.props.onClick, this.props.onBlur);
        //console.log('click', this.props.readOnly);
        //this.onFocus(e);
        //e.target.focus();
        //

        // if(this.props.onClick){
        //     if (this.props.editing.on) {
        //         e.stopPropagation();
        //     }
        //     this.props.onClick();
        // }
    }

    onFocus(e){
        console.log('on focus');
        e.target.select();

        // if(this.props.onFocus){
        //     this.props.onFocus(e);
        // }
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

        this.setState({
            isme: false
        });

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
