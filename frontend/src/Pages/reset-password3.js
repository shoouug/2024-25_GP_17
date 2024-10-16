// reset-password3.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './reset-password1.css';
import './buttons.css';


import Logo from '../images/logo.png';

const ResetPassword3 = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Get the email from previous pages

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      setError('');
      // Proceed with password reset logic
      alert(`Password successfully reset for ${email}`);
      navigate('/login'); // Navigate back to login page
    }
  };

  return (
    <div className="reset-password-container">
      <img src={Logo} alt="Logo" className="logo3" />
      <p className="title">Set your new password</p>

      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="password"
            value={password}
            placeholder="New password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i className="fas fa-lock"></i>
        </div>
        <div className="input-container">
          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <i className="fas fa-lock"></i>
        </div>
        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="continue-button3">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword3;
