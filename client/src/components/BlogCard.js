import React from 'react'
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import '../assets/styles/blogcard.css';
import '../assets/styles/reset.css';

function BlogCard(props) {
    const image = props.img;
  return (
    <Link to="/blog/:id">
    <div className="card">
        <div className="post-card">
            <div className="post-card-image">
                <img src={require(`../assets/images/${image}`)}/>
            </div>
            <div className="post-card-content">
                <a href="blog-grid.html" className="categorie">Travel</a>
                <h5>
                    <a href="post-default.html">The Best Cities to Travel Alone in the USA</a>
                </h5>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit quam atque ipsa laborum sunt distinctio...
                </p>
                <div className="post-card-info">
                    <ul className="list-inline">
                        <li>
                            
                        </li>
                        <li>
                            <a href="author.html">David Smith</a>
                        </li>
                        <li className="dot"></li>
                        <li>January 15, 2021</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    </Link>
  )
}

export default BlogCard