import React from 'react'
import BlogCard from '../components/BlogCard'
import '../assets/styles/home.css';
import '../assets/styles/reset.css';

function Home() {
  return (
  <section>
    <BlogCard img='2.jpg'/>
    <BlogCard img='7.jpg'/>
    <BlogCard img='20.jpg'/>
    <BlogCard img='21.jpg'/>
    <BlogCard img='23.jpg'/>
    <BlogCard img='24.jpg'/>
    <BlogCard img='26.jpg'/>
    <BlogCard img='27.jpg'/>
  </section>
  )
}

export default Home