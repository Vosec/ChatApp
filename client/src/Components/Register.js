import React, {Component} from 'react'
import {register} from './UserFunctions'
import {Button, Form, Input} from "semantic-ui-react";

class Register extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            errors: {},
            regState: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    };

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    };

    onSubmit(e) {
        e.preventDefault();

        const newUser = {
            username: this.state.username,
            password: this.state.password
        };

        register(newUser).then(res => {
            if (res.status === 200) {
                this.setState({errors: {}, regState: true});
                this.props.history.push(`/login`);
            } else {
                this.setState({errors: res.data.error, regState: false});
            }
        })
    }

    render() {
        return (
            <div className="ui center aligned page grid">
                <div className="column twelve wide">
                    {this.state.regState === false &&
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
                                <i aria-hidden="true" className="users blue circular icon"></i>
                                <div className="content">Register</div>
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
                        <Button type="submit" color={"blue"}>
                            Register
                        </Button>
                    </form>
                </div>
            </div>
        )
    };
}

export default Register