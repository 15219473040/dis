

import React, { Component } from "react";
import wrapWithLoadData from "./wrapWithLoadData";
class InputWithUserName extends Component {
  
    render() {
        return <input value={this.props.data[0].name} />
    }
}

InputWithUserName = wrapWithLoadData(InputWithUserName,"comments")

export default InputWithUserName











