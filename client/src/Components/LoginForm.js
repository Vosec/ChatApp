import React, { useState } from "react";
import { Form, Input, Button } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';


export const LoginForm = ({ onNewUser }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Form>
      <Form.Field>
        <Input
          placeholder="username"
          value={username}
          onChange={e => setUserName(e.target.value)}
        />
      </Form.Field>
        <Form.Field>
        <Input
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <Button
          onClick={async () => {
            const user = { username, password };
            const response = await fetch("/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(user)
            });

            if (response.ok) {
              console.log("response worked!");
              onNewUser(user);
              setUserName("");
              setPassword("");
            }
          }}
        >
          submit
        </Button>
      </Form.Field>
    </Form>
  );
};