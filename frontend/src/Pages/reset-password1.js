// reset-password1.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './reset-password1.css';
import Logo from '../images/Logo.png';

const ResetPassword1 = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleContinue = (e) => {
    e.preventDefault();

    // Validation logic for email
    if (email) {
      setError('');
      navigate('/reset-password2', { state: { email } }); // Pass email to reset-password2
    } else {
      setError('Please enter your email address.');
    }
  };

  return (
    <div className="reset-password-container">
      <img src={Logo} alt="Logo" className="logo1" />
      <p className="title">Reset your password</p>

      <form onSubmit={handleContinue}>
        <p className="label">Enter your email address</p>
        <div className="input-container">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <i className="fas fa-envelope"></i>
        </div>
        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="continue-button">Continue</button>
      </form>
    </div>
  );
};

export default ResetPassword1;
