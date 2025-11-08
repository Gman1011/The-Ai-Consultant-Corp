# Food Truck Finder App

A comprehensive application that allows food truck vendors to register and update their daily locations, while enabling customers to find food trucks near them anywhere in the United States.

## Features

### For Vendors
- Secure registration and authentication
- Daily location updates with precise geo-coordinates
- Vendor profile management
- Business information and operating hours

### For Customers
- Interactive map showing all active food trucks
- Real-time location updates
- Search and filter food trucks
- View vendor details and menu information

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Mapping**: Google Maps API
- **Authentication**: JWT tokens
- **Geo-location**: HTML5 Geolocation API + Google Maps Geocoding

## Project Structure

```
/
├── backend/          # Express API server
│   ├── src/
│   │   ├── models/   # MongoDB models
│   │   ├── routes/   # API routes
│   │   ├── middleware/ # Auth & validation
│   │   └── utils/    # Helper functions
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/    # Page components
│   │   ├── services/ # API services
│   │   └── types/    # TypeScript types
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- Google Maps API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/foodtruck
JWT_SECRET=your_jwt_secret_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

3. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

3. Start the development server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new vendor
- `POST /api/auth/login` - Vendor login

### Vendors
- `GET /api/vendors` - Get all active vendors
- `GET /api/vendors/:id` - Get vendor details
- `PUT /api/vendors/:id` - Update vendor profile
- `POST /api/vendors/:id/location` - Update daily location

### Locations
- `GET /api/locations/active` - Get all active food truck locations today
- `GET /api/locations/nearby` - Find food trucks near coordinates

## US-Only Validation

The app validates that all locations are within the United States using:
- Google Maps Geocoding API to verify addresses
- Coordinate boundary checking (latitude: 24.5° to 49.4°, longitude: -125° to -66°)
- Country code validation

## License

MIT
