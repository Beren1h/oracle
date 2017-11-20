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
            readOnly: false
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

    onFocus(e){
        e.target.select();
        //e.stopPropagation();
        // if(this.props.onFocus){
        //     this.props.onFocus(e);50
        // }
    }

    onClick(e){
        
        console.log('date click');
        
        this.setState({
            isme: true  
        });
        //console.log(e.target);
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

        this.setState({
            isme: false
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
        if(!this.state.readOnly) {
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

export default Date;
