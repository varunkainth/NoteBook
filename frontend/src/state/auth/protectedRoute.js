import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './AuthSlice.js'; // Adjust the path as necessary

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Redirect to="/dashboard" /> // Redirect to a protected page or home if authenticated
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default ProtectedRoute;
