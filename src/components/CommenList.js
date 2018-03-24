import React, { Component } from 'react';
import Commen from "./Commen";
export default class CommenList extends Component {
    constructor(props){
        super(props);
        console.log(this.props.list)
      
    }
    render() {
        var arr=this.props.list||[]
        return <div className="listBox">
            
            {arr.map((item,ind)=><Commen arr={item} key={ind}/>)}
        </div>
    }
}
