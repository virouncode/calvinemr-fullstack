import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Missing = () => {
  const navigate = useNavigate();
  return (
    <div className="missing-container">
      <h2 className="missing-container-title">Page not found</h2>
      <NavLink to="/" className="missing-container-link">
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

export default Missing;
