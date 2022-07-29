import React from 'react'
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import '../assets/styles/blogcard.css';
import '../assets/styles/reset.css';

function BlogCard(props) {
    const image = props.img;
    const blogName = props.name;
    const blogContent = props.content;
    const date = props.date;
    
    const userName = props.userName;

  return (
    <Link to="/blog/:id">
    <div className="card">
        <div className="post-card">
            <div className="post-card-image">
                <img src={'http://localhost:3000'+image}/>
            </div>
            <div className="post-card-content">
                <div className='categories'>
                    <Link to="/blog/:id" className="categorie">Seyahat</Link>
                    <Link to="/blog/:id" className="categorie">Tarih</Link>
                </div>
                <div className='writing'>
                    <h5>
                        <Link to="/blog/:id">{blogName}</Link>
                    </h5>
                    <p className='explanation'>{blogContent}</p>
                </div>
                <div className="post-card-info">
                    <ul className="list-inline">
                        <li className='profile-photo'>
                            <img src={require('../assets/images/27.jpg')}/>
                        </li>
                        <li className="dot"></li>
                        <li>
                            <Link to="/blog/:id">{userName}</Link>
                        </li>
                        {/* <li className="dot"></li>
                        <li>{date.slice(0, 10)}</li> */}
                    </ul>
                    <span className='blogDate'>{date.slice(0, 10)}</span>
                </div>
            </div>
        </div>
    </div>
    </Link>
  )
}

export default BlogCard