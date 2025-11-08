import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VendorLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      navigate('/vendor/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Vendor Login
        </h2>

        {error && (
          <div
            className="error"
            style={{
              padding: '1rem',
              backgroundColor: '#fee2e2',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Don't have an account?{' '}
            <Link
              to="/vendor/register"
              style={{ color: '#2563eb', textDecoration: 'none' }}
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VendorLogin;
