import React, { Component } from 'react';
import './dole.scss';
import { GetEnvelopes } from '../api.js';

class Dole extends Component{
    constructor(props){
        super(props);

        this.state = {
            assignments: [],
        };

        this.refreshEnvelopeList = this.refreshEnvelopeList.bind(this);
    }

    componentWillMount() {
        console.log('date', this.props.date);
        this.refreshEnvelopeList();
    }

    refreshEnvelopeList(){
        GetEnvelopes()
            .then((response) => {
                response.data.sort((a, b) => {
                    if(a < b){
                        return -1;
                    }
                    if(a > b){
                        return 1;
                    }
                    return 0;
                });
                let assignments = response.data.map((envelope, index) => {
                    return {
                        Envelope: envelope,
                        IsPoolDebit: true,
                        Date: this.props.date,
                        Note: '',
                        Amount: 0
                    }
                });
                this.setState({
                    assignments: assignments
                });
            });
    }

    render() {
        return(<div>
            {
                this.state.assignments.map((assignment, index) => {
                    return <div key={index}>
                        <span>
                            {assignment.Envelope}
                        </span>
                        <input 
                            type="text"
                            value={assignment.Amount}
                        />
                        <input
                            type="text"
                            value={assignment.Note}
                        />
                    </div>
                })
            }
        </div>);
    }
}

export default Dole;