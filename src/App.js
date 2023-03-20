import { useState, useEffect } from 'react';
import axios from 'axios';

function BlogPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://colormag.local/wp-json/wp/v2/posts?per_page=5')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>Latest Blog Posts</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title.rendered}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
          <p dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
        </div>
      ))}
    </div>
  );
}

export default BlogPosts;
