// components/RoleBasedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles, redirectTo = '/login' }) => {
    const { isAuthenticated, loading, hasAnyRole } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} />;
    }

    // Check if user has required role
    if (!hasAnyRole(allowedRoles)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default RoleBasedRoute;