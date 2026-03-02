// utils/api.js - Axios instance with base 


import axios from 'axios';



const api = axios.create({
    baseURL: 'https://zynto-ecommerce-backend-production.up.railway.app/api', // Apne backend ka URL yahan daalo
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - har request mein token bhejo
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - error handle karo
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - token expire ho gaya
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;