import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <div className="dash-buttons">
      <Link to="/manage-profile" className="btn btn-light">
        <span>
          <i className="fas fa-user-circle text-primary"></i>
        </span>
        Edit Profile
      </Link>
      <Link to="/manage-experience" className="btn btn-light">
        <span>
          <i className="fab fa-black-tie text-primary"></i>
        </span>
        Add Experience
      </Link>
      {/* <Link to="/manage-education" className="btn btn-light">
        <span>
          <i className="fas fa-graduation-cap text-primary"></i>
        </span>
        Add Education
      </Link> */}
    </div>
  );
};

export default Nav;
