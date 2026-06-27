import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;
if(!API_URL){ console.error('ERROR: REACT_APP_API_BASE_URL is not defined. Please check your client/.env file.'); }

const api = axios.create({
    baseURL: API_URL || '',
    headers: {'Content-Type': 'application/json', },
    withCredentials: true,
});

export const setupCsrf = async () => {
    try {
        const { data } = await api.get('/api/csrf-token');
        api.defaults.headers.common['x-csrf-token'] = data.csrfToken;
    } 
    catch(error){ console.error('Failed to fetch CSRF token:', error); }
};

export const resetSessionController = () => { delete api.defaults.headers.common['x-csrf-token']; };

/* 
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token){ config.headers['Authorization'] = `Bearer ${token}`; }
        return config;
    },
    (error) => { return Promise.reject(error); }
);
 */
export default api;