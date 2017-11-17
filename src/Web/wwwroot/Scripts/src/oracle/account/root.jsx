import React, { Component } from 'react';

class Account extends Component {
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
        return <div>accounts</div>;
    }
}

export default Account;
