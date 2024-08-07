
import React, { useEffect } from 'react';
import {  Link } from 'react-router-dom';
import './App.css';
import './Theme.css'; 
import { useTheme, ThemeProvider } from './ThemeContext'; 


function App() {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const generateBubbles = () => {
      const container = document.querySelector('.landing-page');

      container.querySelectorAll('.bubble').forEach(bubble => bubble.remove());

      for (let i = 0; i < 10; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');

        bubble.style.width = `${Math.random() * 60 + 40}px`;
        bubble.style.height = bubble.style.width;
        bubble.style.left = `${Math.random() * 100}vw`;
        bubble.style.bottom = `${Math.random() * 100}vh`;
        container.appendChild(bubble);
      }
    };

    generateBubbles();
    const interval = setInterval(generateBubbles, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page">
      <header className="header">
        <h1>Welcome to NoteMaster!</h1>
        <p>Your Ultimate Note-Taking Companion.</p>
      </header>
      <main className="main-content">
        <p>Transform your note-taking experience with NoteMaster. Create, organize, and manage your notes effortlessly with our intuitive app.</p>
        <div className="button-container">
          <Link to="/Register">
            <button className="btn">Register</button>
          </Link>
          <Link to="/Login">
            <button className="btn">Login</button>
          </Link>
          
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2024 NoteMaster Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}


export default () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
  
);


