import React, { Component } from 'react';
import moment from 'moment';
import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';

class Date extends Component {
    constructor(props) {
        super(props);

        this.state = {
            year: '',
            date: '',
            mmdd: '',
            display: 'input'
        };

        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentWillMount(){
        //console.log('date props = ', this.props);
        const m = moment(this.props.value);

        this.setState({
            year: m.format('YYYY'),
            date: m.format('YYYY-MM-DD'),
            mmdd: m.format('MM-DD'),
            display: this.props.display ? this.props.display : 'input',
            isEdit: this.props.isEdit
        }, () => {
            //console.log('date state = ', this.state);
        });
    }

    componentWillReceiveProps(nextProps){
        if (nextProps){
            const m = moment(nextProps.value);
            
            this.setState({
                year: m.format('YYYY'),
                date: m.format('YYYY-MM-DD'),
                mmdd: m.format('MM-DD'),
                display: nextProps.display ? nextProps.display : 'input',
                isEdit: nextProps.isEdit
            }, () => {
                //console.log('date state = ', this.state);
            });
        }
    }

    componentDidUpdate(prevProps, prevState){
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

    onFocus(e){
        e.target.select();
    }

    onClick(e){
        
        this.setState({
            amTarget: true  
        });

        if(this.props.isEdit){
            e.stopPropagation();
        }
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

        this.setState({
            amTarget: false
        });

        if (this.props.onBlur){
            if (this.props.identifier){
                this.props.onBlur(date, this.props.identifier);
            } else {
                this.props.onBlur(date);
            }
        }
        
    }

    render() {
        //console.log('date readonly = ', this.state.readOnly);
        if(this.state.isEdit) {
        //if (this.state.display == 'input'){
            return <InputMask 
                id={this.props.id}
                mask="99-99" 
                maskChar=" " 
                placeholder="MM-DD"
                className={this.props.className}
                value={this.state.mmdd} 
                onFocus={this.onFocus} 
                onChange={this.onChange} 
                onBlur={this.onBlur} 
                onClick={this.onClick}
            />;
        } else {
            return <div onClick={this.onClick}>
                {this.state.mmdd}
            </div>;
        }
    }
}

Date.defaultProps = {
    isEdit: true
};

Date.propTypes = {
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

export default Date;
