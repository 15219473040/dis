import React, { Component } from 'react';

export default class CommentInput extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: "wang", cont: "content"  
        }

    }
    componentDidMount(){
        this.textarea.focus()
    }
    change = (e) => {
        var tar = e.target;
        var _this=this;
            (function(k,v){
                var obj={};
                obj[k]=v
                _this.setState(obj)
            }(tar.dataset.k, tar.value))
         
    }
    clickHandle = () => {
         this.props.appclick(this.state) 
    }
    render() {
        return <div className="inputBox">
                    <p>用户名:<input type='text' data-k="name"  value={this.state.name} onChange={this.change}/></p>
            <p>评论内容:<textarea data-k="cont" ref={e=>this.textarea=e} value={this.state.cont} onChange={this.change} ></textarea></p>
            <input type='button' className='subBtn' value="发布" onClick={this.clickHandle}/>
                </div>
    }
}