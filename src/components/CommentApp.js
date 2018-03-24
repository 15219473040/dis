import React,{Component} from 'react';
import CommenInput from "./CommenInput";
import CommenList from "./CommenList";
export default class CommentApp extends Component{
    constructor(props) {
        super(props);
        this.state={
            arr:[]
        }
        
    }
    getV=(s)=>{
         
       this.state.arr.push(s);
       this.setState({
           arr:this.state.arr
       })
    }
    render(){
        return <div className="commenBox">
                    <CommenInput  appclick={this.getV}/>
                    <CommenList list={this.state.arr}/>
                </div>
    }
}
