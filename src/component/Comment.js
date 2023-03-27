import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
/* Importing the Moment component from the react-moment package. */
import Moment from 'react-moment';
/* Importing the useParams hook from the react-router-dom package. */
import { useParams } from 'react-router-dom';
import './button.css';

function Comment() {
/* Setting the initial state of the comments state to an empty array. */
  const [comments, setComments] = useState([]);
/* Setting the initial state of the currentPage state to 1. */
  const [currentPage, setCurrentPage] = useState(1);
/* Setting the initial state of the commentsPerPage state to 3. */
  const [commentsPerPage, setCommentsPerPage] = useState(3);
 /* Getting the postId from the URL. */
  const { postId } = useParams();
/* Setting the initial state of the showAllComments state to false. */
  const [showAllComments, setShowAllComments] = useState(false);

/* Making a request to the WordPress REST API to get the comments for the post with the ID of postId. */
  useEffect(() => {
    const fetchComments = async () => {
      try {
        /* The url of the wordpress site. */
        const wordPressSiteUrl = 'http://colormag.local/';
        /* Making a request to the WordPress REST API to get the comments for the post with the ID of postId. */
        const response = await axios.get(`${wordPressSiteUrl}wp-json/wp/v2/comments?post=${postId}`);
        setComments(response.data);
      } catch (error) {
        /* Checking if the error is an Axios error. If it is, it is logging the error status and data
        to the console. */
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

    /* Making a request to the WordPress REST API to get the comments for the post with the ID of
    postId. */
    fetchComments();
  }, [postId]);

  // Calculate the index of the last comment on the current page
  const indexOfLastComment = currentPage * commentsPerPage;

  // Calculate the index of the first comment on the current page
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;

  // Get the comments to be displayed on the current page
  const currentComments = showAllComments ? comments : comments.slice(indexOfFirstComment, indexOfLastComment);

  // Calculate the number of pages based on the number of comments and the comments per page
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  // Create an array of page numbers to display in the pagination controls
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Event handler for clicking a page number
  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  }

  return (
    <div className='container mt-2'>
   {/* Checking if the comments array has a length. If it does, it is returning a React Fragment with a
   h2 element and a div with a class of row. If it doesn't, it is returning an empty div. */}
      {comments.length > 0 && (
        <React.Fragment>
          <h2>Comments</h2>
          <div className='row'>
            <div className='col-12'>
          {/* Checking if the currentComments array has a length. If it does, it is mapping over the
          currentComments array and returning a div for each comment. If it doesn't, it is returning
          an empty
          div. */}
              {currentComments.length ? (
                currentComments.map(comment => (
                  <div key={comment.id} className="comment">
                    <h3 className="comment-author">{comment.author_name}</h3>
                    <Moment fromNow className="comment-date">{comment.date}</Moment>
                    <div className="comment-content" dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
                  </div>
                ))
              ) : (
                <div></div>
              )}
              {/* Checking if the showAllComments state is false. If it is, it is displaying a button
              that
              when clicked, will set the showAllComments state to true. */ }
              {!showAllComments && (
                <button className='ViewAllBtn' onClick={() => setShowAllComments(true)}>
                  View All Comments...
                </button>
              )}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

/**
 * If the component fails to render, it will return a fallback component
 * @returns A function that returns a div.
 */
function ErrorFallback() {
  return <div>Something went wrong. Please try again later.</div>;
}

/**
 * If an error occurs, log the error and set the state of hasError to true
 * @param props - The props that were passed to the component.
 * @returns A React Fragment with a cloned Comment component.
 */
function ErrorBoundary(props) {
  const [hasError, setHasError] = useState(false);

  const handleCatch = (error, errorInfo) => {
    console.error(error, errorInfo);
    setHasError(true);
  };

 /* Checking if the hasError state is true. If it is, it is returning the ErrorFallback
 component. */
  if (hasError) {
    return <ErrorFallback />;
  }


  /* Cloning the Comment component and passing the handleCatch function as a prop to the
  cloned component. */
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
