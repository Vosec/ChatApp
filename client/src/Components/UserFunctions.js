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
            console.log(response);
            localStorage.setItem('usertoken', response.data);
            return response
        })
        .catch(err => {
            console.log(err.response);
            return err.response;

        })
};
