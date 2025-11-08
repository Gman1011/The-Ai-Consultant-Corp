const axios = require('axios');

/**
 * Validate that coordinates are within the United States
 */
const isWithinUS = (latitude, longitude) => {
  // Continental US approximate boundaries
  const US_BOUNDS = {
    minLat: 24.5,
    maxLat: 49.4,
    minLng: -125,
    maxLng: -66,
  };

  // Alaska boundaries
  const ALASKA_BOUNDS = {
    minLat: 51.2,
    maxLat: 71.5,
    minLng: -179,
    maxLng: -129,
  };

  // Hawaii boundaries
  const HAWAII_BOUNDS = {
    minLat: 18.9,
    maxLat: 28.4,
    minLng: -178,
    maxLng: -154,
  };

  const inContinental =
    latitude >= US_BOUNDS.minLat &&
    latitude <= US_BOUNDS.maxLat &&
    longitude >= US_BOUNDS.minLng &&
    longitude <= US_BOUNDS.maxLng;

  const inAlaska =
    latitude >= ALASKA_BOUNDS.minLat &&
    latitude <= ALASKA_BOUNDS.maxLat &&
    longitude >= ALASKA_BOUNDS.minLng &&
    longitude <= ALASKA_BOUNDS.maxLng;

  const inHawaii =
    latitude >= HAWAII_BOUNDS.minLat &&
    latitude <= HAWAII_BOUNDS.maxLat &&
    longitude >= HAWAII_BOUNDS.minLng &&
    longitude <= HAWAII_BOUNDS.maxLng;

  return inContinental || inAlaska || inHawaii;
};

/**
 * Reverse geocode coordinates to address using Google Maps API
 */
const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          latlng: `${latitude},${longitude}`,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.status !== 'OK' || !response.data.results.length) {
      throw new Error('Unable to geocode coordinates');
    }

    const result = response.data.results[0];
    const addressComponents = result.address_components;

    // Extract address parts
    let street = '';
    let city = '';
    let state = '';
    let zipCode = '';
    let country = '';

    addressComponents.forEach((component) => {
      if (component.types.includes('street_number')) {
        street = component.long_name + ' ';
      }
      if (component.types.includes('route')) {
        street += component.long_name;
      }
      if (component.types.includes('locality')) {
        city = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        state = component.short_name;
      }
      if (component.types.includes('postal_code')) {
        zipCode = component.long_name;
      }
      if (component.types.includes('country')) {
        country = component.short_name;
      }
    });

    // Verify it's in the US
    if (country !== 'US') {
      throw new Error('Location must be within the United States');
    }

    return {
      street: street.trim(),
      city,
      state,
      zipCode,
      country,
      formattedAddress: result.formatted_address,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.error_message ||
        error.message ||
        'Geocoding failed'
    );
  }
};

/**
 * Geocode an address to coordinates using Google Maps API
 */
const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address: address,
          components: 'country:US',
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.status !== 'OK' || !response.data.results.length) {
      throw new Error('Unable to geocode address');
    }

    const result = response.data.results[0];
    const location = result.geometry.location;

    // Verify coordinates are within US
    if (!isWithinUS(location.lat, location.lng)) {
      throw new Error('Location must be within the United States');
    }

    return {
      latitude: location.lat,
      longitude: location.lng,
      formattedAddress: result.formatted_address,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.error_message ||
        error.message ||
        'Geocoding failed'
    );
  }
};

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in miles
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3958.8; // Radius of Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

module.exports = {
  isWithinUS,
  reverseGeocode,
  geocodeAddress,
  calculateDistance,
};
