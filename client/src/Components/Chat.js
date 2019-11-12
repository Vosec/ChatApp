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
            error: "",
            messages: [],
            message: "",
            users: [],
            room: "",
            rooms: [],
            newRoom: ""
        };
        this.receiveMessage = this.receiveMessage.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getMessages = this.getMessages.bind(this);
        //this.saveUser = this.saveUser.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.changeRoom = this.changeRoom.bind(this);
        this.receiveRooms = this.receiveRooms.bind(this);
        this.receiveNewestRoom = this.receiveNewestRoom.bind(this);

        console.log("construktor");
        //get history
        const decoded = jwt_decode(localStorage.usertoken);
        //FIXME: not working
        this.state.username = decoded.identity.username;
        if (this.state.room === "" || this.state.room === undefined) {
            this.state.room = "default";
            let data = {
                "username": this.state.username,
                "room": this.state.room
            };
            socket.emit("join", data);
        }
        this.state.messages = [];
        history(this.state.room).then(res => {
            if(res.history !== undefined){
            res.history.map(item => (
                this.setState(prevState => ({
                    messages: [...prevState.messages, item]
                }))
            ))}
        });
    };

    receiveMessage() {
        socket.on('message', (data) => {
            this.setState(prevState => ({
                messages: [...prevState.messages, data]
            }));
            console.log(this.state.messages);
            console.log('Received message');
            console.log(this.state.room)
        });
    };

    /*
    //FIXME: not working
    saveUser(us) {
        this.setState({
            username: us,
        });
        this.setState(prevState => ({
            users: [...prevState.users, this.state.username]
        }));

        console.log(this.state.user);
        console.log(this.state.users);
    }
    */
    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit(e) {
        e.preventDefault();
        socket.send({username: this.state.username, message: this.state.message, room: this.state.room});
        this.setState({message: ""});
    }

    componentDidMount() {
        //TODO: save new logged user?
        console.log("componentDidMount");
        const token = localStorage.usertoken;
        console.log(token);
        // or get token from server for this user and compare it with token saved in local storage
        if (token === undefined) {
            return <Redirect to="/" component={Landing}/>;
        }

        const decoded = jwt_decode(token);
        //FIXME: not working
        //this.saveUser(decoded.identity.username);
        this.receiveMessage();
        this.receiveRooms();
    };

    receiveRooms() {
        socket.emit("getRooms");
        socket.on('getRooms', (data) => {
            data.map(item => (
                this.setState(prevState => ({
                    rooms: [...prevState.rooms, item]
                }))));
        })
    }

    receiveNewestRoom() {
        //FIXME: not working socket.emit
        socket.emit("getNewestRoom");
        socket.on('getNewestRoom', (data) => {
            if (!(this.state.rooms.includes(data))) {
                this.setState(prevState => ({
                    rooms: [...prevState.rooms, data]
                }))
            }
        })
    }

    createRoom(e) {
        e.preventDefault();
        socket.emit('createRoom', {"room": this.state.newRoom});
        this.setState({newRoom: ""});
        this.receiveNewestRoom();

    }

    changeRoom(e) {
        socket.emit('leave', {"username": this.state.username, "room": this.state.room});
        let data = {
            "username": this.state.username,
            "room": e.target.value
        };
        this.state.messages = [];
        this.state.room = e.target.value;

        history(this.state.room).then(res => {
            if(res.history !== undefined){
            res.history.map(item => (
                this.setState(prevState => ({
                    messages: [...prevState.messages, item]
                }))
            ))}
        });
        socket.emit("join", data);
    }

    createRoomHtml() {
        return (
            <form className="roomForm" onSubmit={this.createRoom}>
                <Input id="inputRoom"
                       type="text"
                       name="newRoom"
                       placeholder="Enter room name"
                       value={this.state.newRoom}
                       onChange={this.onChange}
                />
                <Button type="submit" color={"orange"}>
                    Create
                </Button>
            </form>
        )
    }

    getMessages() {
        return (
            this.state.messages.map(item => (
                <div className="ui left aligned page grid">
                    <div className="column twenty">
                        <div className="ui small message color grey">
                            <div className="header">
                                <p class="textFont"> {item.split(":")[0] + ": "} </p>
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
                <div className="ui horizontal divider">Chat rooms</div>
                <div>
                    {this.state.rooms.map(item => (
                        <button class="mini circular orange ui button" value={item} id="roomName"
                                onClick={this.changeRoom}> {item} </button>
                    ))}
                </div>
                <div className="ui hidden divider"></div>
                <div className={"column one"}>
                    {this.createRoomHtml()}
                </div>
                <div className="ui horizontal divider"> Chat</div>
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
                            <Button type="submit" color={"blue"}>
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