import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Registration from './components/Registration';
import { ThemeProvider } from './ThemeContext';
import SideNavbar from './components/SideNavbar';
import UpdateProfile from './components/UpdateProfile';
import StickyNotes from './components/StickyNotes';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider>
    
    <Router>
    <SideNavbar/>
    
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Register" element={<Registration />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/sticky-notes" element={<StickyNotes />} />
      </Routes>
    </Router>
  </ThemeProvider>
);
