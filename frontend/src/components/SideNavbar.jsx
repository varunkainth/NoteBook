import { FaSignOutAlt, FaMoon, FaSun, FaUserEdit, FaChevronRight, FaChevronLeft, FaBars } from 'react-icons/fa';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../state/auth/AuthSlice';
import { useState } from 'react';

const SideNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleButtonClick = (callback) => {
    callback();
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar (Desktop) */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-full lg:bg-gray-800 lg:text-white lg:p-4 lg:shadow-md bg-[url('/path/to/background-image.jpg')] bg-cover bg-center">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-white">NoteMaster</h2>
          </div>
          <div className="flex items-center mb-6">
            <img
              src={user?.profilePic || 'path/to/default-avatar.png'}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-400">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <div className="flex flex-col mt-auto">
            <button
              onClick={() => handleButtonClick(toggleTheme)}
              className="flex items-center mb-4 p-2 text-gray-200 hover:bg-gray-700 rounded-lg"
            >
              {theme === 'light' ? <FaMoon className="mr-2" /> : <FaSun className="mr-2" />}
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
            <button
              onClick={() => handleButtonClick(() => navigate('/update-profile'))}
              className="flex items-center mb-4 p-2 text-gray-200 hover:bg-gray-700 rounded-lg"
            >
              <FaUserEdit className="mr-2" />
              <span>Update Profile</span>
            </button>
            <button
              onClick={() => handleButtonClick(handleLogout)}
              className="flex items-center p-2 text-gray-200 hover:bg-gray-700 rounded-lg"
            >
              <FaSignOutAlt className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-gray-800 text-white p-4 flex justify-between items-center z-50">
        <h2 className="text-xl font-bold">NoteMaster</h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white"
        >
          <FaBars />
        </button>
      </div>

      {/* Overlay and Sidebar for Mobile */}
      {isSidebarOpen && (
        <>
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black opacity-50 z-40"
          />
          <div 
            className={`fixed top-0 left-0 h-full bg-gray-800 text-white p-4 overflow-auto transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} ${isSidebarExpanded ? 'w-full' : 'w-3/4'} z-50`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <img
                  src={user?.profilePic || 'path/to/default-avatar.png'}
                  alt="Profile"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{user?.name || 'User'}</h3>
                  <p className="text-sm text-gray-400">{user?.email || 'user@example.com'}</p>
                </div>
                <button
                  onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                  aria-label={isSidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
                  className="text-white"
                >
                  {isSidebarExpanded ? <FaChevronLeft /> : <FaChevronRight />}
                </button>
              </div>
              <div className="flex flex-col mt-auto">
                <button
                  onClick={() => handleButtonClick(toggleTheme)}
                  className="flex items-center mb-4 p-2 text-gray-200 hover:bg-gray-700 rounded-lg"
                >
                  {theme === 'light' ? <FaMoon className="mr-2" /> : <FaSun className="mr-2" />}
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
                <button
                  onClick={() => handleButtonClick(() => navigate('/update-profile'))}
                  className="flex items-center mb-4 p-2 text-gray-200 hover:bg-gray-700 rounded-lg"
                >
                  <FaUserEdit className="mr-2" />
                  <span>Update Profile</span>
                </button>
                <button
                  onClick={() => handleButtonClick(handleLogout)}
                  className="flex items-center p-2 text-gray-200 hover:bg-gray-700 rounded-lg"
                >
                  <FaSignOutAlt className="mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SideNavbar;
