import React from "react";
import { NavLink, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError() as { statusText: string; message: string };

  return (
    <div className="closed__container">
      <h2 className="closed__title">
        Sorry, an error occured: {error.statusText || error.message}
      </h2>
      <p>Please contact your administrator</p>
      <NavLink to="/" className="closed__link">
        Return to the login page
      </NavLink>
    </div>
  );
};

export default Error;
