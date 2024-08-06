import React, { useState } from 'react';
import axios from 'axios';
import './Registration.css';


const Register = () => {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [DOB, setDOB] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState('');

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validateUserName = (userName) => {
    const re = /^[a-zA-Z0-9_]{3,16}$/;
    return re.test(String(userName));
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(String(password));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!validateUserName(userName)) {
      alert('Username should be 3-16 characters long and can contain letters, numbers, and underscores.');
      return;
    }
    if (!validatePassword(password)) {
      alert('Password should be at least 8 characters long and contain at least one letter and one number.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('userName', userName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', password);
    formData.append('DOB', DOB);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const response = await axios.post('YOUR_API_ENDPOINT', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      setSubmitSuccess(`Registration successful for ${name}!`);
      setName('');
      setUserName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setDOB('');
      setProfilePicture(null);
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Failed to register. Please try again later.');
    }
  };

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
    setSubmitSuccess('');
  };

  const handleFileChange = (event) => {
    setProfilePicture(event.target.files[0]);
    setSubmitSuccess('');
  };

  const handleSparkEffect = (event) => {
    const button = event.currentTarget;
    for (let i = 0; i < 10; i++) {
      const spark = document.createElement('div');
      spark.classList.add('spark');
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      spark.style.setProperty('--spark-x', `${x * 30}px`);
      spark.style.setProperty('--spark-y', `${y * 30}px`);
      button.appendChild(spark);
      spark.addEventListener('animationend', () => spark.remove());
    }
  };

  return (
    <>
      
      <div className='container'>
        <div className="registration-form">
          <form onSubmit={handleSubmit}>
            <span>
              Name:
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleChange(setName)}
                required
                placeholder="Enter your name"
              />
            </span>
            <span>
              Username:
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={handleChange(setUserName)}
                required
                placeholder="Enter your username"
              />
            </span>
            <span>
              Email:
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleChange(setEmail)}
                required
                placeholder="Enter your email"
              />
            </span>
            <span>
              Phone:
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={handleChange(setPhone)}
                required
                placeholder="Enter your phone number"
              />
            </span>
            <span>
              Password:
              <input
                type="password"
                id="password"
                value={password}
                onChange={handleChange(setPassword)}
                required
                placeholder="Enter your password"
              />
            </span>
            <span>
              Date of Birth:
              <input
                type="date"
                id="DOB"
                value={DOB}
                onChange={handleChange(setDOB)}
              />
            </span>
            <span>
              Profile Picture:
              <input
                type="file"
                id="profilePicture"
                onChange={handleFileChange}
              />
            </span>
            <div className="spark-container">
              <button type="submit" onClick={handleSparkEffect}>Register</button>
            </div>
            {submitSuccess && <p>{submitSuccess}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;


