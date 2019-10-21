import React, {Component} from 'react'
import jwt_decode from 'jwt-decode'
import {Redirect} from 'react-router-dom'
import Landing from "./Landing";

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            errors: {}
        }
    };

    componentDidMount() {
        const token = localStorage.usertoken;
        console.log(token)
        if(token === undefined){
          return <Redirect to="/" component={Landing}/>;
        }
        const decoded = jwt_decode(token);
        this.setState({
            username: decoded.identity.username,
        })
    };

    render() {
        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">PROFILE</h1>
                    </div>
                    <table className="table col-md-6 mx-auto">
                        <tbody>
                        <tr>
                            <td>Your username is: </td>
                            <td>{this.state.username}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Profile