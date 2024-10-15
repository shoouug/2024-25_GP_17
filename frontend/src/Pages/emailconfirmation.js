import React, { useState } from 'react';
import './emailconfirmation.css'; // Add your CSS file for styling
import PreferenceTopics from './PreferenceTopics'; // Import the PreferenceTopics component

const EmailConfirmation = () => {
  const [confirmationCode, setConfirmationCode] = useState(''); // Store the confirmation code entered by the user
  const [isConfirmed, setIsConfirmed] = useState(false); // To track if the email is confirmed

  // Handle form input change for confirmation code
  const handleChange = (e) => {
    setConfirmationCode(e.target.value);
  };

  // Handle form submission for confirmation code
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate confirmation logic
    if (confirmationCode === '123456') {  // Replace '123456' with the correct logic in production
      alert('Email confirmed successfully!');
      setIsConfirmed(true); // Set the email as confirmed
    } else {
      alert('Invalid confirmation code. Please try again.');
    }
  };

  // Simulate resending the confirmation code
  const handleResend = () => {
    alert('A new confirmation code has been sent to your email.');
  };

  // Only show the confirmation form if the email is not confirmed
  return (
    <div className="email-confirmation-container">
      {!isConfirmed ? (
        <form onSubmit={handleSubmit}>
          <h2>We just sent a confirmation code to your email</h2>
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
        </form>
      ) : (
        // Once email is confirmed, show the Preference Topics page/modal
        <PreferenceTopics />
      )}
    </div>
  );
};

export default EmailConfirmation;
