// import { useState, useEffect } from "react";
// import axios from "axios";

// function SinglePost({ postId }) {
//   console.log(postId);
//   const [post, setPost] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchPost() {
//       try {
//         const response = await axios.get(`/wp-json/wp/v2/posts/151`);
//         setPost(response.data);
//       } catch (error) {
//         setError(error);
//       }
//     }

//     if (postId) {
//       fetchPost();
//     }
//   }, [postId]);

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   if (!post) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h2>{post.title.rendered}</h2>
//       <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
//     </div>
//   );
// }

// export default SinglePost;

import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import { useParams } from 'react-router-dom';

function SinglePost() {
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  console.log(`Fetching postId ${postId}...`);
  

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log(`Fetching post with postId ${postId}...`);
        const wordPressSiteUrl = 'http://colormag.local/';
        const response = await axios.get(`${wordPressSiteUrl}wp-json/wp/v2/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        if (error.isAxiosError) {
          console.log(error.response.status); // 404
          console.log(error.response.data); // { message: 'Data not found' }
          // Display an error message to the user
        } else {
          console.log(error.message); // Network Error
          // Display a generic error message to the user
        }
      }
    };
    console.log(`postId: ${postId}`);

    fetchPost();
  }, [postId]);

  // if (!post) {
  //   throw new Error("Post not found");
  // }
  
  return (
    <div className='container mt-2'>
      <div className='row'>
        <div className='col-12'>
          {post ? (
            <>
              <h1>{post.title.rendered}</h1>
              <Moment fromNow>{post.date}</Moment>
              <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ErrorFallback() {
  return <div>Something went wrong. Please try again later.</div>;
}

function ErrorBoundary(props) {
  const [hasError, setHasError] = useState(false);

  const handleCatch = (error, errorInfo) => {
    console.error(error, errorInfo);
    setHasError(true);
  };

  if (hasError) {
    return <ErrorFallback />;
  }

  return (
    <React.Fragment>
      {React.cloneElement(props.children, { componentDidCatch: handleCatch })}
    </React.Fragment>
  );
}

/**
 * If the SinglePost component throws an error, the ErrorBoundary component will catch it and display
 * the error message.
 */
function SinglePostWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <SinglePost />
    </ErrorBoundary>
  );
}

export default SinglePostWithErrorBoundary;
