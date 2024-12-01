import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './Signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Logo from '../images/logo.png';

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
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [countryError, setCountryError] = useState('');
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    lower: false,
    upper: false,
    number: false,
    special: false,
  });

// Apply dark mode state on component mount
 useEffect(() => {
  const isDarkModeEnabled = localStorage.getItem('dark-mode') === 'true'; // Get saved state
  if (isDarkModeEnabled) {
    document.body.classList.add('dark-mode'); // Apply dark mode
  } else {
    document.body.classList.remove('dark-mode'); // Ensure dark mode is off
  }
}, []);

  const navigate = useNavigate();

  const countries = ["Saudi Arabia", "United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "United Arab Emirates", "India", "China"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      validatePassword(value);
    } else if (name === 'email') {
      validateEmail(value);
    } else if (name === 'country') {
      setCountryError('');
    }
  };

  const validatePassword = (password) => {
    setPasswordValidations({
      length: password.length >= 8,
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const validateEmail = (email) => {
    const isValid = email.includes('@') && email.includes('.');
    setIsEmailValid(isValid);
    setEmailError(isValid ? '' : 'Please enter a valid email address.');
  };

  // const handleSubmitSignUp = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setCountryError('');

  //   if (!isEmailValid) {
  //     setError('Please enter a valid email address.');
  //     return;
  //   }

  //   if (formData.password !== formData.confirmPassword) {
  //     setError("Passwords don't match!");
  //     return;
  //   }

  //   if (!Object.values(passwordValidations).every(Boolean)) {
  //     setError('Please meet all password requirements.');
  //     return;
  //   }

  //   if (!formData.country) {
  //     setCountryError('Please select your country.');
  //     return;
  //   }

  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
  //     const user = userCredential.user;

  //     await sendEmailVerification(user, {
  //       url: 'http://localhost:3000/verify-email',
  //       handleCodeInApp: true,
  //     });

  //     await setDoc(doc(db, 'Journalists', user.uid), {
  //       firstName: formData.firstName,
  //       lastName: formData.lastName,
  //       email: formData.email,
  //       affiliation: formData.affiliation,
  //       country: formData.country,
  //       selectedTopics: [],
  //       previousArticles: [],
  //     });

  //     alert('Verification email sent!');
      

  //   } catch (error) {
  //     if (error.code === 'auth/email-already-in-use') {
  //       setError('This email is already associated with an account. Please use another email.');
  //     } else {
  //       setError('An error occurred. Please try again.');
  //     }
  //   }
  // };

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setCountryError('');
  
    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
  
    if (!Object.values(passwordValidations).every(Boolean)) {
      setError('Please meet all password requirements.');
      return;
    }
  
    if (!formData.country) {
      setCountryError('Please select your country.');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      console.log('User creation successful:', user);
  
      await sendEmailVerification(user, {
        url: 'https://gennews-2e5b4.web.app/verify-email',
        handleCodeInApp: true,
      });
      console.log('Verification email sent.');
  
      try {
        await setDoc(doc(db, 'Journalists', user.uid), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          affiliation: formData.affiliation,
          country: formData.country,
          selectedTopics: [],
          previousArticles: [],
        });
        console.log('User data written to Firestore.');
      } catch (firestoreError) {
        console.error('Firestore error:', firestoreError);
        setError('Failed to save user data. Please try again.');
        return;
      }
  
      alert('Verification email sent!');
      setError(''); 
  
    } catch (error) {
      console.error('Error during signup:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already associated with an account. Please use another email.');
      } else if (error.code === 'auth/invalid-email') {
        setError('The email address is invalid. Please check and try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="signup-form">
      <div className="logo-container">
        <img src={Logo} alt="Website Logo" className="website-logo" />
      </div>
      <form onSubmit={handleSubmitSignUp}>
        <h2 className="signup-header">Sign Up</h2>
        <p className="signup-subtitle">Create your account</p>
        {error && <p className="error-message">{error}</p>}

        <input type="text" name="firstName" placeholder="First Name" className="signup-input" value={formData.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" className="signup-input" value={formData.lastName} onChange={handleChange} required />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className={`signup-input ${!isEmailValid ? 'invalid-input' : ''}`}
          value={formData.email}
          onChange={handleChange}
          required
        />
        {emailError && <p className="error-message">{emailError}</p>}

        <input type="text" name="affiliation" placeholder="Affiliation" className="signup-input" value={formData.affiliation} onChange={handleChange} required />

        <select className="country-input" name="country" value={formData.country} onChange={handleChange} required>
          <option value="" disabled>Select your country</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {countryError && <p className="error-message">{countryError}</p>}

        <div className="password-input-container">
          <input
            type={passwordVisible ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            className="signup-input password-field"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setShowPasswordRules(true)}
            onBlur={() => setShowPasswordRules(false)}
            required
          />
          <FontAwesomeIcon
            icon={passwordVisible ? faEyeSlash : faEye}
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="toggle-password"
          />
        </div>

        {showPasswordRules && (
          <div className="password-requirements">
            <p className={passwordValidations.length ? 'valid' : 'invalid'}>✔ At least 8 characters</p>
            <p className={passwordValidations.lower ? 'valid' : 'invalid'}>✔ At least one lowercase letter</p>
            <p className={passwordValidations.upper ? 'valid' : 'invalid'}>✔ At least one uppercase letter</p>
            <p className={passwordValidations.number ? 'valid' : 'invalid'}>✔ At least one number</p>
            <p className={passwordValidations.special ? 'valid' : 'invalid'}>✔ At least one special character</p>
          </div>
        )}

        <div className="password-input-container">
          <input
            type={confirmPasswordVisible ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            className="signup-input password-field"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <FontAwesomeIcon
            icon={confirmPasswordVisible ? faEyeSlash : faEye}
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            className="toggle-password"
          />
        </div>

        <button className="signup-btn" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SignUp;
