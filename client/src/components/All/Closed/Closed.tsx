import React from "react";
import { NavLink } from "react-router-dom";

const Closed = () => {
  //Hooks
  return (
    <div className="closed__container">
      <h2 className="closed__title">Sorry, your account has been closed</h2>
      <p>Please contact your administrator</p>
      <NavLink to="/" className="closed__link">
        Return to the login page
      </NavLink>
    </div>
  );
};

export default Closed;
