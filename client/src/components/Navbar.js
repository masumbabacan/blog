import React from 'react'
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import '../assets/styles/navbar.css';
import '../assets/styles/reset.css';

function Navbar() {
  return (
    <nav className='navbar'>
        <div className='navbar-container'>
            <div className='navbar-logo'>
             <NavLink to="/">LOGO</NavLink>
            </div>
            <div className='navbar-collapse'>
                <ul>
                    <li>
                        link1
                    </li>
                    <li>
                        link2
                    </li>
                    <li>
                        link3
                    </li>
                    <li>
                        link4
                    </li>
                </ul>
            </div>
            <div className='navbar-right'>
                right
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