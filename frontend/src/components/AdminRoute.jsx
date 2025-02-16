import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useStore } from "../store/useStore";

const AdminRoute = ({ children }) => {
  const userData = localStorage.getItem("user");
  if (!userData) {
    return <Navigate to="/login" />;
  }
  const authUser = JSON.parse(userData);

  if (authUser.role != "admin") {
    toast.error("You are not authorized to access this page");
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
