import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import { Link, useParams } from 'react-router-dom';
import Comment from './Comment';
import Navbar from './Navbar';
import CreateComment from './CreateComment';   
import { useNavigate } from "react-router-dom";



function SinglePost() {
  /* Setting the state of the post to null. */
  const [post, setPost] = useState(null);
  /* Setting the state of the posts to an empty array. */
  const [posts, setPosts] = useState([]);
  /* Setting the state of the currentIndex to null. */
  const [currentIndex, setCurrentIndex] = useState(null);
  /* Destructuring the postId from the useParams hook. */
  const { postId } = useParams();
  /* This is a check to see if the user is authenticated. If not, it will redirect them to the login
   page. */
  /* A check to see if the user is authenticated. If not, it will redirect them to the login
  page. */
  const navigate = useNavigate();
  /* This is a check to see if the user is authenticated. If not, it will redirect them to the login
  page. */
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem("authenticated") || false
  );
  /**
   * It deletes the post from the WordPress database
   */
  const handleDelete = async () => {
    try {
      /* Getting the token from the local storage. */
      const authToken = localStorage.getItem('token');
      /* The URL of the WordPress site. */
      const wordPressSiteUrl = 'http://colormag.local/';
      /* It deletes the post from the WordPress database. */
      await axios.delete(`${wordPressSiteUrl}wp-json/wp/v2/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      // Redirect to homepage after successful deletion
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // const fetchPost = async () => {
    //   try {
    //     const wordPressSiteUrl = 'http://colormag.local/';
    //     const response = await axios.get(`${wordPressSiteUrl}wp-json/wp/v2/posts/${postId}`);
    //     setPost(response.data);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

   /**
    * It fetches the post from the WordPress site and sets the post state to the response data.
    */
    const fetchPost = async () => {
      try {
        const wordPressSiteUrl = 'http://colormag.local/';
        const response = await axios.get(`${wordPressSiteUrl}wp-json/wp/v2/posts/${postId}?_embed`);
        setPost(response.data);
      } catch (error) {
        console.error(error);
      }
    };

   /**
    * It fetches multiple  post from the WordPress site and sets the current index to the post that matches
    * the postId.
    */
    const fetchPosts = async () => {
      try {
        const wordPressSiteUrl = 'http://colormag.local/';
        const response = await axios.get(`${wordPressSiteUrl}wp-json/wp/v2/posts`);
        setPosts(response.data);
        setCurrentIndex(response.data.findIndex(p => p.id === parseInt(postId)));
      } catch (error) {
        console.error(error);
      }
    };

    fetchPost();
    fetchPosts();
  }, [postId]);

 /* Checking to see if the currentIndex is greater than 0. If it is, it will set the prevPostIndex to
 the currentIndex minus 1. If it is not, it will set the prevPostIndex to null. It is checking to
 see if the currentIndex is less than the length of the posts array minus 1. If it is, it will set
 the nextPostIndex to the currentIndex plus 1. If it is not, it will set the nextPostIndex to null. */
  const prevPostIndex = currentIndex > 0 ? currentIndex - 1 : null;
  const nextPostIndex = currentIndex < posts.length - 1 ? currentIndex + 1 : null;

  /* This is a check to see if the user is authenticated. If not, it will redirect them to the login
page. */
  if (!authenticated) {
    navigate("/AppLogin");
    return null;
  }


  return (
    <>
      <Navbar />
      <div className="container mt-5 bg-light">
        <div className="row">
          <div className="col-12">
            {post ? (
              <>
                <h1 className="mx-4 mb-4 mt-3 text-center text-dark" style={{ backgroundColor: '#bcc6dd' }}>{post.title.rendered}</h1>
                <p className="mx-4">
                  <small className="text-muted">
                    <Moment fromNow>{post.date}</Moment>
                  </small>
                </p>
                {post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url && (
                  <img src={post._embedded['wp:featuredmedia'][0].source_url} alt={post.title.rendered} style={{ width: '100%' }} />
                )}
                <div className="mx-4" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />

                <Comment />
                {/* Passing the postId to the CreateComment component. */}
                <CreateComment postId={post.id} />
                <div className="mx-4 mt-4">
                  <button onClick={handleDelete} className="btn btn-danger ">
                    Delete This Post
                  </button>
                </div>
                <div className="mx-4 mt-4 ">
                  <div className='float-start'>
                    {prevPostIndex !== null && (
                      <Link to={`/post/${posts[prevPostIndex].id}`} className="btn btn-primary mr-2">
                        &laquo; Previous
                      </Link>

                    )}
                  </div>
                  <div className='float-end'>
                    {nextPostIndex !== null && (
                      <Link to={`/post/${posts[nextPostIndex].id}`} className="btn btn-primary">
                        Next &raquo;
                      </Link>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className='mx-4'>Loading...</div>
            )}
          </div>
        </div>
      </div>
    </>
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
 * If the component has an error, then render the ErrorFallback component. Otherwise, clone the
 * children of the ErrorBoundary component and pass the handleCatch function to the componentDidCatch
 * prop
 * @param props - The props that are passed to the ErrorBoundary component.
 * @returns A React Fragment with a cloned element of the children of the ErrorBoundary component.
 */
function ErrorBoundary(props) {
  const [hasError, setHasError] = useState(false);

  const handleCatch = (error, errorInfo) => {
    console.error(error, errorInfo);
    setHasError(true);
  };

  if (hasError) {
    return <ErrorFallback />;
  }

  /* Cloning the children of the ErrorBoundary component and passing the handleCatch function to the
  componentDidCatch prop. */
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
