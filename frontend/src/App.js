import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import WelcomePage from './Pages/WelcomePage';
import SignUp from './Pages/Signup';
import EmailConfirmation from './Pages/emailconfirmation'; // Adjust the path based on your folder structure
import Login from './Pages/login';  // Updated path to reflect new location of login.js

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomePage />} /> {/* This is the Welcome Page */}
          <Route path="/signup" element={<SignUp />} /> {/* This is the Sign-Up Page */}
          <Route path="/confirm-email" element={<EmailConfirmation />} /> {/* This is the Email Confirmation Page */}




          {/* Redirect the default path to /login */}
          {/* Define the login route */}
          <Route path="/login" element={<Login />} />
        
        </Routes>
      </div>
    </Router>

  )
}

export default App;

