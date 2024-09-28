import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Suspended = () => {
  //Hooks
  const navigate = useNavigate();
  return (
    <div className="suspended__container">
      <h2 className="suspended__title">
        Sorry, your account has been suspended
      </h2>
      <p>Please contact your administrator</p>
      <NavLink to="/" className="suspended__link">
        Return to the login page
      </NavLink>
    </div>
  );
};

export default Suspended;
