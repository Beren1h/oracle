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
            });
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


    onChange(e){
        const checked = e.target.checked;
        this.setState({
            checked: e.target.checked,
            amTarget: false
        });

        if (this.props.onChange){
            if (this.props.identifier){
                this.props.onChange(e.target.checked, this.props.identifier);
            } else {
                this.props.onChange(e.target.checked);
            }            
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
                return <i className="fa fa-university" />;
            } 
            
            return <div></div>;
        }
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
