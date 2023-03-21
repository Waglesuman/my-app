import { BrowserRouter, Routes, Route } from "react-router-dom";
import {createRoot} from "react-dom/client";
import BlogPosts from "./component/main";
import SinglePost from "./component/SinglePost";
import SinglePostWithErrorBoundary from "./component/SinglePost";


function Apps() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/post/:postId" component={SinglePostWithErrorBoundary}  element={<SinglePost />} ></Route>
        <Route path="/" element={<BlogPosts />}>
        </Route>
      </Routes>
    </BrowserRouter>
  )  
} 
export default Apps;

createRoot(document.getElementById('root')).render(<Apps />);
