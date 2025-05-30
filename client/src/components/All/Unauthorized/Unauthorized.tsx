import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Unauthorized = () => {
  //Hooks
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="unauthorized__container">
      <h2 className="unauthorized__title">
        Unauthorized Page : you don't have access to the requested page (
        {location.state?.from?.pathname})
      </h2>
      <p>Please contact your administrator</p>
      <NavLink className="unauthorized__link" to="/">
        Return to login page
      </NavLink>
      <div className="unauthorized__link" onClick={() => navigate(-1)}>
        Go back
      </div>
    </div>
  );
};

export default Unauthorized;
