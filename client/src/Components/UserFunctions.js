import axios from 'axios'

export const register = newUser => {
    return axios
        .post('/register', {
            username: newUser.username,
            password: newUser.password
        })
        .then(response => {
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
            localStorage.setItem('usertoken', response.data.token);
            return response
        })
        .catch(err => {
            return err.response;

        })
};

export const history = room => {
    return axios
        .post('/history', {
        room: room
        })
        .then(response => {
            return response.data
        })
        .catch(err => {
            return err.response;

        })
};

