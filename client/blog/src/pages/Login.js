import React from 'react'
import '../styles/login.css'
import '../styles/reset.css'

export default function Login() {
  return (
    <div className='login-container'>
        <div className='login-operations'>
            <h1>Giriş Yap</h1>
            <div className='login'>
                <input 
                    type='text'
                    placeholder='E-Posta'
                />
                <input 
                    type='password'
                    placeholder='Şifre'
                />
                <a href='#'>Şifreni mi unuttun?</a>

                <button type='submit'>Giriş Yap</button>
                
                <label className='login-not-account'>Hesabın yok mu?</label>
                <a href='#'>Kayıt ol</a>
            </div>
        </div>
    </div>
  )
}
