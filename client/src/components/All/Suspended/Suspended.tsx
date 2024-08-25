import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Suspended = () => {
  //Hooks
  const navigate = useNavigate();
  return (
    <div className="suspended-container">
      <h2 className="suspended-container-title">
        Sorry, your account has been suspended
      </h2>
      <p>Please contact your administrator</p>
      <NavLink to="/" className="suspended-container-link">
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

export default Suspended;
