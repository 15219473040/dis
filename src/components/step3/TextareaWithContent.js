import React, { Component } from "react";
import wrapWithLoadData from "./wrapWithLoadData";
class TextareaWithContent extends Component {

    render() {
        return <textarea value={this.props.data[0].cont}></textarea>
    }
}

TextareaWithContent = wrapWithLoadData(TextareaWithContent, "comments")

export default TextareaWithContent;











 