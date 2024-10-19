import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import Logo from '../images/Logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Sample static login data
    const userData = {
      email: 'user@example.com',
      password: 'password123',
    };

    // Validate email and password
    if (email === userData.email && password === userData.password) {
      setError('');
      navigate('/homepage'); // Navigate to the home page after successful login
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <img src={Logo} alt="Logo" className="logo" />
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