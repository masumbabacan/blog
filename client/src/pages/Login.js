import React, { useState } from 'react'
import axios from 'axios'
import '../assets/styles/login.css'
import '../assets/styles/reset.css'
import { Link } from 'react-router-dom'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleUserName = (e) => {
        console.log(e.target.value);
        setUsername(e.target.value);
    }
    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleaSubmit= (e) => {
        e.preventDefault();
        console.log(password);
        axios.post('http://localhost:3000/api/v1/auth/login', {
            username: username,
            password: password
        },{ withCredentials: true })
        .then((response) =>{
            alert(response.data.msg);
            console.log(response.data);
        })
        .catch((err)=>{
            console.log(err.response)
            alert(err.response.data.msg)
        })
    }

  return (
    <div className='login-container'>
        <div className='login-operations'>
            <h1>Giriş Yap</h1>
            <div className='login'>
               <form onSubmit={handleaSubmit}>
                <input 
                        type='text'
                        placeholder='E-Posta'
                        value={username}
                        name='email'
                        onChange={handleUserName}
                    />
                    <input 
                        type='password'
                        placeholder='Şifre'
                        value={password}
                        name='password'
                        onChange={handlePassword}
                    />
                    <Link to='#'>Şifreni mi unuttun?</Link>

                    <button type='submit'>Giriş Yap</button>
                    
                    <label className='login-not-account'>Hesabın yok mu?</label>
                    <Link to='#'>Kayıt ol</Link>
               </form>
            </div>
        </div>
    </div>
  )
}

export default Login