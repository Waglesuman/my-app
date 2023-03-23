import Navbar from "../Navbar";
import axios from "axios";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CreatePost from "./CreatePost";

const Dashboard = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem("authenticated") || false
  );

  // const handleLogout = () => {
  //   setAuthenticated(false);
  //   sessionStorage.removeItem("authenticated");
  //   navigate("/AppLogin");
  // };

 





	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [userID, setUserID] = useState('');
	const [token, setToken] = useState('');
	const [postCreated, setPostCreated] = useState(false);
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const createMarkup = ( data ) => ({ __html: data });

	const handleInputChange = ( event ) => {
		const { name, value } = event.target;
		name === "title" ? setTitle(value) : setContent(value);
	};

	const handleFormSubmit = ( event ) => {
		event.preventDefault();
		setLoading(true);

		const formData = {
			author: userID,
			title: title,
			content: content,
			status: 'publish'
		};

		const wordPressSiteUrl = "http://colormag.local";
		const authToken = localStorage.getItem( 'token' );

		axios.post( `${wordPressSiteUrl}/wp-json/wp/v2/posts`, formData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${authToken}`
			}
		} )
			.then( res => {
				setLoading(false);
				setPostCreated(!! res.data.id);
				setMessage(res.data.id ? 'New Post Created' : '');
			})
			.catch( err => {
				setLoading(false);
				setMessage(err.response.data.message);
			});
	};

	useEffect(() => {
		const userID = localStorage.getItem('userID');
		const token = localStorage.getItem('token');
		setUserID(userID);
		setToken(token);
	}, []);







  if (!authenticated) {
    navigate("/AppLogin");
    return null;
  }




  return (
    <>
    <Navbar />
    <div className="mt-5 container">
      


      <form onSubmit={handleFormSubmit} className="mt-5" style={{maxWidth: '800px'}}>
			<fieldset>
				<legend className="mb-4">Create Post</legend>

				{message && <div className={`alert ${postCreated ? 'alert-success' : 'alert-danger'}`} dangerouslySetInnerHTML={createMarkup(message)}/>}

				<div className="form-group">
					<label htmlFor="title">Title</label>
					<input type="text" name="title" onChange={handleInputChange} className="form-control" id="title"/>
				</div>
				<div className="form-group">
					<label htmlFor="content">Content</label>
					<textarea name="content" className="form-control" onChange={handleInputChange} id="content" rows="3"/>
				</div>

				<button type="submit" className="btn btn-secondary">Submit</button>
			</fieldset>
		</form>
      {/* <CreatePost /> */}
      <p>This is the logged in dashboard</p>
      
      {/* <div className="btn btn-primary" onClick={handleLogout}>Logout</div> */}
    </div>
    </>
  );
};

export default Dashboard;
