import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './emailconfirmation.css'; // Add your CSS file for styling

const EmailConfirmation = () => {
  const [confirmationCode, setConfirmationCode] = useState(''); // Store the confirmation code entered by the user
  const [isConfirmed, setIsConfirmed] = useState(false); // To track if the email is confirmed
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form input change for confirmation code
  const handleChange = (e) => {
    setConfirmationCode(e.target.value);
  };

  // Handle form submission for confirmation code
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate confirmation logic (replace with real logic)
    if (confirmationCode === '123456') {  // Replace '123456' with the correct logic in production
      alert('Email confirmed successfully!');
      setIsConfirmed(true); // Set the email as confirmed
      // Redirect to the Preference Topics page after successful confirmation
      navigate('/preference-topics');  // Update this to match the correct route in App.js
    } else {
      setError('Invalid confirmation code. Please try again.');
    }
  };

  // Simulate resending the confirmation code
  const handleResend = () => {
    alert('A new confirmation code has been sent to your email.');
  };

  return (
    <div className="email-confirmation-container">
      {!isConfirmed ? (
        <form onSubmit={handleSubmit}>
          <h3 className='conf-msg'>We just sent a confirmation code to your email</h3>
          <input
            type="text"
            name="confirmationCode"
            placeholder="Enter Confirmation Code"
            value={confirmationCode}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit Code</button>
          <button type="button" onClick={handleResend}>
            Didn't work? Send another code.
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        </form>
      ) : (
        <p>Redirecting to Preferences...</p>  // Just show a message while redirecting
      )}
    </div>
  );
};

export default EmailConfirmation;