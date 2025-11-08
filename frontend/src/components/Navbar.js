import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/">
          <h1>Food Truck Finder</h1>
        </Link>
        <div>
          {isAuthenticated ? (
            <>
              <span style={{ marginRight: '1rem' }}>
                Welcome, {user?.businessName}
              </span>
              <Link to="/vendor/dashboard">Dashboard</Link>
              <button onClick={logout} className="logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/">Find Food Trucks</Link>
              <Link to="/vendor/login">Vendor Login</Link>
              <Link to="/vendor/register">Register Your Truck</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
