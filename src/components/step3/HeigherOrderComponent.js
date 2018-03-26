import React, { Component } from "react";
import InputWithUserName from "./InputWithUserName";
import TextareaWithContent from "./TextareaWithContent";
class HeigherOrderComponent extends Component {
    render() {


        return <div>
            用户名：<InputWithUserName/>
            <br/>
            内容：<TextareaWithContent/>
        </div>
    }
}

export default HeigherOrderComponent