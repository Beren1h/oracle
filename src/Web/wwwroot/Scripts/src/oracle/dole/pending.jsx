import React, { Component } from 'react';

class Envelopes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pendings: []
        };

        this.hidePending = this.hidePending.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps){
            // nextProps.pendings.forEach((pending) => {
            //     if (pending.focus){
            //         console.log('set focus on ', pending.envelope.name);
            //         console.log(document.getElementById(pending.envelope._id));
            //     }
            // });
            this.setState({
                pendings: nextProps.pendings
            }, () => {
                //console.log('receive pendings = ', this.state.pendings);
            });
        }
    }

    componentDidUpdate(prevProps, prevState){
        this.props.pendings.forEach((pending) => {
            if (pending.focus){
                const dom = document.getElementById(pending.envelope._id);
                if (dom){
                    dom.focus();
                }
            }
        });
    }

    hidePending(id){

        //console.log(index, pending);
        this.props.hidePending(id);
    }

    onChange(e, index){
        const pendings = this.state.pendings.slice(0);
        const amount = e.target.value;
        
        pendings[index].amount = amount;

        this.setState({
            pendings: pendings
        });
    }

    handleFocus(e) {
        //console.log('SET FOCUS!!!');
        e.target.select();
    }

    render() {
        //console.log('render pendings = ', this.state.pendings);
        //console.log('rendering pendings');
        return <div>
            <h3>pendings</h3>
            {
                this.state.pendings.map((pending, index) => {
                    //if (pending.display){
                    //console.log(pending.envelope.name, pending.focus);
                    return <div key={index}>
                        <a onClick={() => this.hidePending(pending.envelope._id)}>{pending.envelope.name}</a>
                        <input id={pending.envelope._id} type="text" onChange={(e) => this.onChange(e, index)} value={pending.amount} onFocus={this.handleFocus} />
                    </div>;
                    //}
                })
            }
        </div>;
    }
}

export default Envelopes;
