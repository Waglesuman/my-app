import { useState, useEffect } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import { useNavigate } from "react-router-dom";

import { Link } from 'react-router-dom';

import truncate from "./excerpt";
import Navbar from './Navbar';

function BlogPosts() {
/* Setting the state of the component. */
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [posts, setPosts] = useState([]);
  /* Checking if the user is logged in. If not, it redirects to the login page. */
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem("authenticated") || false
  );

  /* A hook that is called when the component is mounted and when the currentPage is changed. */
  useEffect(() => {
    const wordPressSiteUrl = 'http://colormag.local/';
/* Making a request to the WordPress REST API to get the posts. */
    axios.get(`${wordPressSiteUrl}wp-json/wp/v2/posts?page=${currentPage}&per_page=6`)
      .then(response => {
        setPosts(response.data);
        setTotalPages(parseInt(response.headers['x-wp-totalpages']));
      })
     /* Catching any errors that may occur. */
      .catch(error => {
        console.log(error);
      });
  }, [currentPage]);

  /**
   * If the current page is greater than 1, then set the current page to the current page minus 1.
   */
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  /**
   * If the current page is less than the total number of pages, then increment the current page by
   * one.
   */
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

 /* Checking if the user is logged in. If not, it redirects to the login page. */
  if (!authenticated) {
    navigate("/AppLogin");
    return null;
  }
/* Returning the HTML code for the component. */
  return (
    <>
    <Navbar />
    <div className='container mt-5'>
      <div className='row' >
        <h1>Latest Blog Posts</h1>
        {/*  Mapping through the posts array and returning the HTML code for each post.  */}
        {posts.map(post => (
          <div key={post.id} className='card border-dark mt-3 mb-3 m-3 col-3 '>
            <div className='card-header' >
              {/*  Creating a link to the post. */}
              <Link to={`/post/${post.id}`}><h4>{post.title.rendered}</h4></Link>
            </div>
            {/* Body */}
            <div className='card-body'>
              {post.featured_src ? (
                <img
                  src={post.featured_src}
                  alt={post.title.rendered}
                />
              ) : (
                ""
              )}
              <div className='card-text'>
                {/* {post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0] && (
            <img alt="example" src={post?._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.thumbnail?.source_url}/>
            )} */}
                {/* <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} /> */}
                {/* <p dangerouslySetInnerHTML={{ __html: truncate(post.content.rendered, 100)}} /> */}
                <p dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
              </div>
            </div>
            <div className='card-footer'>
              <Moment fromNow>{post.date}</Moment>
              {/* <a href={`localhost:3000/post/${post.id}`} className='btn btn-success float-right'>Read more...</a> */}
              <Link to={`/post/${post.id}`} className='btn btn-success float-end' >Read more...</Link>
            </div>
          </div>
        ))}
        { /* The pagination. */ }
        <nav>
          <ul className='pagination'>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className='page-link' onClick={handlePrevPage}>&laquo; Previous</button>
            </li>
            <li className='page-item disabled'>
              <span className='page-link'>{currentPage} of {totalPages}</span>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className='page-link' onClick={handleNextPage}>Next &raquo;</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    </>
  );
}
export default BlogPosts;