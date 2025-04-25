import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// Set axios global configuration for credentials
axios.defaults.withCredentials = true;

const SignupForm = () => {
  const purpose = "signup";
  const navigate = useNavigate();

  // State initialization
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

  // Send OTP to email
  const sendOtp = async () => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/send-otp/',
        { email, purpose },
        { withCredentials: true }
      );
      setIsOtpSent(true);
      setSuccess(res.data.message || 'OTP sent to your email');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
      setSuccess('');
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/verify-otp/',
        { email, otp },
        { withCredentials: true }
      );
      setIsOtpVerified(true);
      setSuccess(res.data.message || 'OTP verified. Continue with registration.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
      setSuccess('');
    }
  };

  // Handle input change for form fields
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Complete registration
  const handleSignup = async () => {
    try {
      const res = await axios.post(
        'http://localhost:8000/api/users/',
        { ...formData, email },
        { withCredentials: true }
      );
      
      // Assuming backend returns a token after successful signup
      const { token } = res.data; // assuming backend sends JWT token in 'data.token'
      
      // Store the JWT token in localStorage (or cookies if needed)
      localStorage.setItem('jwtToken', token);

      setSuccess(res.data.message || 'Registration successful!');
      setError('');

      // Redirect to signin after short delay
      setTimeout(() => {
        navigate('/signin/');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
      setSuccess('');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '1rem' }}>
      <h2>Sign Up</h2>

      {/* Step 1: Enter Email */}
      {!isOtpSent ? (
        <>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />
          <button onClick={sendOtp} style={{ width: '100%', padding: '0.5rem' }}>
            Send OTP
          </button>
        </>
      ) : !isOtpVerified ? (
        <>
          {/* Step 2: Enter OTP */}
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />
          <button onClick={verifyOtp} style={{ width: '100%', padding: '0.5rem' }}>
            Verify OTP
          </button>
        </>
      ) : (
        <>
          {/* Step 3: Complete registration */}
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />
          <button onClick={handleSignup} style={{ width: '100%', padding: '0.5rem' }}>
            Sign up
          </button>
        </>
      )}

      {/* Feedback Messages */}
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '0.5rem' }}>{success}</p>}

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <Link to="/signin/">Already have an account?</Link>
      </div>
    </div>
  );
};

export default SignupForm;
