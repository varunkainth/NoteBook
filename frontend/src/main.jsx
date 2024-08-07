import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/Store'; // Adjust the path as needed
import App from './App';
import Registration from './components/Registration';
import { ThemeProvider } from './ThemeContext';
import SideNavbar from './components/SideNavbar';
import UpdateProfile from './components/UpdateProfile';
import HomePage from './pages/Homepage';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <ThemeProvider>
      <Router>
        <SideNavbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </Provider>
);
