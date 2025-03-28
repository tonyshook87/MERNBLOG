import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const PrivateRoute = () => {
  const { user } = useContext(UserContext);
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

// return user ? <Outlet /> : <Navigate to="/login" />;:

// If user exists (meaning the user is logged in), it renders an <Outlet />.

// <Outlet /> is a placeholder for child routes in react-router-dom. It allows protected routes defined within this PrivateRoute to render.

// If user is not present (meaning the user is not logged in), it redirects the user to the /login page using <Navigate to="/login" />
