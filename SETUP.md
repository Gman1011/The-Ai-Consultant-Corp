# Food Truck Finder - Setup Guide

Complete setup instructions for the Food Truck Finder application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - Either:
  - Local installation: [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
- **Google Maps API Key** - [Get one here](https://developers.google.com/maps/documentation/javascript/get-api-key)

## Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API (optional, for enhanced features)
4. Create credentials (API Key)
5. Restrict your API key (recommended for production):
   - Application restrictions: HTTP referrers (web sites)
   - API restrictions: Select the enabled APIs

## Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd The-Ai-Consultant-Corp
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `backend/.env` with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/foodtruck
JWT_SECRET=your_secure_random_string_here_change_in_production
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
NODE_ENV=development
```

**Important Notes:**
- For `JWT_SECRET`, use a long random string. You can generate one with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- For MongoDB Atlas, use your connection string:
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodtruck?retryWrites=true&w=majority
  ```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `frontend/.env` with your configuration:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Running the Application

### Development Mode

You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on http://localhost:3000

The app will automatically open in your browser.

## Testing the Application

### 1. Register a Vendor

1. Navigate to http://localhost:3000
2. Click "Register Your Truck"
3. Fill out the registration form
4. Submit and you'll be logged in automatically

### 2. Add a Location

1. Go to the Dashboard
2. Click "Add Location"
3. Fill in the location details
4. **Important**: Make sure to allow location access when prompted
5. Submit the form

### 3. View Food Trucks

1. Go to the home page (click "Food Truck Finder" in navbar)
2. Allow location access to see nearby trucks
3. View trucks on the map and in the list
4. Click markers or "View on Map" to see details

## Common Issues & Solutions

### Backend won't start

**Issue**: "MongoServerError: Authentication failed"
- **Solution**: Check your MongoDB connection string in `backend/.env`
- For local MongoDB, ensure the service is running:
  ```bash
  # macOS
  brew services start mongodb-community

  # Linux
  sudo systemctl start mongod

  # Windows
  # Start MongoDB service from Services app
  ```

### Frontend location not working

**Issue**: "Geolocation is not supported" or permission denied
- **Solution**:
  - Use HTTPS in production (browsers restrict geolocation on HTTP)
  - For development, ensure you're using `localhost` (not 127.0.0.1)
  - Check browser permissions for location access

### Google Maps not showing

**Issue**: Map is grey or showing errors
- **Solution**:
  - Verify API key is correct in `frontend/.env`
  - Check that you've enabled the required APIs in Google Cloud Console
  - Check browser console for specific error messages
  - Ensure you have billing enabled (Google requires it even for free tier)

### CORS Errors

**Issue**: "CORS policy: No 'Access-Control-Allow-Origin' header"
- **Solution**: Backend has CORS enabled, but verify:
  - Backend is running on port 5000
  - Frontend `.env` has correct `REACT_APP_API_URL`
  - Restart both servers after changing environment variables

## Production Deployment

### Environment Variables

For production, update:

**Backend:**
```env
NODE_ENV=production
MONGODB_URI=<your-production-mongodb-uri>
JWT_SECRET=<strong-random-secret>
GOOGLE_MAPS_API_KEY=<production-api-key>
PORT=5000
```

**Frontend:**
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_GOOGLE_MAPS_API_KEY=<production-api-key>
```

### Build Frontend

```bash
cd frontend
npm run build
```

This creates a `build` folder with optimized production files.

### Deployment Options

1. **Heroku** (Backend + Frontend)
   - Use the Heroku CLI to deploy
   - Add MongoDB Atlas add-on or use external MongoDB

2. **Vercel** (Frontend) + **Render/Railway** (Backend)
   - Deploy frontend to Vercel
   - Deploy backend to Render or Railway
   - Update CORS settings and API URLs

3. **AWS/DigitalOcean** (Full Stack)
   - Deploy using EC2/Droplet
   - Use PM2 to manage Node processes
   - Nginx as reverse proxy

### Security Checklist

- [ ] Use strong JWT_SECRET
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS in production
- [ ] Restrict Google Maps API key
- [ ] Set up rate limiting
- [ ] Validate and sanitize all inputs
- [ ] Keep dependencies updated
- [ ] Use environment variables (never commit .env)

## Database Schema

### Vendors Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  businessName: String,
  cuisine: String,
  phoneNumber: String,
  description: String,
  menuItems: Array,
  operatingHours: String,
  website: String,
  social media links: Strings,
  imageUrl: String,
  isActive: Boolean,
  isVerified: Boolean
}
```

### Locations Collection
```javascript
{
  vendor: ObjectId (ref: Vendor),
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  locationName: String,
  notes: String,
  date: Date,
  startTime: String,
  endTime: String,
  isActive: Boolean
}
```

## API Documentation

See [API.md](./API.md) for complete API documentation.

## Support

For issues or questions:
1. Check this setup guide
2. Review error messages in console
3. Check MongoDB and API logs
4. Open an issue on GitHub

## Next Steps

After setup:
1. Customize the styling to match your brand
2. Add more features (reviews, ratings, menus)
3. Set up analytics
4. Implement push notifications
5. Add email verification
6. Create admin dashboard
