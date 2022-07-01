import { useState, useEffect } from 'react';
import axios from "axios";



export default function App() {
  const [users,setUsers] = useState();

  const fetchUsers = () => {
    return fetch('http://localhost:3000/api/v1/users')
        .then(response => response.json()).then(response => {
          console.log(response)
          setUsers(response.users);
        }).catch(err => console.log(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      {users && users.map((user) => (
        <h1 key={user._id}>{user.name}</h1>
      ))}
    </div>
  );
}
