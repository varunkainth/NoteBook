// src/index.jsx or src/App.jsx (adjust according to your project structure)
import "./index.css"
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/Store"; // Adjust the path as needed
import Registration from "./components/Registration";
import { ThemeProvider } from "./ThemeContext";
import UpdateProfile from "./components/UpdateProfile";
import HomePage from "./components/Homepage";
import Login from "./components/Login";
import ProtectedRoute from "./state/auth/protectedRoute"; // Adjust the path as needed

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <ThemeProvider>
      <Router>
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route
            path="/update-profile"
            element={<ProtectedRoute element={<UpdateProfile />} />} // Protect UpdateProfile route
          />
          <Route
            path="/"
            element={<ProtectedRoute element={<HomePage />} />} // Protect HomePage route
          />
        </Routes>
      </Router>
    </ThemeProvider>
  </Provider>
);
