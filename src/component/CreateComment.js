import React, { useState, useEffect } from 'react';
import axios from 'axios';


const CreateComment = ({ postId }) => {

  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [commentCreated, setCommentCreated] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const createMarkup = ( data ) => ({ __html: data });

  const handleInputChange = ( event ) => {
    const { value } = event.target;
    setComment(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const wordPressSiteUrl = 'http://colormag.local/';
      const authToken = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');
      console.log(userEmail);
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
      setCommentCreated(!!response.data.id);
      setMessage(response.data.id ? 'New comment created' : '');
      setComment('');
    } catch (error) {
      setLoading(false);
      setMessage(error.response.data.message);
    }
  };

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
