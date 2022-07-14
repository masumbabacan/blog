import React from 'react'
import axios from 'axios'


export default function UsersAll() {
  const [post, setPost] = React.useState(null);
  React.useEffect(() => {
    axios.get('http://localhost:3000/api/v1/users',{ withCredentials: true }).then((response) => {
      setPost(response.data);
      console.log(response.data);
    }).catch((err) => {
      console.log(err.response.data);
    });
  }, []);

  if (!post) return null;

  return (
    <div>
       <h1>{post.name}</h1>
      <p>{post.email}</p>
    </div>
  )
}
