import React, { useState } from 'react';
import './Signup.css'; // Assuming you have some CSS for styling

const SignUp = () => {
  const [step, setStep] = useState(1); // Track the step: Sign up, confirmation, preferences
  const [codeSent, setCodeSent] = useState(false); // Track if the confirmation code has been sent
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
    topics: [],
    uploadedFile: null,
  });

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    setFormData((prev) => ({
      ...prev,
      uploadedFile: e.target.files[0],
    }));
  };

  // Handle topic selection (checkbox)
  const handleTopicSelection = (topic) => {
    setFormData((prev) => {
      const topics = prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic];
      return { ...prev, topics };
    });
  };

  // Simulate API call for sign-up (Step 1: Sign Up)
  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    // Simulate successful sign-up and email confirmation code being sent
    try {
      setTimeout(() => {
        console.log('Sign-up successful, sending confirmation code...');
        setStep(2); // Move to email confirmation step
      }, 1000); // Simulating a 1-second delay
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('Sign-up failed. Please try again.');
    }
  };

  // Simulate email confirmation code verification (Step 2: Confirm Email)
  const handleSubmitCode = async (e) => {
    e.preventDefault();

    // Mock validation of the confirmation code
    if (formData.confirmationCode === '123456') {
      alert('Email confirmed successfully!');
      setStep(3); // Move to preferences step
    } else {
      alert('Invalid confirmation code. Please try again.');
    }
  };

  // Simulate submitting preferences (Step 3: Preferences)
  const handleSubmitPreferences = async (e) => {
    e.preventDefault();
    const preferencesData = new FormData();
    preferencesData.append('email', formData.email);
    preferencesData.append('topics', formData.topics.join(','));
    if (formData.uploadedFile) {
      preferencesData.append('file', formData.uploadedFile);
    }

    // Mock preferences submission
    try {
      setTimeout(() => {
        console.log('Preferences saved:', preferencesData);
        alert('Preferences saved successfully!');
      }, 1000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences.');
    }
  };

  // Handle resending the confirmation code
  const resendCode = () => {
    alert('A new confirmation code has been sent to your email.');
  };

  return (
    <div className="sign-up-container">
      {/* Step 1: Sign Up Form */}
      {step === 1 && (
        <form onSubmit={handleSubmitSignUp}>
          <h2>Sign Up</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}

      {/* Step 2: Email Confirmation */}
      {step === 2 && (
        <form onSubmit={handleSubmitCode}>
          <h2>We just sent a confirmation code to your email</h2>
          <input
            type="text"
            name="confirmationCode"
            placeholder="Enter Confirmation Code"
            value={formData.confirmationCode}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit Code</button>
          <button type="button" onClick={resendCode}>
            Didn't work? Send another code.
          </button>
        </form>
      )}

      {/* Step 3: Preferences */}
      {step === 3 && (
        <form onSubmit={handleSubmitPreferences}>
          <h2>Complete your account</h2>
          <div className="preferences">
            <label>Choose your preference topics:</label>
            <div className="topics">
              {['Technology', 'Finance', 'Art', 'Health', 'Science', 'Crime', 'Economy', 'Beauty', 'Sport', 'Entertainment'].map((topic) => (
                <div key={topic}>
                  <input
                    type="checkbox"
                    id={topic}
                    value={topic}
                    checked={formData.topics.includes(topic)}
                    onChange={() => handleTopicSelection(topic)}
                  />
                  <label htmlFor={topic}>{topic}</label>
                </div>
              ))}
            </div>
          </div>

          <label>Upload your articles (optional):</label>
          <input type="file" onChange={handleFileUpload} />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default SignUp;
