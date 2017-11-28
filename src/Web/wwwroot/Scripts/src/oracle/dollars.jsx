import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

class Dollars extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: 0
        };

        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentWillMount(){
        this.setState({
            amount: this.props.value,
            display: this.props.isEdit ? 'input' : 'text'
        });
    }

    componentWillReceiveProps(nextProps){
        if (nextProps){
            this.setState({
                amount: nextProps.value,
                display: nextProps.isEdit ? 'input' : 'text'
            });
        }
    }

    componentDidUpdate(prevProps, prevState){
        // i am in edit more and the intended target.  find the input control and focus.
        if (this.props.isEdit && this.state.amTarget){
            const dom = document.getElementById(this.props.id);
            if (dom){
                dom.focus();
                this.setState({
                    amTarget: false
                });
            }
        }
    }

    onClick(e){

        // i was clicked.  i am intended target
        this.setState({
            amTarget: true  
        });

        // i was clicked while in edit mode.  stop click from
        // propagating to edit mode toggle
        if(this.props.isEdit){
            e.stopPropagation();
        }
    }

    onFocus(e){
        // this was a nightmare.  NumberFormat doesn't seem to respect a 
        // e.target.select() in the dole scenario so have to hack around it
        const target = e.target;
        setTimeout(() => {target.select();}, 0);
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

        this.setState({
            amTarget: false
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

Dollars.defaultProps = {
    isEdit: true
};

Dollars.propTypes = {
    isEdit: PropTypes.bool
//   taxState: PropTypes.string.isRequired,
//   customerName: PropTypes.string,
//   customerMonthly: PropTypes.number.isRequired,
//   customerDown: PropTypes.number.isRequired,
//   decisions: PropTypes.arrayOf(PropTypes.shape({
//     Amount: PropTypes.number,
//     Rate: PropTypes.number,
//     Down: PropTypes.number,
//     Monthly: PropTypes.number,
//     Term: PropTypes.number,
//   })).isRequired,
};

export default Dollars;
