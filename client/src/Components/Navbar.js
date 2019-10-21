import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'

class Navbar extends Component {
    logOut(e) {
        e.preventDefault();
        localStorage.removeItem('usertoken');
        localStorage.clear();
        this.props.history.push(`/`)
    }

    render() {
        const loginRegLink = (
            <table className="ui celled table">
                <tr>
                    <td>
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                    </td>
                    <td>
                        <Link to="/login" className="nav-link">
                            Login
                        </Link>
                    </td>
                    <td>
                        <Link to="/register" className="nav-link">
                            Register
                        </Link>
                    </td>
                </tr>
            </table>
        );

        const userLink = (
            <table className="ui celled table">
                <tr>
                    <td>
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                    </td>
                    <td>
                        <Link to="/profile" className="nav-link">
                            User
                        </Link>
                    </td>
                    <td>
                        <a href="" onClick={this.logOut.bind(this)} className="nav-link">
                            Logout
                        </a>
                    </td>
                </tr>
            </table>
        );

        return (
            <nav>
                {localStorage.usertoken ? userLink : loginRegLink}
            </nav>
        )
    }
}

export default withRouter(Navbar)