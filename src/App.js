import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import BlogPosts from "./component/main";
import SinglePost from "./component/SinglePost";
import SinglePostWithErrorBoundary from "./component/SinglePost";
import Login from "./component/login/AppLogin";
import Dashboard from "./component/login/Dashboard";
import LogOut from "./component/LogOut/LogOut";

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
        <Route path="/AppLogin" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/LogOut" element={<LogOut />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Apps;

function SinglePostWrapper() {
  return <SinglePost />;
}