import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import WelcomePage from './Pages/WelcomePage';
import SignUp from './Pages/Signup';
import EmailConfirmation from './Pages/emailconfirmation'; // Adjust the path based on your folder structure
import Login from './Pages/login';  // Updated path to reflect new location of login.js
import ResetPassword1 from './Pages/reset-password1';
import ResetPassword2 from './Pages/reset-password2';
import ResetPassword3 from './Pages/reset-password3';
import AboutUs from './Pages/about'; 
import Profile from './Pages/Profile';

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
         <Route path="/about" element={<AboutUs/>} />

        </Routes>
      </div>
    </Router>

  )
}

export default App;