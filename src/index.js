import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';  // Keep the import of axios here
import App from './App';

// Set axios global configuration for credentials
axios.defaults.withCredentials = true;

// Optionally, set the Authorization header if a token is stored in localStorage
const token = localStorage.getItem('jwtToken');
if (token) {
  axios.defaults.headers['Authorization'] = `Bearer ${token}`;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
