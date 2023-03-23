import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import { Link, useParams } from 'react-router-dom';
import Comment from './Comment';
import Navbar from './Navbar';

function SinglePost() {
  const [post, setPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  const { postId } = useParams();

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

    const fetchPost = async () => {
      try {
        const wordPressSiteUrl = 'http://colormag.local/';
        const response = await axios.get(`${wordPressSiteUrl}wp-json/wp/v2/posts/${postId}?_embed`);
        setPost(response.data);
      } catch (error) {
        console.error(error);
      }
    };

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

  const prevPostIndex = currentIndex > 0 ? currentIndex - 1 : null;
  const nextPostIndex = currentIndex < posts.length - 1 ? currentIndex + 1 : null;

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
