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
  const [posts, setPosts] = useState([]);
  
  /* A React Hook that is used to fetch data from the WordPress API. */
  useEffect(() => {
    axios.get('http://colormag.local/wp-json/wp/v2/posts?per_page=10')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div className='container mt-2'>
      <h1>Latest Blog Posts</h1>
     {/* A JavaScript function that is used to loop through the posts array and display the data.  */}
      {posts.map(post => (
        <div key={post.id} className='card border-dark mt-3 mb-3'>

        {/* Header or Title */}
        <div className='card-header' >
          <h2>{post.title.rendered}</h2>
          </div>
          {/* Body */}
          <div className='card-body'>
          {/* <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} /> */}
          <p dangerouslySetInnerHTML={{ __html: truncate(post.content.rendered, 100)}} />
          </div>

          {/* Footer */}
          <div className='card-footer'> 
          <Moment fromNow> {post.date} </Moment>
          <div className='btn btn-success float-end'>Read more...</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BlogPosts;
