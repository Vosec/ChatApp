import React, {Component} from 'react'
import jwt_decode from 'jwt-decode'
import {Redirect} from 'react-router-dom'
import Landing from "./Landing";
import io from "socket.io-client";
import {Button, Form, Input} from "semantic-ui-react";
const socket = io('http://127.0.0.1:5000');
class Chat extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            errors: {},
            endpoint: "http://127.0.0.1:5000",
            messages: [],
            message: ""
        };
        this.doStuff = this.doStuff.bind(this);
        this.onChange = this.onChange.bind(this);

    };

    doStuff(){
        const socket = io.connect('http://127.0.0.1:5000');
        socket.on('connect', function () {
            socket.send('User has connected!');
        });
        socket.on('message', (data) => {
            this.setState(prevState => ({
                messages: [...prevState.messages, data]
            }));
            console.log(this.state.messages)
            console.log('Received message');
        });


    };
    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }
    onSubmit(e){

        const socket = io.connect('http://127.0.0.1:5000');
        socket.send(this.state.message);


    }

    componentDidMount() {
        const token = localStorage.usertoken;
        console.log(token);
        if (token === undefined) {
            return <Redirect to="/" component={Landing}/>;
        }

        const decoded = jwt_decode(token);
        localStorage.setItem('username', decoded.identity.username)
        this.setState({
            username: decoded.identity.username,
        });

        this.doStuff()
    };



    render() {
        return (
            <div>
            <div>
            <React.Fragment>
        <ul className="list-group">
          {this.state.messages.map(listitem => (
            <li className="list-group-item list-group-item-primary">
              {listitem} {localStorage.username}
            </li>
          ))}
        </ul>
      </React.Fragment>
                </div>
            <div>


                    <Input
                        type="text"
                        name="message"
                        placeholder="Enter message"
                        value={this.state.message}
                        onChange={this.onChange}
                    />

                <Button type="submit" color={"red"} onclick={this.onSubmit}>
                    Send
                </Button>

        </div>
                </div>
        )
    }


}

export default Chat