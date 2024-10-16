// reset-password2.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './reset-password1.css';
import './reset-password2.css';
import './buttons.css';



import Logo from '../images/Logo.png';

const ResetPassword2 = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; 

  const handleContinue = (e) => {
    e.preventDefault();

    // Fake validation 
    if (code === '123456') {
      setError('');
      navigate('/reset-password3', { state: { email } }); // Pass email to reset-password3
    } else {
      setError('Invalid code. Please try again.');
    }
  };

  return (
    <div className="reset-password-container">
      <img src={Logo} alt="Logo" className="logo2" />
      <p className="title">Enter the code sent to your email</p>

      <form onSubmit={handleContinue}>
        <div className="input-container">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <i className="fas fa-key"></i>
        </div>
        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="reset-password2-continue-button">Continue</button>
      </form>
    </div>
  );
};

export default ResetPassword2;
