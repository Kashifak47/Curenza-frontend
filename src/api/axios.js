// src/api/axios.js
import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Automatically attach the JWT token to every request if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('curenza_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;