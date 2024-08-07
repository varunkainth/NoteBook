
import { FaSignOutAlt, FaMoon, FaSun, FaUserEdit } from 'react-icons/fa';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector for Redux
import { logoutUser } from '../state/auth/AuthSlice'; // Import the logoutUser thunk
import './SideNavbar.css';

const SideNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Retrieve user data from Redux store

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); // Dispatch logout thunk and handle success
      console.log("Success ")
      navigate('/login'); // Redirect to login page or another page after logout
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout error (e.g., show a message to the user)
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>NoteMaster</h2>
      </div>
      <div className="sidebar-profile">
        <img
          src={user?.profilePic || 'path/to/default-avatar.png'} // Fallback to a default picture if not available
          alt="Profile"
          className="profile-picture"
        />
        <div className="profile-info">
          <h3 className="profile-name">{user?.name || 'User'}</h3>
          <p className="profile-email">{user?.email || 'user@example.com'}</p>
        </div>
      </div>
      <div className="sidebar-menu">
        <div className="sidebar-item" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </div>
        <div className="sidebar-item" onClick={() => navigate('/update-profile')}>
          <FaUserEdit />
          <span>Update Profile</span>
        </div>
        <div className="sidebar-item" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
