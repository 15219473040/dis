import React ,{Component} from "react";
import PropTypes from "prop-types"
export default class Context extends Component {
    static childContextTypes ={
        themeColor: PropTypes.string
    }
    constructor(props){
        super(props);
        this.state={
            themeColor:"red"
        }
    }
    getChildContext(){
        return {themeColor:this.state.themeColor}
    }

    render() {
        return (
            <div>
                 
                <Main />
            </div>
        )
    }
}


class Main extends Component {
    render() {
        return (
            <div>
                <h2>This is main</h2>
                <Content />
            </div>
        )
    }
}

class Content extends Component {
    static contextTypes={
        themeColor: PropTypes.string
    }
    render() {
        return (
            <div>
                <h2 style={{color:this.context.themeColor}}>React.js 小书内容</h2>
                <Details/>
            </div>
        )
    }
}
class Details extends Component {
    static contextTypes = {
        themeColor: PropTypes.string
    }
    render() {
        return (
            <div style={{color:this.context.themeColor}}>
                details
            </div>
        )
    }
}