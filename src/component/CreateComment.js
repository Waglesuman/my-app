import React, { useState, useEffect } from 'react';
import axios from 'axios';


const CreateComment = ({ postId }) => {

/* A state variable that is used to store the comment. */
  const [comment, setComment] = useState('');
/* A state variable that is used to store the user ID. */
  const [userId, setUserId] = useState('');
/* A state variable that is used to store the token. */
  const [token, setToken] = useState('');
/* A state variable that is used to show a message to the user when the comment is created. */
  const [commentCreated, setCommentCreated] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

/**
 * Const createMarkup = ( data ) => ({ __html: data });
 * @param data - The data that you want to render.
 */
  const createMarkup = ( data ) => ({ __html: data });

  /**
   * The function takes an event as an argument, and then sets the state of the comment to the value of
   * the event.
   * @param event - The event object is a JavaScript event that is sent to an element when an event
   * occurs on it.
   */
  const handleInputChange = ( event ) => {
    const { value } = event.target;
    setComment(value);
  };

 /**
  * It takes the user's email, comment, and post ID and sends it to the WordPress site. 
  * 
  * The WordPress site then creates a new comment with the user's email, comment, and post ID. 
  * 
  * The WordPress site then returns a response to the React app. 
  * 
  * The React app then sets the loading state to false, sets the commentCreated state to true, and sets
  * the message state to "New comment created". 
  * 
  * The React app then sets the comment state to an empty string.
  * @param e - event
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
/* The URL of the WordPress site. */
      const wordPressSiteUrl = 'http://colormag.local/';
/* Getting the token from the local storage. */
      const authToken = localStorage.getItem('token');
/* Getting the user's email from the local storage. */
      const userEmail = localStorage.getItem('userEmail');
      console.log(userEmail);
    /* Sending the user's email, comment, and post ID to the WordPress site. */
      const response = await axios.post(`${wordPressSiteUrl}wp-json/wp/v2/comments`, {
        email: userEmail,
        content: comment,
        post: postId,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      setLoading(false);
/* Checking if the response.data.id is true or false. If it is true, then it sets the state of the
commentCreated to true. If it is false, then it sets the state of the commentCreated to false. */
      setCommentCreated(!!response.data.id);
      setMessage(response.data.id ? 'New comment created' : '');
      setComment('');
    } catch (error) {
      setLoading(false);
      setMessage(error.response.data.message);
    }
  };

 /* Getting the user ID and token from the local storage and setting the state of the user ID and
 token. */
  useEffect(() => {
    const userId = localStorage.getItem('userID');
    const token = localStorage.getItem('token');
    setUserId(userId);
    setToken(token);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="mt-5" style={{maxWidth: '800px'}}>
      <fieldset>
        <legend className="mb-4">Leave a Comment</legend>
        {/* Checking if the message is true or false. If it is true, then it is displaying the message.
        If it is false, then it is not displaying the message. */ }
        {message && <div className={`alert ${commentCreated ? 'alert-success' : 'alert-danger'}`} dangerouslySetInnerHTML={createMarkup(message)}/>}
        <div className="form-group">
          <label htmlFor="comment">Comment</label>
          <textarea name="comment" className="form-control" onChange={handleInputChange} id="comment" rows="3" value={comment}/>
        </div>
        <button type="submit" className="btn btn-success">Comment</button>
      </fieldset>
    </form>
  );
}
export default CreateComment;
