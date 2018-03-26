import React ,{Component} from "react";

export default (WrappedComponent ,name)=>{
    class NewComponent extends Component {
        constructor(){
            super();
            this.state={
                data:null
            };
        }
        componentWillMount(){
            var data = localStorage.getItem(name);
            data=JSON.parse(data)
            this.setState({data})
            console.log(name,this.state.data);
        }

        render(){
            return <WrappedComponent data={this.state.data}/>
        }
    }
 
    return NewComponent;
}