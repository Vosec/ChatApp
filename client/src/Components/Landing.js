import React, {Component} from 'react'
import 'semantic-ui-css/semantic.min.css';

class Landing extends Component {
    render() {
        return (
            <div className="ui center aligned page grid">
                <div className="column twelve wide">
                    <h1>Welcome to chat app! </h1>
                    <i className="rocketchat red big circular icon"></i>
                </div>
            </div>

        )
    };
}

export default Landing