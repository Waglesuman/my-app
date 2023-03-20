import { useState, useEffect } from 'react';
import axios from 'axios';
import Moment from 'react-moment';

function truncate(text, maxLength) {
  const words = text.split(' ');
  if (words.length > maxLength) {
    return words.slice(0, maxLength).join(' ') + '...';
  } else {
    return text;
  }
}

function BlogPosts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get(`http://colormag.local/wp-json/wp/v2/posts?page=${currentPage}&per_page=5`)
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
      <h1>Latest Blog Posts</h1>
      {posts.map(post => (
        <div key={post.id} className='card border-dark mt-3 mb-3'>
          <div className='card-header' >
            <h2>{post.title.rendered}</h2>
          </div>
          <div className='card-body'>
          {/* <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} /> */}
          <p dangerouslySetInnerHTML={{ __html: truncate(post.content.rendered, 100)}} />
            {/* <p dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} /> */}
          </div>
          <div className='card-footer'> 
            <Moment fromNow>{post.date}</Moment>
            {/* <a href={post.link} className='btn btn-success float-right'>Read more...</a> */}
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
  );
}

export default BlogPosts;
