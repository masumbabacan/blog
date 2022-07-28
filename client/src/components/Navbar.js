import React from 'react'
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import '../assets/styles/navbar.css';
import '../assets/styles/reset.css';

function Navbar() {
  return (
    <nav className='navbar'>
        <div className='navbar-container'>
            <div className='navbar-logo'>
             <NavLink to="/">
                <img src={require('../assets/images/logo.png')}/>
             </NavLink>
            </div>
            <div className='navbar-collapse'>
                 <NavLink to="/login"></NavLink>
            </div>
            <div className='navbar-right'>
                <NavLink to="/login">Giriş Yap</NavLink>
            </div>
        </div>

      
    </nav>
  )
}
//<NavLink to="/">Anasayfa</NavLink>
     // <NavLink to="/login">Giriş Yap</NavLink>
      //<NavLink to="/userall">Tüm kullanıcılar</NavLink>

export default Navbar