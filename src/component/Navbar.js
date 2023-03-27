import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import houseIcon from "../assets/img/house-door-fill.svg";

const Navbar = () => {
/* A hook that is used to update the time every second. */
  const [currentTime, setCurrentTime] = useState(new Date());
/* Checking if the user is logged in or not. */
  const loggedInUser = sessionStorage.getItem("authenticated");

 /* A hook that is used to update the time every second. */
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

   /* A cleanup function that is called when the component is unmounted. */
    return () => {
      clearInterval(intervalId);
    };
  }, []);

/* Used to get the current date and time. */
  const currentDate = currentTime.toLocaleDateString();
  const currentTimeString = currentTime.toLocaleTimeString();


  return (
    <div>
<nav class=" navbar fixed-top navbar-expand-lg navbar-dark bg-primary">
  <div class="container">
  <Link to="/" className="navbar-item">
            <img src={houseIcon} alt="home" style={{ width: "30px", height: "30px" }} />
          </Link>

  {/*  A ternary operator. It is used to check if the user is logged in or not. If the user is logged in,
  then the user will see the navbar items. If the user is not logged in, then the user will not see
  the navbar items. */ }
    {!loggedInUser ? (
          ""
      ) : (
        
        <div class="collapse navbar-collapse  text-center" id="navbarText">
      <ul class="navbar-nav  me-auto mb-2 mb-lg-0">
        <li class="nav-item ">
        <Link to="/" className="navbar-item mx-3 text-white">
         Colormag
          </Link>
        </li>
        <li class="nav-item ">
        <Link to="/Dashboard" className="navbar-item mx-3 text-white">
         Create a Post 
          </Link>
        </li>
        <li class="nav-item ">
        <Link to="/" className="navbar-item mx-3 text-white">
         All post
          </Link>
        </li>
      </ul>
      </div>
          
      )}
      <div className="navbar-item text-white" >
          {currentDate} - {currentTimeString}
        </div>
       {/* /* A ternary operator. It is used to check if the user is logged in or not. If the user is
       logged in,
         then the user will logout button and vice-versa  */ }
        {!loggedInUser ? (
          
            <Link to="/AppLogin" className="navbar-item mx-3 text-white">Login</Link>
            
        ) : (
          
            <Link to="/LogOut" className="navbar-item mx-3 text-white">Logout</Link>
            
        )}
    </div>
</nav>


    {/* <div className="bg-info">
      <nav className="navbar container ">
        <div className="mx-3  ">
          <Link to="/" className="navbar-item">
            <img src={houseIcon} alt="home" style={{ width: "30px", height: "30px" }} />
          </Link>
        </div>
        <div className="float-start text-secondary m-2 ">
          <Link to="/" className="navbar-item mx-4">
            Home
          </Link>
          <Link to="/about" className="navbar-item mx-4">
            About
          </Link>
          <Link to="/contact" className="navbar-item mx-4">
            Contact
          </Link>
        </div>
        <div className="navbar-item" >
          {currentDate} - {currentTimeString}
        </div>
      </nav>
    </div> */}
    </div>
  );
};

export default Navbar;
