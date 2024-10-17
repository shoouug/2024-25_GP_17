import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For page navigation
import './Signup.css'; // Assuming you have some CSS for styling

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();  // Use navigate hook for redirection

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Simulate API call for sign-up
  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    // Simulate successful sign-up and redirect to email confirmation page
    try {
      setTimeout(() => {
        console.log('Sign-up successful, redirecting to email confirmation...');
        navigate('/confirm-email'); // Redirect to email confirmation page
      }, 1000); // Simulating a 1-second delay
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('Sign-up failed. Please try again.');
    }
  };

  return (
    <div className="sign-up-container">
      <form onSubmit={handleSubmitSignUp}>
        <h2>Sign Up</h2>
        <h4> Create your account</h4>
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
    </div>
  );
};

export default SignUp;
