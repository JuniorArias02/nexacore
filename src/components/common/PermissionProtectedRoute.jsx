import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Component to protect routes based on permissions.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if the user has permission.
 * @param {string[]} props.requiredPermissions - List of permissions required to access the route.
 * @param {string} props.redirectTo - Route to redirect to if permission is denied.
 */
const PermissionProtectedRoute = ({ children, requiredPermissions = [], redirectTo = '/403' }) => {
    const { isAuthenticated, loading, hasAnyPermission } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-lg font-medium text-gray-600 animate-pulse">Verificando permisos...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If "all" or empty requiredPermissions, allow access
    if (requiredPermissions.length === 0 || requiredPermissions.includes('all')) {
        return children;
    }

    if (!hasAnyPermission(requiredPermissions)) {
        console.warn(`Access Denied. Required any of: ${requiredPermissions.join(', ')}`);
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default PermissionProtectedRoute;
