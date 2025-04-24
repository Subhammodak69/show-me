import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

const SigninForm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpPhase, setOtpPhase] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Send OTP to email
  const handleSignin = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/send-otp/', { email });
      setOtpPhase(true);  // Show OTP input field after email is sent
      setSuccess('OTP sent to your email');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Signin failed');
      setSuccess('');
    }
  };

  // Verify OTP entered by user
  const verifyOtp = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/signin/', { email, otp });
      setSuccess('OTP verified. You are now logged in.');
      setError('');
      
      // Redirect after showing success message
      window.location.href = '/';  // Make sure this is the right route
  
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
      setSuccess('');
    }
  };
  

  return (
    <>
      {otpPhase ? (
        <div>
          <input
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
      ) : (
        <div>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
          />
          <button onClick={handleSignin}>Send OTP</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <Link to='/signup/'>Create Account</Link>
        </div>
      )}
    </>
  );
};

export default SigninForm;
