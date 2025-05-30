import React, { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthContext from "../hooks/context/useAuthContext";
import useUserContext from "../hooks/context/useUserContext";

type RequireAuthProps = {
  allowedAccesses: string[];
};

const RequireAuth = ({ allowedAccesses }: RequireAuthProps) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const location = useLocation();

  return allowedAccesses.includes(user?.access_level as string) ? (
    <Outlet />
  ) : auth?.email ? ( //user is logged in but not allowed to access this page
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    //user is not logged in
    <Navigate to="/" state={{ from: location }} replace />
  );
};
export default RequireAuth;
