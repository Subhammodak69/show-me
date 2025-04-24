import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to send OTP
  const sendOtp = async () => {
    try {
      await axios.post('http://localhost:8000/api/send-otp/', { email });
      setIsOtpSent(true);
      setSuccess('OTP sent to your email');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
      setSuccess('');
    }
  };

  // Function to verify OTP
  const verifyOtp = async () => {
    try {
      await axios.post('http://localhost:8000/api/verify-otp/', { email, otp });
      setIsOtpVerified(true);
      setSuccess('OTP verified. Continue with registration.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
      setSuccess('');
    }
  };

  // Handle input changes
  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle signup process
  const handleSignup = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/users/', {
        ...formData,
        email
      });
      setSuccess('Registration successful!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
      setSuccess('');
    }
  };

  return (
    <div>
      {/* OTP send section */}
      {!isOtpSent ? (
        <>
          <input
            name="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      ) : !isOtpVerified ? (
        <>
          <input
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      ) : (
        <>
          <input
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
          />
          <input
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button onClick={handleSignup}>Register</button>
        </>
      )}

      {/* Error and Success Messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <Link to="/signin/">Already have an account?</Link>
    </div>
  );
};

export default SignupForm;
