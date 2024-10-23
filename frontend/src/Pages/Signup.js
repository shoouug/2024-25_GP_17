import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
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

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", 
    "France", "Saudi Arabia", "United Arab Emirates", "India", "China"
  ];

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle sign-up submission
  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      // Create user with email and password using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Store user data in Firestore without topics and articles initially
      await setDoc(doc(db, 'Journalists', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        affiliation: formData.affiliation,
        country: formData.country,
        selectedTopics: [], // Will be updated later
        previousArticles: [] // Will be updated later
      });

      console.log('Sign-up successful, redirecting to email confirmation...');
      navigate('/confirm-email'); // Redirect to the Email Confirmation page
    } catch (error) {
      console.error('Error during sign-up:', error);
      setError('Sign-up failed. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmitSignUp}>
        <h2 className="sigi">Sign Up</h2>
        <p className="creation">Create your account</p>
        {error && <p style={{ color: 'red' }}>{error}</p>} 

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
    </div>
  );
};

export default SignUp;