import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const Dashboard = () => {
 /* This is a check to see if the user is authenticated. If not, it will redirect them to the login
	page. */
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem("authenticated") || false
  );

 /* This is the state of the component. */
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userID, setUserID] = useState("");
  const [token, setToken] = useState("");
  const [postCreated, setPostCreated] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState(null);

  const createMarkup = (data) => ({ __html: data });

/**
 * If the name of the input is title, set the title state to the value of the input, otherwise set the
 * content state to the value of the input.
 * @param event - The event object is a JavaScript event that is sent to an element when an event
 * occurs on the element.
 */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    name === "title" ? setTitle(value) : setContent(value);
  };

  const handleMediaChange = (event) => {
    setMedia(event.target.files[0]);
  };

/**
 * It takes the form data, sends it to the WordPress site, and then sets the loading state to false,
 * sets the postCreated state to true if the post was created, and sets the message state to the
 * response data message.
 * @param event - The event object that is passed to the function.
 */
  const handleFormSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    // formData.append("author", userID);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", "publish");
    if (media) {
      formData.append("file", media);
    }

/* The URL of the WordPress site. */
    const wordPressSiteUrl = "http://colormag.local";
/* Getting the token from local storage. */
    const authToken = localStorage.getItem("token");

    axios
      .post(`${wordPressSiteUrl}/wp-json/wp/v2/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setPostCreated(!!res.data.id);
        setMessage(res.data.id ? "New Post Created" : "");
      })
      .catch((err) => {
        setLoading(false);
        setMessage(err.response.data.message);
      });
  };

/* Getting the userID and token from local storage and setting the state of the component to the userID
and token. */
  useEffect(() => {
    const userID = localStorage.getItem("userID");
    const token = localStorage.getItem("token");
    setUserID(userID);
    setToken(token);
  }, []);

 /* This is a check to see if the user is authenticated. If not, it will redirect them to the login
 page. */
  if (!authenticated) {
    navigate("/AppLogin");
    return null;
  }


  return (
    <>
      <Navbar />
      <div className="mt-5 container">
        <form
          onSubmit={handleFormSubmit}
          className="mt-5"
          style={{ maxWidth: "800px" }}
        >
          <fieldset>
            <legend className="mb-4">Create Post</legend>

            {message && (
              <div
                className={`alert ${
                  postCreated ? "alert-success" : "alert-danger"
                }`}
                dangerouslySetInnerHTML={createMarkup(message)}
              />
            )}

            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                onChange={handleInputChange}
                className="form-control"
                id="title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                name="content"
                className="form-control"
                onChange={handleInputChange}
                id="content"
                rows="3"
              />
            </div>
						<div className="form-group">
      <label htmlFor="media">Media</label>
      <input type="file" name="file" className="form-control" id="media"/>
    </div>

    <button type="submit" className="btn btn-secondary mt-3">Submit</button>
  </fieldset>
</form>
<p className="mt-2">This is the logged in dashboard</p>
</div>
  </>
);
};
export default Dashboard;
