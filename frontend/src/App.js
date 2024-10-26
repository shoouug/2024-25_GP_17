import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AboutUs from './Pages/AboutUs';
import HomePage from './Pages/HomePage'; // Import HomePage component
import VerifyEmail from './Pages/VerifyEmail';
import PreferenceTopics from './Pages/PreferenceTopics'; // Import PreferenceTopics component
import Profile from './Pages/Profile';
import SignUp from './Pages/Signup';
import WelcomePage from './Pages/WelcomePage';
import Login from './Pages/login';
import ResetPassword1 from './Pages/reset-password1';
import ResetPassword3 from './Pages/reset-password3';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} /> {/* This is the Welcome Page */}
          <Route path="/signup" element={<SignUp />} /> {/* Sign-Up Page */}
         
          <Route path="/login" element={<Login />} /> {/* Login Page */}
          <Route path="/reset-password1" element={<ResetPassword1 />} /> {/* Reset Password Step 1 */}
          <Route path="/reset-password3" element={<ResetPassword3 />} /> {/* Reset Password Step 3 */}
          <Route path="/profile" element={<Profile />} /> {/* User Profile Page */}
          <Route path="/about-us" element={<AboutUs />} /> {/* About Us Page */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/preference-topics" element={<PreferenceTopics />} />

          
          {/* Route for Home Page after successful sign up */}
          <Route path="/homepage" element={<HomePage />} /> {/* Home Page after preferences */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;