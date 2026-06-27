import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const getDashboardPath = (user) => {
    switch (user?.kind) {
        case 'admin':
            return '/admin';
        case 'employee':
            return '/employee';
        case 'client':
            return '/client';
        default:
            return '/login';
    }
};

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return (<div className='page-loading-case'><div className='page-loading'>
            <div className='loader-line-scale'><div></div><div></div><div></div><div></div><div></div></div>
            <h3>Authenticating...</h3><p>Please wait while we verify your credentials.</p>
        </div></div>);
    }

    if (!isAuthenticated) { return <Navigate to="/login" replace />; }
    const isAuthorized = allowedRoles && allowedRoles.includes(user?.kind);

    if (isAuthorized) { return <Outlet />; }
    else {
        const userDashboardPath = getDashboardPath(user);
        return <Navigate to={userDashboardPath} replace />;
    }
};

export default ProtectedRoute;