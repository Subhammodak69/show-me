import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axiosInstance from '../axiosInstance'; // Adjust path as needed

const SigninForm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpPhase, setOtpPhase] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Send OTP
  const handleSignin = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/send-otp/', {
        email,
        purpose: 'signin',
      });

      setOtpPhase(true);
      setSuccess(response.data.message || 'OTP sent to your email.');
      setError('');
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Signin failed';
      setError(message);
      setSuccess('');
    } finally {
      setLoading(false);
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
      const response = await axiosInstance.post('/signin/', {
        email,
        otp,
      });
  
      // Get the access token from the response
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
  
      if (accessToken) {
        // Store the tokens in local storage (or session storage as needed)
        localStorage.setItem('access', accessToken);
        localStorage.setItem('refresh', refreshToken);  // Optionally store the refresh token
        setSuccess('OTP verified. You are now logged in.');
        setError('');
        setTimeout(() => {
          navigate('/'); // Redirect to home or any other page
        }, 1000);
      } else {
        setError('No token received');
        setSuccess('');
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Invalid OTP';
      setError(message);
      setSuccess('');
    } finally {
      setLoading(false);
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
