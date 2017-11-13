import React, { Component } from 'react';

class Envelopes extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return <div>
            <h3>envelopes</h3>
            {
                this.props.pendings.map((pending, index) => {
                    if (!pending.display){
                        return <div key={index}>
                            <a onClick={() => this.props.displayPending(pending.envelope._id)}>{pending.envelope.name}</a>
                        </div>;
                    }
                })
                // this.props.containers.map((pending, index) => {
                //     if (!pending.display){
                //         return <div key={index}>
                //             <a onClick={() => this.props.createPending(pending.envelope._id)}>{pending.envelope.name}</a>
                //         </div>;
                //     }
                // })
            }
        </div>;
    }
}

export default Envelopes;
//(e) => this.onChange('amount', index, e)
