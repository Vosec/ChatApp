import axios from 'axios'
import jwt_decode from 'jwt-decode'

export const register = newUser => {
    return axios
        .post('/register', {
            username: newUser.username,
            password: newUser.password
        })
        .then(response => {
            console.log(response);
            return response
        })
        .catch(err => {
            console.log(err);
            return err.response
        })
};

export const login = user => {
    return axios
        .post('/login', {
            username: user.username,
            password: user.password
        })
        .then(response => {
            console.log(response.data);
            localStorage.setItem('usertoken', response.data.token);
            const decoded = jwt_decode(response.data.token);
            localStorage.setItem('username', decoded.identity.username);
            return response
        })
        .catch(err => {
            console.log(err.response);
            return err.response;

        })
};
