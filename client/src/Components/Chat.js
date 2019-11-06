import React, {Component} from 'react'
import jwt_decode from 'jwt-decode'
import {Redirect} from 'react-router-dom'
import Landing from "./Landing";
import io from "socket.io-client";
import {Button, Input} from "semantic-ui-react";
import {history} from "./UserFunctions";
import '../App.css'

const socket = io('http://127.0.0.1:5000');

class Chat extends Component {
    //TODO: Make message Component - it may solve bubble color problem - sending it through props
    constructor() {
        super();
        this.state = {
            username: "",
            errors: {},
            endpoint: "http://127.0.0.1:5000",
            messages: [],
            message: "",
            users: []
        };
        this.receiveMessage = this.receiveMessage.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getMessages = this.getMessages.bind(this);
        this.saveUser = this.saveUser.bind(this);

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

    receiveMessage() {
        socket.on('message', (data) => {
            this.setState(prevState => ({
                messages: [...prevState.messages, data]
            }));
            console.log(this.state.messages);
            console.log('Received message');
        });
    };

    //FIXME: not working
    saveUser(us){
        this.setState({
            username: us,
        });
        this.setState(prevState => ({
                users: [...prevState.users, this.state.username]
            }));

        console.log(this.state.user);
        console.log(this.state.users);
    }
    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit(e) {
        e.preventDefault();
        //socket.send({username: this.state.username, message: this.state.message});
        socket.send(this.state.username + ": " + this.state.message);
        this.setState({message: ""});
    }

    componentDidMount() {
        //TODO: save new logged user?
        console.log("componentDidMount");
        const token = localStorage.usertoken;
        console.log(token);
        if (token === undefined) {
            return <Redirect to="/" component={Landing}/>;
        }

        const decoded = jwt_decode(token);
        //FIXME: not working
        this.saveUser(decoded.identity.username);
        this.receiveMessage();
    };

    getMessages() {
        return (
            this.state.messages.map(item => (
                <div className="ui left aligned page grid">
                    <div className="column twelve">
                        <div className="ui small message color grey">
                            <div className="header">
                                {item.split(":")[0] + ": "}
                            </div>
                            <div className="ui wide divider"></div>
                            {item.split(":")[1]}
                        </div>
                        <div className="ui hidden fitted divider">
                            </div>
                    </div>
                </div>
            ))
        )
    }

    render() {
        return (
            <div>
            <div>

                {this.getMessages()}
            </div>
            <div>
                    <footer>
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
                        </footer>
            </div>
            </div>
        )
    }
}

export default Chat