import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import { useParams } from 'react-router-dom';

function SinglePost() {
  const [post, setPost] = useState(null);
  const { Id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log(`Fetching post with postId ${Id}...`);
        const wordPressSiteUrl = 'http://colormag.local/';
        const response = await axios.get(`${wordPressSiteUrl}wp-json/wp/v2/posts/${Id}`);
        setPost(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, [Id]);

  if (!post) {
    throw new Error("Post not found");
  }

  return (
    <div className='container mt-2'>
      <div className='row'>
        <div className='col-12'>
          <h1>{post.title.rendered}</h1>
          <Moment fromNow>{post.date}</Moment>
          <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </div>
      </div>
    </div>
  );
}

function ErrorFallback() {
  return <div>Something went wrong. Please try again later.</div>;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

function SinglePostWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <SinglePost />
    </ErrorBoundary>
  );
}

export default SinglePostWithErrorBoundary;
