import React, { Component } from 'react';
import moment from 'moment';
import InputMask from 'react-input-mask';

class Envelopes extends Component {
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
    }

    componentWillMount(){
        //console.log('date props = ', this.props);
        const m = moment(this.props.value);

        this.setState({
            year: m.format('YYYY'),
            date: m.format('YYYY-MM-DD'),
            mmdd: m.format('MM-DD'),
            display: this.props.display ? this.props.display : 'input'
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
        if (this.state.display == 'input'){
            return <InputMask 
                mask="99-99" 
                maskChar=" " 
                placeholder="MM-DD"
                value={this.state.mmdd} 
                onFocus={this.onFocus} 
                onChange={this.onChange} 
                onBlur={this.onBlur} 
            />;
        } else {
            return <div>
                {this.state.mmdd}
            </div>;
        }
    }
}

export default Envelopes;
