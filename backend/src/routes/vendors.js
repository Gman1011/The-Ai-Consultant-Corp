const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Vendor = require('../models/Vendor');
const Location = require('../models/Location');
const { protect } = require('../middleware/auth');

// @route   GET /api/vendors
// @desc    Get all vendors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find({ isActive: true }).select('-password');
    res.json(vendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/vendors/:id
// @desc    Get vendor by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).select('-password');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/vendors/me/profile
// @desc    Get current vendor's profile
// @access  Private
router.get('/me/profile', protect, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor._id).select('-password');
    res.json(vendor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/vendors/:id
// @desc    Update vendor profile
// @access  Private
router.put('/:id', protect, async (req, res) => {
  // Check if vendor is updating their own profile
  if (req.vendor._id.toString() !== req.params.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const {
    businessName,
    description,
    cuisine,
    phoneNumber,
    website,
    instagram,
    facebook,
    twitter,
    operatingHours,
    menuItems,
    imageUrl,
  } = req.body;

  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Update fields
    if (businessName) vendor.businessName = businessName;
    if (description !== undefined) vendor.description = description;
    if (cuisine) vendor.cuisine = cuisine;
    if (phoneNumber) vendor.phoneNumber = phoneNumber;
    if (website !== undefined) vendor.website = website;
    if (instagram !== undefined) vendor.instagram = instagram;
    if (facebook !== undefined) vendor.facebook = facebook;
    if (twitter !== undefined) vendor.twitter = twitter;
    if (operatingHours) vendor.operatingHours = operatingHours;
    if (menuItems) vendor.menuItems = menuItems;
    if (imageUrl) vendor.imageUrl = imageUrl;

    const updatedVendor = await vendor.save();

    res.json({
      _id: updatedVendor._id,
      email: updatedVendor.email,
      businessName: updatedVendor.businessName,
      description: updatedVendor.description,
      cuisine: updatedVendor.cuisine,
      phoneNumber: updatedVendor.phoneNumber,
      website: updatedVendor.website,
      instagram: updatedVendor.instagram,
      facebook: updatedVendor.facebook,
      twitter: updatedVendor.twitter,
      operatingHours: updatedVendor.operatingHours,
      menuItems: updatedVendor.menuItems,
      imageUrl: updatedVendor.imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/vendors/:id/locations
// @desc    Get all locations for a vendor
// @access  Public
router.get('/:id/locations', async (req, res) => {
  try {
    const locations = await Location.find({
      vendor: req.params.id,
      isActive: true,
    })
      .sort({ date: -1 })
      .limit(30);

    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
