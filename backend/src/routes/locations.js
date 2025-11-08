const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Location = require('../models/Location');
const Vendor = require('../models/Vendor');
const { protect } = require('../middleware/auth');
const {
  isWithinUS,
  reverseGeocode,
  geocodeAddress,
  calculateDistance,
} = require('../utils/geocoding');

// @route   GET /api/locations/active
// @desc    Get all active food truck locations for today
// @access  Public
router.get('/active', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const locations = await Location.find({
      isActive: true,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    }).populate('vendor', '-password');

    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/locations/nearby
// @desc    Find food trucks near coordinates
// @access  Public
router.get('/nearby', async (req, res) => {
  const { latitude, longitude, radius = 10 } = req.query;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: 'Latitude and longitude are required' });
  }

  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusMiles = parseFloat(radius);

    // Get today's active locations
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const allLocations = await Location.find({
      isActive: true,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    }).populate('vendor', '-password');

    // Filter by distance
    const nearbyLocations = allLocations
      .map((location) => {
        const distance = calculateDistance(
          lat,
          lng,
          location.coordinates.latitude,
          location.coordinates.longitude
        );
        return {
          ...location.toObject(),
          distance: distance.toFixed(2),
        };
      })
      .filter((location) => location.distance <= radiusMiles)
      .sort((a, b) => a.distance - b.distance);

    res.json(nearbyLocations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/locations
// @desc    Create a new location for vendor
// @access  Private
router.post(
  '/',
  protect,
  [
    body('latitude').isFloat().withMessage('Valid latitude is required'),
    body('longitude').isFloat().withMessage('Valid longitude is required'),
    body('locationName')
      .notEmpty()
      .withMessage('Location name is required'),
    body('startTime').notEmpty().withMessage('Start time is required'),
    body('endTime').notEmpty().withMessage('End time is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      latitude,
      longitude,
      locationName,
      notes,
      date,
      startTime,
      endTime,
    } = req.body;

    try {
      // Validate US location
      if (!isWithinUS(latitude, longitude)) {
        return res.status(400).json({
          message: 'Location must be within the United States',
        });
      }

      // Get address from coordinates
      const addressData = await reverseGeocode(latitude, longitude);

      // Create location
      const location = await Location.create({
        vendor: req.vendor._id,
        coordinates: {
          latitude,
          longitude,
        },
        address: {
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          zipCode: addressData.zipCode,
          country: 'US',
        },
        locationName,
        notes,
        date: date || new Date(),
        startTime,
        endTime,
      });

      const populatedLocation = await Location.findById(location._id).populate(
        'vendor',
        '-password'
      );

      res.status(201).json(populatedLocation);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: error.message || 'Server error',
      });
    }
  }
);

// @route   PUT /api/locations/:id
// @desc    Update a location
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Check if vendor owns this location
    if (location.vendor.toString() !== req.vendor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const {
      latitude,
      longitude,
      locationName,
      notes,
      startTime,
      endTime,
      isActive,
    } = req.body;

    // Update coordinates and address if provided
    if (latitude && longitude) {
      if (!isWithinUS(latitude, longitude)) {
        return res.status(400).json({
          message: 'Location must be within the United States',
        });
      }

      const addressData = await reverseGeocode(latitude, longitude);

      location.coordinates = { latitude, longitude };
      location.address = {
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.zipCode,
        country: 'US',
      };
    }

    // Update other fields
    if (locationName) location.locationName = locationName;
    if (notes !== undefined) location.notes = notes;
    if (startTime) location.startTime = startTime;
    if (endTime) location.endTime = endTime;
    if (typeof isActive === 'boolean') location.isActive = isActive;

    const updatedLocation = await location.save();
    const populatedLocation = await Location.findById(
      updatedLocation._id
    ).populate('vendor', '-password');

    res.json(populatedLocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || 'Server error',
    });
  }
});

// @route   DELETE /api/locations/:id
// @desc    Delete a location
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Check if vendor owns this location
    if (location.vendor.toString() !== req.vendor._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await location.deleteOne();

    res.json({ message: 'Location removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/locations/vendor/me
// @desc    Get current vendor's locations
// @access  Private
router.get('/vendor/me', protect, async (req, res) => {
  try {
    const locations = await Location.find({ vendor: req.vendor._id })
      .sort({ date: -1 })
      .limit(30);

    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
