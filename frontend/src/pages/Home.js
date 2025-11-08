import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { locationAPI } from '../services/api';

const containerStyle = {
  width: '100%',
  height: '600px',
};

// Center of USA (approximate)
const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795,
};

const Home = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [searchRadius, setSearchRadius] = useState(25);

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          setMapCenter(coords);
          fetchNearbyLocations(coords.lat, coords.lng);
        },
        (error) => {
          console.log('Error getting location:', error);
          fetchAllLocations();
        }
      );
    } else {
      fetchAllLocations();
    }
  }, []);

  const fetchAllLocations = async () => {
    try {
      const response = await locationAPI.getActive();
      setLocations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLoading(false);
    }
  };

  const fetchNearbyLocations = async (lat, lng) => {
    try {
      const response = await locationAPI.getNearby(lat, lng, searchRadius);
      setLocations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching nearby locations:', error);
      fetchAllLocations();
    }
  };

  const handleSearchNearby = () => {
    if (userLocation) {
      setLoading(true);
      fetchNearbyLocations(userLocation.lat, userLocation.lng);
    }
  };

  const onMapClick = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <div className="container">
          <h1>Find Food Trucks Near You</h1>
          <p>
            Discover amazing food trucks in your area. Fresh food, delivered
            daily to locations across the United States.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Search Controls */}
        <div
          className="card"
          style={{
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>
              {locations.length} Food Trucks Active Today
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {userLocation
                ? 'Showing food trucks near your location'
                : 'Showing all active food trucks'}
            </p>
          </div>

          {userLocation && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div>
                <label
                  style={{
                    fontSize: '0.875rem',
                    marginRight: '0.5rem',
                    color: '#374151',
                  }}
                >
                  Search Radius:
                </label>
                <select
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                  }}
                >
                  <option value="5">5 miles</option>
                  <option value="10">10 miles</option>
                  <option value="25">25 miles</option>
                  <option value="50">50 miles</option>
                  <option value="100">100 miles</option>
                </select>
              </div>
              <button className="btn btn-primary" onClick={handleSearchNearby}>
                Search
              </button>
            </div>
          )}
        </div>

        {/* Map */}
        {loading ? (
          <div className="loading">Loading food trucks...</div>
        ) : (
          <div className="map-container">
            <LoadScript
              googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
            >
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={userLocation ? 12 : 4}
                onClick={onMapClick}
              >
                {/* User Location Marker */}
                {userLocation && (
                  <Marker
                    position={userLocation}
                    icon={{
                      url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    }}
                    title="Your Location"
                  />
                )}

                {/* Food Truck Markers */}
                {locations.map((location) => (
                  <Marker
                    key={location._id}
                    position={{
                      lat: location.coordinates.latitude,
                      lng: location.coordinates.longitude,
                    }}
                    onClick={() => setSelectedLocation(location)}
                    icon={{
                      url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    }}
                  />
                ))}

                {/* Info Window */}
                {selectedLocation && (
                  <InfoWindow
                    position={{
                      lat: selectedLocation.coordinates.latitude,
                      lng: selectedLocation.coordinates.longitude,
                    }}
                    onCloseClick={() => setSelectedLocation(null)}
                  >
                    <div style={{ maxWidth: '250px', padding: '0.5rem' }}>
                      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>
                        {selectedLocation.vendor?.businessName}
                      </h3>
                      <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        <strong>Cuisine:</strong>{' '}
                        {selectedLocation.vendor?.cuisine}
                      </p>
                      <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        <strong>Location:</strong> {selectedLocation.locationName}
                      </p>
                      <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        <strong>Hours:</strong> {selectedLocation.startTime} -{' '}
                        {selectedLocation.endTime}
                      </p>
                      {selectedLocation.address && (
                        <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          <strong>Address:</strong>{' '}
                          {selectedLocation.address.city},{' '}
                          {selectedLocation.address.state}
                        </p>
                      )}
                      {selectedLocation.distance && (
                        <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          <strong>Distance:</strong> {selectedLocation.distance}{' '}
                          miles
                        </p>
                      )}
                      {selectedLocation.notes && (
                        <p
                          style={{
                            fontSize: '0.875rem',
                            marginTop: '0.5rem',
                            fontStyle: 'italic',
                          }}
                        >
                          {selectedLocation.notes}
                        </p>
                      )}
                      {selectedLocation.vendor?.phoneNumber && (
                        <p
                          style={{
                            fontSize: '0.875rem',
                            marginTop: '0.5rem',
                          }}
                        >
                          <strong>Phone:</strong>{' '}
                          {selectedLocation.vendor.phoneNumber}
                        </p>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        )}

        {/* Food Truck List */}
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Active Food Trucks</h2>
          {locations.length === 0 ? (
            <div className="card">
              <p style={{ textAlign: 'center', color: '#6b7280' }}>
                No food trucks are active in your area today. Check back later!
              </p>
            </div>
          ) : (
            <div className="grid">
              {locations.map((location) => (
                <div key={location._id} className="card">
                  <h3>{location.vendor?.businessName}</h3>
                  <p>
                    <strong>Cuisine:</strong> {location.vendor?.cuisine}
                  </p>
                  <p>
                    <strong>Location:</strong> {location.locationName}
                  </p>
                  <p>
                    <strong>Hours:</strong> {location.startTime} -{' '}
                    {location.endTime}
                  </p>
                  {location.address && (
                    <p>
                      <strong>Address:</strong> {location.address.city},{' '}
                      {location.address.state}
                    </p>
                  )}
                  {location.distance && (
                    <p>
                      <strong>Distance:</strong> {location.distance} miles away
                    </p>
                  )}
                  {location.vendor?.description && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                      {location.vendor.description}
                    </p>
                  )}
                  {location.vendor?.phoneNumber && (
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>Phone:</strong> {location.vendor.phoneNumber}
                    </p>
                  )}
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: '1rem', fontSize: '0.875rem' }}
                    onClick={() => {
                      setSelectedLocation(location);
                      setMapCenter({
                        lat: location.coordinates.latitude,
                        lng: location.coordinates.longitude,
                      });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    View on Map
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
