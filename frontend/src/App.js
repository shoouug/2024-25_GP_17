import React from 'react';
import './App.css';
import WelcomePage from './Pages/WelcomePage';
import SignUp from './Pages/Signup'; // Adjust the path based on your folder structure





function App() {
  return (
    <div className="App">
      <WelcomePage />
      <SignUp/>
    </div>
  );
}

export default App;