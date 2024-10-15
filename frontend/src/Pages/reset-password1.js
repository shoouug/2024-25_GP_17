import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './reset-password1.css';
import Logo from '../images/Logo.png';

const ResetPassword1 = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleContinue = (e) => {
    e.preventDefault();

    // You can add validation or logic for email and code here
    if (email && code) {
      setError('');
      navigate('/reset-password2'); // Navigate to the next step
    } else {
      setError('Please fill out both fields.');
    }
  };

  return (
    <div className="reset-password-container">
      <img src={Logo} alt="Logo" className="logo" />
      <p className="title">Reset your password</p>

      <form onSubmit={handleContinue}>
        <div className="input-container">
          <input
            type="email"
            value={email}
            placeholder="Enter your email address"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <i className="fas fa-envelope"></i>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={code}
            placeholder="Enter the code sent to your email"
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <i className="fas fa-key"></i>
        </div>
        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="continue-button">Continue</button>
      </form>
    </div>
  );
};

export default ResetPassword1;