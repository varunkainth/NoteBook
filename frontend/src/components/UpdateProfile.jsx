import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa'; // Importing the user icon for placeholder
import './UpdateProfile.css'; 

const UpdateProfile = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name,
      phoneNumber,
      profilePhoto,
      password,
      username,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  return (
    <div className="main-content">
    <div className="update-profile">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="profilePhoto">Profile Photo:</label>
          <input
            type="file"
            id="profilePhoto"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="profile-photo-container">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="profile-photo-preview" />
            ) : (
              <div className="profile-photo-placeholder">
                <FaUser />
              </div>
            )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
    </div>
  );
};

export default UpdateProfile;

