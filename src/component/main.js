import { useState, useEffect } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

import truncate from "./excerpt";

function BlogPosts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const wordPressSiteUrl = 'http://colormag.local/';
    axios.get(`${wordPressSiteUrl}wp-json/wp/v2/posts?page=${currentPage}&per_page=6`)
      .then(response => {
        setPosts(response.data);
        setTotalPages(parseInt(response.headers['x-wp-totalpages']));
      })
      .catch(error => {
        console.log(error);
      });
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className='container mt-2'>
      <div className='row' >
        <h1>Latest Blog Posts</h1>
        {posts.map(post => (
          <div key={post.id} className='card border-dark mt-3 mb-3 m-3 col-3 '>
            <div className='card-header' >
              <Link to={`/post/${post.id}`}><h4>{post.title.rendered}</h4></Link>
            </div>
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
              <Link to={`/post/${post.id}`} className='btn btn-success float-end'> Read more...
              </Link>
            </div>
          </div>
        ))}
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
  );
}
export default BlogPosts;