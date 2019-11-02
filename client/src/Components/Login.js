import React, {Component} from 'react'
import {login} from './UserFunctions'
import {Form, Input, Button} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            errors: {},
            loginState: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit(e) {
        e.preventDefault();

        const user = {
            username: this.state.username,
            password: this.state.password
        };

        login(user).then(res => {
            if (res.status === 200) {
                this.setState({errors: {}, loginState: true});
                this.props.history.push(`/chat`);
            } else {
                console.log("nastal error")
                this.setState({errors: res.data.error, loginState: false});
            }
        })
    };

    render() {
        return (
            <div class="ui center aligned page grid">
                <div className="column twelve wide">
                    {this.state.loginState === false &&
                    <div className="ui negative message">
                        <i className="close icon"></i>
                        <div className="header">
                            {this.state.errors}
                        </div>
                    </div>
                    }
                    <form noValidate onSubmit={this.onSubmit}>
                        <div>
                            <h2 className="ui icon center aligned header">
                                <i aria-hidden="true" className="users green circular icon"></i>
                                <div className="content">Login</div>
                            </h2>
                        </div>
                        <Form.Field>
                            <Input
                                type="username"
                                name="username"
                                placeholder="Enter username"
                                value={this.state.username}
                                onChange={this.onChange}
                            />
                        </Form.Field>
                        <Form.Field>

                            <Input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.onChange}
                            />
                        </Form.Field>
                        <Button type="submit" color={"green"}>
                            Sign in
                        </Button>
                    </form>
                </div>
            </div>
        )
    };
}

export default Login