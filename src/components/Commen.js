import React, { Component } from 'react';

export default class Commen extends Component {
    constructor(props) {
        super(props);

    }
    componentWillMount() {
        console.log("willmount")
    }
    componentDidMount(){
        console.log("didmount")
    }
    componentWillUpdate() {
        console.log("componentWillUpdate")
    }
    componentDidUpdate() {
        console.log("componentDidUpdate")
    }
    componentWillUnmount(){
        console.log("willUnmount")
    }
    render() {
        console.log("render")
       
        return <div className="list cl">
                  <div className='list-l'>{this.props.arr.name}</div>
                  <div className='list-r'>{this.props.arr.cont}</div>
               </div>
    }
}
