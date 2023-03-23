import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import houseIcon from "../assets/img/house-door-fill.svg";

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const currentDate = currentTime.toLocaleDateString();
  const currentTimeString = currentTime.toLocaleTimeString();


  return (
    <div>
<nav class=" navbar fixed-top navbar-expand-lg navbar-dark bg-primary">
  <div class="container">
  <Link to="/" className="navbar-item">
            <img src={houseIcon} alt="home" style={{ width: "30px", height: "30px" }} />
          </Link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse  text-center" id="navbarText">
      <ul class="navbar-nav  me-auto mb-2 mb-lg-0">
        <li class="nav-item ">
        <Link to="/" className="navbar-item mx-3 text-white">
         Colormag
          </Link>
        </li>
       
      </ul>
      <div className="navbar-item text-white" >
          {currentDate} - {currentTimeString}
        </div>
        <Link to="/AppLogin" className="navbar-item mx-3 text-white">
        Login 
          </Link> 
    </div>
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
