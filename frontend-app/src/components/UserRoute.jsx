import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const UserRoute = ({ children }) => {
    const userData = localStorage.getItem("user");
    const location = useLocation();
    if (!userData) {
        return <Navigate to="/login" state={{ from: location.pathname }} />;
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
