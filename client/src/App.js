import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Navbar from './Components/Navbar'
import Landing from './Components/Landing'
import Login from './Components/Login'
import Register from './Components/Register'
import Profile from './Components/Profile'
import Chat from './Components/Chat'

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Navbar/>
                    <Redirect from="*" to="/"/>
                    <Route exact path="/" component={Landing}/>
                    <div className="container">
                        <Route exact path="/register" component={Register}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/profile" component={Profile}/>
                        <Route exact path="/chat" component={Chat}/>

                    </div>

                </div>
            </Router>
        )
    };
}

export default App