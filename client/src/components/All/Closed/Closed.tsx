import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Closed = () => {
  //Hooks
  const navigate = useNavigate();
  return (
    <div className="closed-container">
      <h2 className="closed-container-title">
        Sorry, your account has been closed
      </h2>
      <p>Please contact your administrator</p>
      <NavLink to="/" className="closed-container-link">
        Return to the login page
      </NavLink>
      <div
        style={{ textDecoration: "underline", cursor: "pointer" }}
        onClick={() => navigate(-1)}
      >
        Go back
      </div>
    </div>
  );
};

export default Closed;
