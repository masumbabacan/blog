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
                <Link to="/blog/:id" className="categorie">Travel</Link>
                <h5>
                    <Link to="/blog/:id">{blogName}</Link>
                </h5>
                <p className='explanation'>{blogContent}</p>
                <div className="post-card-info">
                    <ul className="list-inline">
                        <li className='profile-photo'>
                            <img src={require('../assets/images/27.jpg')}/>
                        </li>
                        <li>
                            <Link to="/blog/:id">{userName}</Link>
                        </li>
                        <li className="dot"></li>
                        <li>{date}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    </Link>
  )
}

export default BlogCard