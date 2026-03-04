import axios from 'axios';

// Dynamically determine the API base URL based on environment
// On Vercel, it uses relative '/api/v1' path matching the vercel.json rewrite
// On Localhost, it falls back to the Express development server port 5000
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api/v1'
    : '/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercept requests to add the Authorization Bearer Token if logged in
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
