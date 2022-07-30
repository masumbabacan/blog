import React from 'react'
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import '../assets/styles/blogcard.css';
import '../assets/styles/reset.css';

function BlogCard(props) {
    const id = props.id
    const image = props.img;
    const blogName = props.name;
    const blogContent = props.content;
    const date = props.date;
    
    const userProfileName = props.userProfileName;
    const userName = props.userName;

  return (
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
                        <Link to={"/blog/"+id}>{blogName}</Link>
                    </h5>
                    <Link to={"/blog/"+id}>
                        <p className='explanation'>{blogContent}</p>
                    </Link>
                </div>
                <div className="post-card-info">
                    <ul className="list-inline">
                        <li className='profile-photo'>
                            <Link to={"/"+userProfileName}><img src={require('../assets/images/27.jpg')}/></Link>
                        </li>
                        <li className="dot"></li>
                        <li>
                            <Link to={"/"+userProfileName}>{userName}</Link>
                        </li>
                    </ul>
                    <span className='blogDate'>{date.slice(0, 10)}</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BlogCard