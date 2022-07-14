import { useState, useEffect } from 'react'

export default function Register() {
  const [user,setUser] = useState();

  useEffect(()=>{
    fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({user}),
        headers: { 'Content-Type': 'application/json' },
    })
     .then( response => {
        if(response.ok && response.status === 200){
           return response.json()
        }
     })
     .then(json => setUser(json.user))
     .catch(err => console.log(err))
            
  },[])

  return (
    <div>
        <h1>Kayıt Ol</h1>
       
        
    </div>
  )
}
