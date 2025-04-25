import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;  // Ensures cookies are sent with requests

const SigninForm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpPhase, setOtpPhase] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();  // For programmatic navigation

  // Send OTP to email for signin
  const handleSignin = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    try {
      const purpose = 'signin';
      const response = await axios.post(
        'http://127.0.0.1:8000/api/send-otp/', 
        { email, purpose },
        { withCredentials: true }  // Include cookies in the request
      );
      setOtpPhase(true);  // Show OTP input
      setSuccess(response.data.message || 'OTP sent to your email.');
      setError('');
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Signin failed';
      setError(message);
      setSuccess('');
    } finally {
      setLoading(false);  // Stop loading indicator
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp) {
      setError('OTP is required');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/signin/',
        { email, otp },
        { withCredentials: true }  // Maintain session on backend
      );
      setSuccess(response.data.message || 'OTP verified. You are now logged in.');
      setError('');

      // Store JWT token in localStorage
      const token = response.data.token; // Assuming token is returned
      localStorage.setItem('authToken', token);  // Store the token

      // Set token in axios headers for subsequent requests
      axios.defaults.headers['Authorization'] = `Bearer ${token}`;

      // Redirect after a brief delay
      setTimeout(() => {
        navigate('/');  // Redirect to the home page or any other page
      }, 1000);
    } catch (err) {
      const message = err.response?.data?.error || 'Invalid OTP';
      setError(message);
      setSuccess('');
    } finally {
      setLoading(false);  // Stop loading indicator
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '1rem' }}>
      <h2>Sign In</h2>
      {otpPhase ? (
        <>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />
          <button onClick={verifyOtp} style={{ width: '100%', padding: '0.5rem' }}>
            Log in
          </button>
        </>
      ) : (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />
          <button onClick={handleSignin} style={{ width: '100%', padding: '0.5rem' }}>
            Send OTP
          </button>
        </>
      )}
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '0.5rem' }}>{success}</p>}

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <Link to="/signup/">Create Account</Link>
      </div>
    </div>
  );
};

export default SigninForm;
