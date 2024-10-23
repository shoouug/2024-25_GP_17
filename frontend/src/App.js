import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import { db, auth } from './firebase'; // Import Firebase Auth

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} /> {/* This is the Welcome Page */}
          <Route path="/signup" element={<SignUp />} /> {/* This is the Sign-Up Page */}
          <Route path="/confirm-email" element={<EmailConfirmation />} /> {/* This is the Email Confirmation Page */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password1" element={<ResetPassword1 />} /> {/* This is the Reset Password Page */}
          <Route path="/reset-password2" element={<ResetPassword2 />} />
          <Route path="/reset-password3" element={<ResetPassword3 />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/AboutUs" element={<AboutUs />} />

          {/* Add routes for PreferenceTopics and HomePage */}
          <Route path="/preference-topics" element={<PreferenceTopics />} /> {/* Page where user selects topics */}
          <Route path="/homepage" element={<HomePage />} /> {/* Home Page with sidebar and welcome message */}
        </Routes>
      </div>
    </Router>
  )
}

export default App;