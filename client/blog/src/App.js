import { useState, useEffect } from 'react';
import axios from "axios";



export default function App() {
  const fetchUsers = () => {
    return axios.get("http://localhost:3000/users").then((res) => console.log(res.data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
