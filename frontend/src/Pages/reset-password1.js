import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth'; // Firebase function for sending the reset email
import { auth } from '../firebase'; // Import Firebase auth instance
import './reset-password1.css';
import Logo from '../images/Logo.png';

const ResetPassword1 = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleContinue = async (e) => {
    e.preventDefault();

    if (email) {
      try {
        // Trigger Firebase to send the password reset link
        await sendPasswordResetEmail(auth, email);
        setSuccessMessage('A password reset link has been sent   to your email address.');
        setError('');
      } catch (error) {
        setError('Failed to send reset link. Please try again.');
      }
    } else {
      setError('Please enter your email address.');
    }
  };

  return (
    <div className="reset-password-container">
      <img src={Logo} alt="Logo" className="logoIn" />
      <p className="title">Reset your password</p>

      <form className="form2" onSubmit={handleContinue}>
        <div className="input-container">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <i className="fas fa-envelope"></i>
        </div>



        <p className="hint">A password reset link will be sent<br/>to your email address.</p>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>} {/* Success Message */}

        <button type="submit" className="continue-button">Send Reset Link</button> {/* Changed button text */}
      </form>
    </div>
  );
};

export default ResetPassword1;
