import axios from 'axios'; // For sending HTTP requests
import React, { useState } from 'react';
import './SignUp.css'; // Assuming you have some CSS for styling

const SignUp = () => {
  const [step, setStep] = useState(1); // Track the step: Sign up, confirmation, preferences
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    topics: [],
    uploadedFile: null,
  });
  const [codeSent, setCodeSent] = useState(false);

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

  // Submit sign-up form
  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    // Send user details to the backend (mock API)
    try {
      await axios.post('/api/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setStep(2); // Move to email confirmation step
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
  };

  // Handle email confirmation
  const handleSubmitCode = async (e) => {
    e.preventDefault();
    // Mock: send confirmation code request (replace with actual logic)
    try {
      await axios.post('/api/confirm-email', { email: formData.email });
      setCodeSent(true);
      setStep(3); // Move to preferences step
    } catch (error) {
      console.error('Error sending confirmation code:', error);
    }
  };

  // Handle preferences submission
  const handleSubmitPreferences = async (e) => {
    e.preventDefault();

    const preferencesData = new FormData();
    preferencesData.append('email', formData.email);
    preferencesData.append('topics', formData.topics.join(','));
    if (formData.uploadedFile) {
      preferencesData.append('file', formData.uploadedFile);
    }

    try {
      await axios.post('/api/preferences', preferencesData);
      alert('Preferences saved!');
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <div className="sign-up-container">
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

      {step === 2 && (
        <form onSubmit={handleSubmitCode}>
          <h2>We just sent a confirmation code over your email</h2>
          <button type="submit">Send Code</button>
          {codeSent && <p>Didn't work? Send another code.</p>}
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmitPreferences}>
          <h2>Complete your account</h2>
          <div className="preferences">
            <label>Choose your preference topics:</label>
            <div className="topics">
              {['Technology', 'Finance', 'Art', 'Health', 'Science'].map((topic) => (
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
