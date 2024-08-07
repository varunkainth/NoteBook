/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../state/auth/AuthSlice'; // Adjust the path as necessary

const Login = () => {
  const [email, setEmailname] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Dispatch loginUser thunk with credentials
    try {
      await dispatch(loginUser({ email, password }));
      navigate("/")
     
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-[#000] min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmailname(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 text-[#000] bg-[#fff] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border text-[#000] bg-[#fff] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
