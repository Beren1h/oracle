import React, { Component } from 'react';
import moment from 'moment';
import InputMask from 'react-input-mask';

class Date extends Component {
    constructor(props) {
        super(props);

        this.state = {
            year: '',
            date: '',
            mmdd: '',
            display: 'input',
            readOnly: false,
        };

        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    componentWillMount(){
        //console.log('date props = ', this.props);
        const m = moment(this.props.value);

        this.setState({
            year: m.format('YYYY'),
            date: m.format('YYYY-MM-DD'),
            mmdd: m.format('MM-DD'),
            display: this.props.display ? this.props.display : 'input',
            readOnly: this.props.readOnly
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
                readOnly: nextProps.readOnly
            }, () => {
                //console.log('date state = ', this.state);
            });
        }
    }

    onFocus(e){
        e.target.select();
        //e.stopPropagation();
        // if(this.props.onFocus){
        //     this.props.onFocus(e);50
        // }
    }

    onClick(e){
        console.log(e.target);
        //e.target.focus();
        //e.stopPropagation();
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
        if(!this.state.readOnly) {
        //if (this.state.display == 'input'){
            return <InputMask 
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
            return <div>
                {this.state.mmdd}
            </div>;
        }
    }
}

export default Date;
