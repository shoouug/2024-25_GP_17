import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    affiliation: '',
    country: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", 
    "France", "Saudi Arabia", "United Arab Emirates", "India", "China"
    // Add more countries as needed
  ];

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

    try {
      setTimeout(() => {
        console.log('Sign-up successful, redirecting to email confirmation...');
        navigate('/confirm-email');
      }, 1000);
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('Sign-up failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmitSignUp}>
      <h2 className="sigi">Sign Up</h2>
      <p className="creation">Create your account</p>
      
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
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
        type="text"
        name="affiliation"
        placeholder="Affiliation"
        value={formData.affiliation}
        onChange={handleChange}
        required
      />
      
      <select
        className="country"
        name="country"
        value={formData.country}
        onChange={handleChange}
        required
      >
        <option value="" disabled>Select your country</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      
      <input
        type="password"
        name="password"
        placeholder="Password (min 8 characters)"
        value={formData.password}
        onChange={handleChange}
        minLength="8"
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
      
      <button className="signup-btn" type="submit">Submit</button>
    </form>
  );
};

export default SignUp;
