import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const UserRoute = ({ children }) => {
  const userData = localStorage.getItem("user");
  if (!userData) {
    return <Navigate to="/login" />;
  }
  const authUser = JSON.parse(userData);

  const allowedRoles = ["grower", "breeder", "admin"];
  if (!allowedRoles.includes(authUser.role)) {
    toast.error("You are not authorized to access this page");
    return <Navigate to="/" />;
  }

  return children;
};

export default UserRoute;
