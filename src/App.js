import React, { Component } from 'react';


import CommentApp from "./components/common/CommentApp"
import HeigherOrderComponent from "./components/step3/HeigherOrderComponent"



import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

export default class App extends Component {
    render(){
        
        return <Router>
            <div>
                <Link to='/Comment'>CommentApp</Link>
                <Link to='/HeigherOrderComponents'>HeigherOrderComponents</Link>


                <Route path='/' exact component={CommentApp} />
                <Route path='/Comment'  component={CommentApp} />
                <Route path='/HeigherOrderComponents' component={HeigherOrderComponent} />

            </div>
        </Router>
    }
}