import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../Authentication/auth';

const PrivateRoute = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // If not authenticated, redirect to the login page
    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default PrivateRoute;
