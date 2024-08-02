
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="unauthorized-container">
      <h2 className="unauthorized-container-title">
        Unauthorized Page : you don't have access to the requested page (
        {location.state?.from?.pathname})
      </h2>
      <p>Please contact your administrator</p>
      <NavLink className="unauthorized-container-link" to="/">
        Return to login page
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

export default Unauthorized;
