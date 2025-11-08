const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Vendor = require('../models/Vendor');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new vendor
// @access  Public
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('businessName')
      .notEmpty()
      .withMessage('Business name is required'),
    body('cuisine').notEmpty().withMessage('Cuisine type is required'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      password,
      businessName,
      description,
      cuisine,
      phoneNumber,
      website,
      instagram,
      facebook,
      twitter,
    } = req.body;

    try {
      // Check if vendor already exists
      const vendorExists = await Vendor.findOne({ email });
      if (vendorExists) {
        return res.status(400).json({ message: 'Vendor already exists' });
      }

      // Create vendor
      const vendor = await Vendor.create({
        email,
        password,
        businessName,
        description,
        cuisine,
        phoneNumber,
        website,
        instagram,
        facebook,
        twitter,
      });

      if (vendor) {
        res.status(201).json({
          _id: vendor._id,
          email: vendor.email,
          businessName: vendor.businessName,
          token: generateToken(vendor._id),
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate vendor & get token
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check for vendor
      const vendor = await Vendor.findOne({ email });

      if (vendor && (await vendor.comparePassword(password))) {
        res.json({
          _id: vendor._id,
          email: vendor.email,
          businessName: vendor.businessName,
          cuisine: vendor.cuisine,
          token: generateToken(vendor._id),
        });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
