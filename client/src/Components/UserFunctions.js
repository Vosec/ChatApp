import axios from 'axios'

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
            return response
        })
        .catch(err => {
            console.log("error" + err.response);
            return err.response;

        })
};

export const history = room => {
    return axios
        .post('/history', {
        room: room
        })
        .then(response => {
            console.log(response.data);
            return response.data
        })
        .catch(err => {
            console.log(err.response);
            return err.response;

        })
};

export const rooms = room => {
    return axios
        .get('/rooms', {

        })
        .then(response => {
            console.log(response.data);
            return response.data
        })
        .catch(err => {
            console.log(err.response);
            return err.response;

        })
};
