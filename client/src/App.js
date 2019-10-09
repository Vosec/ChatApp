import React, {useEffect, useState} from 'react';
import './App.css';
import {Users} from "./Components/Users";

function App() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetch('/test').then(response =>
            response.json().then(data => {
            console.log(data);
            setUsers(data.users);
            })
        );
    },[]);
  return (
    <div className="App">
         <Users users={users} />
    </div>
  );
}

export default App;
