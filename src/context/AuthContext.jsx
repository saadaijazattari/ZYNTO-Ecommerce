// context/AuthContext.jsx - Updated with role

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['x-auth-token'] = token;
        } else {
            delete axios.defaults.headers.common['x-auth-token'];
        }
    }, [token]);

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/auth/me');
                setUser(response.data.user);
            } catch (error) {
                console.error('Error loading user:', error);
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    const register = async (userData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', userData);
            
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                setUser(response.data.user);
                return { success: true, role: response.data.user.role };
            }
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Registration failed' 
            };
        }
    };

    const login = async (userData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', userData);
            
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                setUser(response.data.user);
                return { success: true, role: response.data.user.role };
            }
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // Role check helper functions
    const isAdmin = () => user?.role === 'admin';
    const isVendor = () => user?.role === 'vendor';
    const isUser = () => user?.role === 'user';
    const hasRole = (role) => user?.role === role;
    const hasAnyRole = (roles) => roles.includes(user?.role);

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
        // Role helpers
        isAdmin,
        isVendor,
        isUser,
        hasRole,
        hasAnyRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};