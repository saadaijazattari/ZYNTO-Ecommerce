import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api'; // <-- use your Axios instance

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/auth/me');
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
            const response = await api.post('/auth/register', userData);
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
            const response = await api.post('/auth/login', userData);
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

    const isAdmin = () => user?.role === 'admin';
    const isVendor = () => user?.role === 'vendor';
    const isUser = () => user?.role === 'user';
    const hasRole = (role) => user?.role === role;
    const hasAnyRole = (roles) => roles.includes(user?.role);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                register,
                login,
                logout,
                isAuthenticated: !!user,
                isAdmin,
                isVendor,
                isUser,
                hasRole,
                hasAnyRole
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};