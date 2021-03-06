import React, { Component } from 'react';
import CommenInput from "./CommenInput";
import CommenList from "./CommenList";
export default class CommentApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: []
        }

    }
    componentWillMount(){
        this._loadComments()
    }
    _loadComments() {
        let comments = localStorage.getItem("comments");
        if (comments) {
            comments = JSON.parse(comments);
            this.setState({ comments })
        }
    }
    _saveComments(comments) {
        localStorage.setItem("comments", JSON.stringify(comments))
    }
    handleSubmitComment = (comment) => {
        if(!comment) return ;
        if(!comment.name) alert("请输入用户名");
        if(!comment.cont) alert("请输入内容");
        const comments = this.state.comments;
        comments.push(comment);
        this.setState({comments });
        this._saveComments(comments);
    }
    handleDel(ind){
        const arr = this.state.comments;
        arr.splice(ind,1);
        this.setState({ arr });
        this._saveComments(arr);
        
    }
    render() {
        return <div className="commenBox">
            <CommenInput onSubmit={this.handleSubmitComment} />
            <CommenList list={this.state.comments} onDel={this.handleDel.bind(this)}/>
        </div>
    }
}
