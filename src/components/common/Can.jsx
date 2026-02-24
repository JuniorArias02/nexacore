import React from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Component to conditionally render content based on user permissions.
 * 
 * @param {Object} props
 * @param {string|string[]} props.permission - A single permission string or an array of permissions.
 * @param {React.ReactNode} props.children - Content to render if permission is granted.
 * @param {boolean} props.all - If true, requires ALL permissions in the array (default: false, means ANY).
 * @returns {React.ReactNode|null}
 */
const Can = ({ permission, permissions, children, all = false }) => {
    const { hasPermission, hasAnyPermission, permissions: userPerms } = useAuth();

    // Support both 'permission' and 'permissions' props
    const permsToCheck = permission || permissions;

    if (!permsToCheck) return children;

    if (Array.isArray(permsToCheck)) {
        if (all) {
            const hasAll = permsToCheck.every(p => userPerms.includes(p));
            return hasAll ? children : null;
        }
        return hasAnyPermission(permsToCheck) ? children : null;
    }

    return hasPermission(permsToCheck) ? children : null;
};

export default Can;
