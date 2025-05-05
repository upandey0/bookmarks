import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use(
  config => {
    
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Log detailed error information
    console.error('❌ Response Error:', {
      message: error.message,
      name: error.name,
      code: error.code,
      config: error.config,
      status: error.response?.status,
      data: error.response?.data
    });
   
    if (error.response && error.response.status === 401 && !window.location.pathname.includes('/login')) {
      console.log('Authentication error detected, redirecting to login');
      
    }
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - possible CORS issue or server unavailable');
    }
    
    return Promise.reject(error);
  }
);

export default api;