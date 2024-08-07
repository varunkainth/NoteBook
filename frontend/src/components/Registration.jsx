/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import  { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, registerUser } from '../state/auth/AuthSlice';
import './Registration.css';
import {  Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    dob: '',
    profilePicture: null,
    gender: '',
  });

  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const { name, email, password } = formData;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    // Name validation
    if (name.trim().length === 0) {
      errors.name = 'Name is required.';
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/;
    if (!passwordRegex.test(password)) {
      errors.password = 'Password must be at least 6 characters long, with at least one uppercase letter, one number, and one special character.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    if (type === 'file') {
      const file = files[0];
      setFormData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
      setProfilePicturePreview(URL.createObjectURL(file));
    } else if (type === 'radio') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    setSubmitSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const userData = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      dob: formData.dob,
      gender: formData.gender,
      // Note: profilePicture is not included since it's usually not sent with JSON
    };

    try {
      const data = await dispatch(registerUser(userData)).unwrap();
      setSubmitSuccess(`Registration successful for ${data.user.name}!`);
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        dob: '',
        profilePicture: null,
        gender: '',
      });
      setProfilePicturePreview(null);
      dispatch(clearAuthError());
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className='container'>
      <div className="registration-form p-4 max-w-lg text-[#000] mx-auto bg-white shadow-md rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
            {validationErrors.name && <p className="text-red-500 mt-1">{validationErrors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
            {validationErrors.email && <p className="text-red-500 mt-1">{validationErrors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
            {validationErrors.password && <p className="text-red-500 mt-1">{validationErrors.password}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Gender:</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Male</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Female</span>
              </label>
            </div>
          </div>
          {/* <div className="mb-4">
            <label className="block text-gray-700">Profile Picture:</label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleChange}
              className="mt-1"
            />
            {profilePicturePreview && (
              <img
                src={profilePicturePreview}
                alt="Profile Preview"
                className="mt-2 w-24 h-24 object-cover rounded-full"
              />
            )}
          </div> */}
          <div className="mb-4">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
          {submitSuccess && <p className="text-green-500">{submitSuccess}</p>}
          {error && <p className="text-red-500">{error}</p>}
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700">
              Login here
            </Link>
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default Register;
