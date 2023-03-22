import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import {createRoot} from "react-dom/client";
import BlogPosts from "./component/main";
import SinglePost from "./component/SinglePost";
import SinglePostWithErrorBoundary from "./component/SinglePost";
import { useParams } from 'react-router-dom';


function Apps() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/post/:postId"
          component={SinglePostWithErrorBoundary}
          element={<SinglePostWrapper />}
        />
        <Route path="/" element={<BlogPosts />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Apps;

function SinglePostWrapper() {
  const { postId } = useParams();
  return <SinglePost key={postId} />;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Apps />
  </React.StrictMode>
);
