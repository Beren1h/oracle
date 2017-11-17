import React, { Component } from 'react';

class Envelope extends Component {
    constructor(props) {
        super(props);

        this.state = {
            async: false
        };

        this.load = this.load.bind(this);
    }

    async componentWillMount(){
        await this.load();
    }

    async load(){
    }


    render() {
        return <div>envelope</div>;
    }
}

export default Envelope;
