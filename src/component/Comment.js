import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import { useParams } from 'react-router-dom';

function Comment() {
  const [comments, setComments] = useState([]);
  const { postId } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const wordPressSiteUrl = 'http://colormag.local/';
        const response = await axios.get(`${wordPressSiteUrl}wp-json/wp/v2/comments?post=${postId}`);
        setComments(response.data);
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

    fetchComments();
  }, [postId]);

  return (
    <div className='container mt-2'>
      <div className='row'>
        <div className='col-12'>
          {comments.length ? (
            comments.map(comment => (
              <div key={comment.id}>
                <h3>{comment.author_name}</h3>
                <Moment fromNow>{comment.date}</Moment>
                <div dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
              </div>
            ))
          ) : (
            <div>Comments not found.....</div>
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
function CommentWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <Comment />
    </ErrorBoundary>
  );
}

export default CommentWithErrorBoundary;
