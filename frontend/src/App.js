import React from 'react';
import './App.css';
import WelcomePage from './Pages/WelcomePage';
import SignUp from './Pages/Signup'; // Adjust the path based on your folder structure
import EmailConfirmation from './Pages/emailconfirmation';





function App() {
  return (
    <div className="App">
      <WelcomePage />
      <SignUp/>
      <EmailConfirmation/>
    </div>
  );
}

export default App;