import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
      event.preventDefault();
      // Handle form submission
      console.log('Username:', username);
      console.log('Password:', password);
  };

  return (
      <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
              <label htmlFor="username">Username</label>
              <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />
              
              <label htmlFor="password">Password</label>
              <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
              
              <button type="submit">Submit</button>
          </form>
      </div>
  );
};


export default Login
