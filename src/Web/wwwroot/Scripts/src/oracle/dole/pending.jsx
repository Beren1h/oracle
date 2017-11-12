import React, { Component } from 'react';

class Envelopes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pendings: []
        };

        this.removePending = this.removePending.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps){
            this.setState({
                pendings: nextProps.pendings
            }, () => {
                //console.log('receive pendings = ', this.state.pendings);
            });
        }
    }

    removePending(index){

        this.props.removePending(index);
    }

    onChange(e, index){
        const pendings = this.state.pendings.slice(0);
        const amount = e.target.value;
        
        pendings[index].amount = amount;

        this.setState({
            pendings: pendings
        });
    }

    render() {
        // console.log('render pendings = ', this.state.pendings);
        return <div>
            <h3>pendings</h3>
            {
                this.state.pendings.map((pending, index) => {
                    return <div key={index}>
                        <a onClick={() => this.removePending(index)}>{pending.envelope.name}</a>
                        <input type="text" onChange={(e) => this.onChange(e, index)} value={pending.amount} />
                    </div>;
                })
            }
        </div>;
    }
}

export default Envelopes;
