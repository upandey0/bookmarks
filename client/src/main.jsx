import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
axios.defaults.baseURL = process.env.VITE_API_BASE_URL || 'https://bookmarks-mmz9.onrender.com';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
  </React.StrictMode>
);