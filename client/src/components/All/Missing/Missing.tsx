import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Missing = () => {
  //Hooks
  const navigate = useNavigate();
  return (
    <div className="missing__container">
      <h2 className="missing__title">Page not found</h2>
      <NavLink to="/" className="missing__link">
        Return to the login page
      </NavLink>
      <div className="missing__link" onClick={() => navigate(-1)}>
        Go back
      </div>
    </div>
  );
};

export default Missing;
