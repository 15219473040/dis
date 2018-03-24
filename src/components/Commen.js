import React, { Component } from 'react';

export default class Commen extends Component {
    constructor(props) {
        super(props);

    }
    render() {
       
       
        return <div className="list cl">
                  <div className='list-l'>{this.props.arr.name}</div>
                  <div className='list-r'>{this.props.arr.cont}</div>
               </div>
    }
}
