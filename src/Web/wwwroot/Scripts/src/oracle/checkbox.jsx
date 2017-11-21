import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

class Checkbox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: false
        };

        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        //this.onBlur = this.onBlur.bind(this);
        //this.onFocus = this.onFocus.bind(this);
    }

    componentWillMount(){
        this.setState({
            checked: this.props.checked,
            isEdit: this.props.isEdit
        }, () => {
            //console.log('Checkbox state = ', this.state, this.props);
        });
    }

    componentWillReceiveProps(nextProps){
        if (nextProps){
            this.setState({
                checked: nextProps.checked,
                isEdit: nextProps.isEdit
            }, () => {
                //console.log('nextProps Checkbox state = ', this.state);
            });
        }
    }

    componentDidUpdate(prevProps, prevState){
        // // i am in edit more and the intended target.  find the input control and focus.
        // if (this.props.isEdit && this.state.amTarget){
        //     const dom = document.getElementById(this.props.id);
        //     if (dom){
        //         dom.focus();
        //         this.setState({
        //             amTarget: false
        //         });
        //     }
        // }
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

        //console.log('on click');
        //e.stopPropagation();
        //e.preventDefault();
        //return false;
    }


    onChange(e){
        //console.log('on change');
        //e.stopPropagation();
        const checked = e.target.checked;
        console.log('e = ', e.target.checked);
        this.setState({
            checked: e.target.checked,
            amTarget: false
        }, () => {
            console.log('checked state = ', this.state.checked);
        });

        if (this.props.onChange){
            this.props.onChange(e.target.checked);
        }
    }

    render() {
        if (this.state.isEdit){
            return <input
                type="checkbox"
                className={this.props.className}
                checked={this.state.checked}
                onChange={this.onChange}
                onClick={this.onClick}
            />;
        } else {
            if (this.state.checked){
                return <i className="fa fa-circle" />;
            } 
            
            return '';
        }
        // return <NumberFormat
        //     id={this.props.id}
        //     className={this.props.className}
        //     value={this.state.amount} 
        //     displayType={this.state.display} 
        //     thousandSeparator={true} 
        //     prefix={'$'} 
        //     decimalPrecision={2}
        //     onFocus={this.onFocus} 
        //     onChange={this.onChange} 
        //     onBlur={this.onBlur} 
        //     onClick={this.onClick}
        // />;
    }
}

Checkbox.defaultProps = {
//    isEdit: true
};

Checkbox.propTypes = {
//    isEdit: PropTypes.bool
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

export default Checkbox;
