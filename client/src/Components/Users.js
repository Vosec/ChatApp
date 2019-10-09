import React from "react";
import { List, Header } from "semantic-ui-react";

export const Users = ({ users }) => {
  return (
    <List>
      {users.map(user => {
        return (
          <List.Item key={user.name}>
            <Header>{user.email}</Header>
          </List.Item>
        );
      })}
    </List>
  );
};