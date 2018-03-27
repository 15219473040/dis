import React, { Component } from 'react';


import CommentApp from "./components/common/CommentApp"
import HeigherOrderComponent from "./components/step3/HeigherOrderComponent"
import Context from "./components/step3/context/Context"


import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

export default class App extends Component {
    render(){
        
        return <Router>
            <div>
                <Link to='/Comment' className="nav_item">CommentApp</Link>
                <Link to='/HeigherOrderComponents' className="nav_item">HeigherOrderComponents</Link>
                <Link to='/Context' className="nav_item">Context</Link>


                <Route path='/' exact component={CommentApp} />
                <Route path='/Comment'  component={CommentApp} />
                <Route path='/HeigherOrderComponents' component={HeigherOrderComponent} />
                <Route path='/Context' component={Context} />

            </div>
        </Router>
    }
}