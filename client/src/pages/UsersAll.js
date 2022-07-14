import React from 'react'
import { useState, useEffect } from 'react'



export default function UsersAll() {
    const [users,setUsers] = useState();
    const [errors,setErrors] = useState();

    const fetchUsers = () => {
        return fetch('http://localhost:3000/api/v1/users')
            .then(response => response.json())
            .then(response => {
              setErrors(response.msg);
            })
            .then(response => {
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

    {errors}
    </div>
  )
}
