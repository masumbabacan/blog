import React, { useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard'
import axios from 'axios'
import '../assets/styles/home.css';
import '../assets/styles/reset.css';

function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/v1/blogs?page=1')
      .then(response => setBlogs(response.data.data))
      .catch(err => {
        console.log(err.response)
      })
  }, [])


  return (
    <section>
      <div className='leftBar'>
        <div className='left-content'>Masum</div>
      </div>
      <div className='content'>
        {blogs.map((data) => {
          return (
            <BlogCard id={data._id} img={data.image} name={data.name} content={data.content} date={data.updatedAt} userProfileName={data.user.username} userName={data.user.name +' ' +data.user.surname}/>
          )
        })}
      </div>
      <div className='rightBar'>
        <div className='right-content'>Masum</div>
      </div>
    </section>
  )
}
export default Home
/* <BlogCard
              key={data._id}
              img={data.image}
              name={data.name}
              content={data.content}
              date={data.updateAt}
              userName={data.user.name}/>



               <div className="card" >
              <div className="post-card" key={data}>
                <div className="post-card-image">
                  <img src={'http://localhost:3000'+data.image} />
                </div>
                <div className="post-card-content">
                  <a href="#" className="categorie">Travel</a>
                  <h5>
                    <a href="#">{data.name}</a>
                  </h5>
                  <p className='explanation'>{data.content}</p>
                  <div className="post-card-info">
                    <ul className="list-inline">
                      <li className='profile-photo'>
                        <img src={require('../assets/images/27.jpg')} />
                      </li>
                      <li>
                        <a href="#">{data.user.name} {data.user.surname}</a>
                      </li>
                      <li className="dot"></li>
                      <li>{data.updatedAt}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
             */
//<BlogCard img={img} name={blogName} content={content} date={date} userName={userName}/>
