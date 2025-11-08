import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VendorRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    cuisine: '',
    phoneNumber: '',
    description: '',
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register({
      email: formData.email,
      password: formData.password,
      businessName: formData.businessName,
      cuisine: formData.cuisine,
      phoneNumber: formData.phoneNumber,
      description: formData.description,
    });

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
          Register Your Food Truck
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
            <label>Business Name *</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
              placeholder="Joe's Tacos"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
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
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="form-group">
            <label>Cuisine Type *</label>
            <input
              type="text"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              required
              placeholder="Mexican, BBQ, Asian Fusion, etc."
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Tell customers about your food truck..."
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Already have an account?{' '}
            <Link
              to="/vendor/login"
              style={{ color: '#2563eb', textDecoration: 'none' }}
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VendorRegister;
