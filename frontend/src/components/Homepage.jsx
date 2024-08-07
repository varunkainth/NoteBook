// src/components/HomePage.js

import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearAuthError } from '../state/auth/AuthSlice'; // Adjust the import path as necessary
import SideNavbar from './SideNavbar';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get the user and token from the Redux store
  const { user, token, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user or token is missing
    if (!user || !token) {
      navigate('/login'); // Redirect to login if no user or token is found
    }

    // Clear any authentication errors when component mounts
    dispatch(clearAuthError());
  }, [user, token, navigate, dispatch]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-100'>
        <div className='text-xl text-gray-700'>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-100'>
        <div className='text-xl text-red-600'>{error}</div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <SideNavbar/>
      <div className='w-full max-w-md bg-white shadow-lg rounded-lg p-6'>
        <h1 className='text-3xl font-semibold text-gray-800 mb-4 text-center'>
          Welcome, {user?.name}!
        </h1>
        <p className='text-lg text-gray-700 mb-2 text-center'>
          <span className='font-bold'>Email:</span> {user?.email}
        </p>
        <p className='text-lg text-gray-700 mb-2 text-center'>
          <span className='font-bold'>Phone Number:</span> {user?.phoneNumber}
        </p>
        <p className='text-lg text-gray-700 mb-4 text-center'>
          <span className='font-bold'>Gender:</span> {user?.gender}
        </p>
        {/* Add more user details as needed */}
        <div className='text-center'>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              navigate('/login'); // Redirect to login on logout
            }}
            className='w-full py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
