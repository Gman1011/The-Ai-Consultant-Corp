import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { locationAPI } from '../services/api';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    locationName: '',
    startTime: '',
    endTime: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await locationAPI.getMyLocations();
      setLocations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Get current location
      const coords = await getCurrentLocation();

      // Create location
      await locationAPI.create({
        ...formData,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      setSuccess('Location added successfully!');
      setShowForm(false);
      setFormData({
        locationName: '',
        startTime: '',
        endTime: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
      });
      fetchLocations();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          'Failed to add location. Please enable location services.'
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await locationAPI.delete(id);
        setSuccess('Location deleted successfully!');
        fetchLocations();
      } catch (error) {
        setError('Failed to delete location');
      }
    }
  };

  const toggleActiveStatus = async (location) => {
    try {
      await locationAPI.update(location._id, {
        isActive: !location.isActive,
      });
      setSuccess('Location status updated!');
      fetchLocations();
    } catch (error) {
      setError('Failed to update location');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.businessName}!</h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            Manage your daily locations and reach more customers
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Location'}
        </button>
      </div>

      {error && (
        <div
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

      {success && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#d1fae5',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
          }}
        >
          {success}
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Add New Location</h3>
          <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
            We'll use your current GPS location. Please ensure location
            services are enabled.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Location Name *</label>
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) =>
                  setFormData({ ...formData, locationName: e.target.value })
                }
                required
                placeholder="e.g., Downtown Food Court, City Park"
              />
            </div>

            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Start Time *</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>End Time *</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows="2"
                placeholder="Any special notes for customers..."
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Add Location
            </button>
          </form>
        </div>
      )}

      <h2>Your Locations</h2>
      {locations.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            No locations added yet. Click "Add Location" to get started!
          </p>
        </div>
      ) : (
        <div className="grid">
          {locations.map((location) => (
            <div key={location._id} className="card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '1rem',
                }}
              >
                <h3>{location.locationName}</h3>
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    backgroundColor: location.isActive ? '#d1fae5' : '#fee2e2',
                    color: location.isActive ? '#059669' : '#dc2626',
                  }}
                >
                  {location.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p>
                <strong>Date:</strong>{' '}
                {new Date(location.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {location.startTime} - {location.endTime}
              </p>
              <p>
                <strong>Address:</strong> {location.address.city},{' '}
                {location.address.state}
              </p>
              {location.notes && (
                <p>
                  <strong>Notes:</strong> {location.notes}
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '1rem',
                }}
              >
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                  onClick={() => toggleActiveStatus(location)}
                >
                  {location.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  className="btn btn-danger"
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                  onClick={() => handleDelete(location._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
