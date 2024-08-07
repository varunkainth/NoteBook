
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './AuthSlice'; // Adjust the path as necessary

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ element: Element }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render the protected component
  return <>{Element}</>;
};

export default ProtectedRoute;
