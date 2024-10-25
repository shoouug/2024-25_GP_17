import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase Auth function
import { auth } from '../firebase'; // Import Firebase auth instance
import './login.css';
import Logo from '../images/Logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    try {
      // Use Firebase to sign in the user with email and password
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/homepage'); // Navigate to the home page after successful login
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('Email does not exist.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Invalid password.');
      } else {
        setError('Failed to log in. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <img src={Logo} alt="Logo" className="logoIn " />
      <p className="welcoming">Back to your newsroom!</p>

      <form onSubmit={handleLogin}>
        <div className="input-container">
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <i className="fas fa-envelope"></i>
        </div>
        <div className="input-container">
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i className="fas fa-lock"></i>
        </div>
        {error && <p className="error-message">{error}</p>}

        <div className="forgot-password">
          <p className="black_p">Forgot your password? <a href="/reset-password1">Reset Password</a></p>
        </div>

        <button type="submit" className="login-button">Log In</button>
      </form>
    </div>
  );
};

export default Login;