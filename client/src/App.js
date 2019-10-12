import React, {useEffect, useState} from 'react';
import './App.css';
import {Users} from "./Components/Users";
import {LoginForm} from "./Components/LoginForm";
import { Container } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';



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
      <Container style={{ marginTop: 40 }}>
      <LoginForm
        onNewUser={user =>
          setUsers(currentUsers => [user, ...currentUsers])
        }
      />
    <div className="App">
         <Users users={users} />
    </div>
    </Container>
  );
}

export default App;
