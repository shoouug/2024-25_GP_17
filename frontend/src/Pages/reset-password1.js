import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth'; // Firebase function for sending the reset email
import { auth } from '../firebase'; // Import Firebase auth instance
import './reset-password1.css';
import Logo from '../images/logo.png';

const ResetPassword1 = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

const handleContinue = async (e) => {
    e.preventDefault();

    if (email) {
        try {
            // Attempt to send the reset email
            await sendPasswordResetEmail(auth, email);
            setSuccessMessage("Sent successfully");
            setError(''); // Clear any existing error message
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                setError("This email does not exist in our records.");
                setSuccessMessage(''); // Clear any existing success message
            } else {
                setError("Failed to send reset link. Please try again.");
                setSuccessMessage('');
            }
        }
    } else {
        setError("Please enter your email address.");
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



        <p className="hint">a password reset link will be sent to your Email<br/>If the Email exists in our records.</p>

        {error && <p className="error-message1">{error}</p>}
        {successMessage && <p className="success-message1">{successMessage}</p>} {/* Success Message */}

        <button type="submit" className="sendLink-button">Send Reset Link</button> {/* Changed button text */}
      </form>
    </div>
  );
};

export default ResetPassword1;
