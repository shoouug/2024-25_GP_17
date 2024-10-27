import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebase';
import './reset-password1.css';
import Logo from '../images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPassword3 = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [actionCode, setActionCode] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const oobCode = queryParams.get('oobCode');
    setActionCode(oobCode);
  }, [location]);

  const validatePassword = (password) => {
    setIsPasswordValid({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handlePasswordReset = async (newPassword) => {
    if (actionCode) {
      try {
        await confirmPasswordReset(auth, actionCode, newPassword);
        setSuccessMessage('Password has been successfully reset.');
        setError('');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setError('Failed to reset password. Please try again.');
        console.error('Error resetting password:', error);
      }
    } else {
      setError('Invalid or expired reset link.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      setError('');
      handlePasswordReset(password);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  return (
    <div className="reset-password-container2">
      <img src={Logo} alt="Logo" className="logoIn" />
      <p className="title">Set your new password</p>

      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            value={password}
            placeholder="New password"
            onChange={handlePasswordChange}
            required
          />
          <i className="fas fa-lock"></i>
          <FontAwesomeIcon
            icon={isPasswordVisible ? faEyeSlash : faEye}
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="toggle-password-icon"
          />
        </div>

        <div className="input-container">
          <input
            type={isConfirmPasswordVisible ? 'text' : 'password'}
            value={confirmPassword}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <i className="fas fa-lock"></i>
          <FontAwesomeIcon
            icon={isConfirmPasswordVisible ? faEyeSlash : faEye}
            onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
            className="toggle-password-icon"
          />
        </div>

        <ul className="validation-checklist">
          <li className={isPasswordValid.length ? 'valid' : 'invalid'}>
            {isPasswordValid.length ? '✔' : '✘'} At least 8 characters
          </li>
          <li className={isPasswordValid.lowercase ? 'valid' : 'invalid'}>
            {isPasswordValid.lowercase ? '✔' : '✘'} At least one lowercase letter
          </li>
          <li className={isPasswordValid.uppercase ? 'valid' : 'invalid'}>
            {isPasswordValid.uppercase ? '✔' : '✘'} At least one uppercase letter
          </li>
          <li className={isPasswordValid.number ? 'valid' : 'invalid'}>
            {isPasswordValid.number ? '✔' : '✘'} At least one number
          </li>
          <li className={isPasswordValid.specialChar ? 'valid' : 'invalid'}>
            {isPasswordValid.specialChar ? '✔' : '✘'} At least one special character
          </li>
        </ul>
        {error && <p className="error-message2">{error}</p>}
        {successMessage && <p className="success-message2">{successMessage}</p>}
        <button type="submit" className="reset-button">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword3;
