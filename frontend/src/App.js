import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import WelcomePage from './Pages/WelcomePage';
import SignUp from './Pages/Signup';
import EmailConfirmation from './Pages/emailconfirmation'; 
import Login from './Pages/login'; 
import ResetPassword1 from './Pages/reset-password1';
import ResetPassword2 from './Pages/reset-password2';
import ResetPassword3 from './Pages/reset-password3';
import AboutUs from './Pages/AboutUs'; 
import Profile from './Pages/Profile';
import PreferenceTopics from './Pages/PreferenceTopics'; // Import PreferenceTopics component
import HomePage from './Pages/HomePage'; // Import HomePage component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} /> {/* This is the Welcome Page */}
          <Route path="/signup" element={<SignUp />} /> {/* Sign-Up Page */}
          <Route path="/confirm-email" element={<EmailConfirmation />} /> {/* Email Confirmation Page */}
          <Route path="/login" element={<Login />} /> {/* Login Page */}
          <Route path="/reset-password1" element={<ResetPassword1 />} /> {/* Reset Password Step 1 */}
          <Route path="/reset-password2" element={<ResetPassword2 />} /> {/* Reset Password Step 2 */}
          <Route path="/reset-password3" element={<ResetPassword3 />} /> {/* Reset Password Step 3 */}
          <Route path="/profile" element={<Profile />} /> {/* User Profile Page */}
          <Route path="/about-us" element={<AboutUs />} /> {/* About Us Page */}
          
          {/* Route for Preferences Topics Page */}
          <Route path="/preference-topics" element={<PreferenceTopics />} /> 
          
          {/* Route for Home Page after successful sign up */}
          <Route path="/homepage" element={<HomePage />} /> {/* Home Page after preferences */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;