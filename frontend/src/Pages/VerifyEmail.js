import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, applyActionCode } from 'firebase/auth';
import './VerifyEmail.css';
import Logo from '../images/logo.png';
const VerifyEmail = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const oobCode = queryParams.get('oobCode');

    if (oobCode) {
      applyActionCode(auth, oobCode)
        .then(() => {
          console.log('Email verified successfully!');
        })
        .catch((error) => {
          console.error('Error verifying email:', error);
        });
    }
  }, [auth]);

  const handleNextClick = () => {
    navigate('/preference-topics');
  };

  return (
    <div className="verify-email-container">
      <div className="logo-container">
        <img src={Logo} alt="Website Logo" className="website-logo" />
      </div>
      <div className="message-box">
        <h3>Your email has been verified!</h3>
        <p>Please click "Next" to complete your profile</p>
        <button className="next-button" onClick={handleNextClick}>
          Next
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;