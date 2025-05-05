import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/apiClient.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
     
      try {
        const res = await api.get('/api/auth/user');
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error loading user:', error);
        
        // Prevents logout on network issues or server errors
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('token');
          setToken(null);
          setIsAuthenticated(false);
          setError('Authentication failed. Please login again.');
        }
      } finally {
        setLoading(false);
      }
    };
   
    loadUser();
  }, [token]);

  // Register user
  const register = async (formData) => {
    try {
      setLoading(true);
      setError(null);
     
      // Log the request payload for debugging
      // console.log('Register payload:', formData);
     
      // Explicitly format the data for clarity
      const requestData = {
        email: formData.email,
        password: formData.password
      };
     
      // console.log('Making API request to:', '/api/auth/signup');
      // console.log('With data:', requestData);
     
      const res = await api.post('/api/auth/signup', requestData);
     
      // console.log('Response received:', res.data);
     
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
     
      return res.data;
    } catch (error) {
      console.error('Registration error details:', error);
     
      if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      }
     
      setError(
        error.response?.data?.error ||
        'Registration failed. Please try again.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      setLoading(true);
      setError(null);
     
      // Log the request payload for debugging
      // console.log('Login payload:', formData);
     
      // Explicitly format the data for clarity
      const requestData = {
        email: formData.email,
        password: formData.password
      };
     
      // console.log('Making API request to:', '/api/auth/login');
      // console.log('With data:', requestData);
     
      const res = await api.post('/api/auth/login', requestData);
     
      // console.log('Response received:', res.data);
     
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
     
      return res.data;
    } catch (error) {
      console.error('Login error details:', error);
     
      if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      }
     
      setError(
        error.response?.data?.error ||
        'Login failed. Please check your credentials.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Clear error
  const clearError = () => setError(null);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;