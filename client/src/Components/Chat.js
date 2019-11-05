import React, {Component} from 'react'
import jwt_decode from 'jwt-decode'
import {Redirect} from 'react-router-dom'
import Landing from "./Landing";
import io from "socket.io-client";
import {Button, Input} from "semantic-ui-react";
import {history} from "./UserFunctions";

const socket = io('http://127.0.0.1:5000');

class Chat extends Component {
    //TODO: Make message Component - it may solve bubble color problem - sending it through props
    constructor() {
        super();
        this.state = {
            username: '',
            errors: {},
            endpoint: "http://127.0.0.1:5000",
            messages: [],
            message: ""
        };
        this.receiveMessage = this.receiveMessage.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getMessages = this.getMessages.bind(this);
        this.getHistory = this.getHistory.bind(this);
        console.log("construktor");

        //get history
        history().then(res => {
                res.history.map(item => (
                    this.setState(prevState => ({
                        messages: [...prevState.messages, item]
                    }))
                ))
        })
    };

    //idk
    getHistory() {
        socket.on('start', (data) => {
            console.log("inside");
            this.setState(prevState => ({
                messages: [...prevState.messages, data]
            }));
        });
        console.log("getting history")
    }

    receiveMessage() {
        //socket.on('connect', function () {
        //    socket.send('User has connected!');
        //});
        socket.on('message', (data) => {
            this.setState(prevState => ({
                messages: [...prevState.messages, data]
            }));
            console.log(this.state.messages);
            console.log('Received message');
        });

    };

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit(e) {
        e.preventDefault();
        socket.send(this.state.username + ": " + this.state.message);
        this.setState({message: ""});

        //random color gen.
        /*
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        if (document.getElementById('x') != undefined) {
            document.getElementById('x').style.color = color;
        }
        */
    }

    componentDidMount() {
        //TODO: save new logged user?
        console.log("componentDidMount");
        const token = localStorage.usertoken;
        this.state.username = localStorage.username;
        console.log(token);
        if (token === undefined) {
            return <Redirect to="/" component={Landing}/>;
        }

        const decoded = jwt_decode(token);
        //localStorage.setItem('username', decoded.identity.username);
        this.setState({
            username: decoded.identity.username,
        });
        this.receiveMessage();
    };

    getMessages() {
        return (
            this.state.messages.map(item => (
                <div className="ui center aligned page grid">
                    <div className="column twelve wide">
                        <div className="ui small compact message color blue">
                            {item}
                        </div>
                    </div>
                </div>
            ))
        )
    }

    render() {
        return (
            <div>
                {this.getMessages()}
                <div className="ui center aligned page grid">
                    <div className="column twelve wide">
                        <form className="msgForm" onSubmit={this.onSubmit}>
                            <Input id="inputMessage"
                                   type="text"
                                   name="message"
                                   placeholder="Enter message"
                                   value={this.state.message}
                                   onChange={this.onChange}
                            />
                            <Button type="submit" color={"red"}>
                                Send
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Chat