# Food Truck Finder - API Documentation

Base URL: `http://localhost:5000/api` (development)

All endpoints return JSON. Authentication uses JWT tokens via Bearer authentication.

## Authentication

### Register Vendor
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "vendor@example.com",
  "password": "password123",
  "businessName": "Joe's Tacos",
  "cuisine": "Mexican",
  "phoneNumber": "(555) 123-4567",
  "description": "Best tacos in town!"
}
```

**Response:** `201 Created`
```json
{
  "_id": "...",
  "email": "vendor@example.com",
  "businessName": "Joe's Tacos",
  "token": "jwt_token_here"
}
```

### Login Vendor
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "vendor@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "_id": "...",
  "email": "vendor@example.com",
  "businessName": "Joe's Tacos",
  "cuisine": "Mexican",
  "token": "jwt_token_here"
}
```

## Vendors

### Get All Vendors
```http
GET /api/vendors
```

**Response:** `200 OK`
```json
[
  {
    "_id": "...",
    "businessName": "Joe's Tacos",
    "cuisine": "Mexican",
    "phoneNumber": "(555) 123-4567",
    "description": "Best tacos in town!",
    ...
  }
]
```

### Get Vendor by ID
```http
GET /api/vendors/:id
```

**Response:** `200 OK`
```json
{
  "_id": "...",
  "businessName": "Joe's Tacos",
  "cuisine": "Mexican",
  ...
}
```

### Get Current Vendor Profile
```http
GET /api/vendors/me/profile
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "_id": "...",
  "email": "vendor@example.com",
  "businessName": "Joe's Tacos",
  ...
}
```

### Update Vendor Profile
```http
PUT /api/vendors/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "businessName": "Joe's Amazing Tacos",
  "description": "Updated description",
  "operatingHours": "10:00 AM - 9:00 PM",
  "website": "https://joestacos.com"
}
```

**Response:** `200 OK`
```json
{
  "_id": "...",
  "businessName": "Joe's Amazing Tacos",
  ...
}
```

### Get Vendor Locations
```http
GET /api/vendors/:id/locations
```

**Response:** `200 OK`
```json
[
  {
    "_id": "...",
    "vendor": "...",
    "locationName": "Downtown Plaza",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    ...
  }
]
```

## Locations

### Get Active Locations
Get all food truck locations active today.

```http
GET /api/locations/active
```

**Response:** `200 OK`
```json
[
  {
    "_id": "...",
    "vendor": {
      "_id": "...",
      "businessName": "Joe's Tacos",
      "cuisine": "Mexican",
      ...
    },
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "US"
    },
    "locationName": "Downtown Plaza",
    "notes": "Near the fountain",
    "date": "2024-01-15T00:00:00.000Z",
    "startTime": "11:00",
    "endTime": "20:00",
    "isActive": true
  }
]
```

### Get Nearby Locations
Find food trucks near specific coordinates.

```http
GET /api/locations/nearby?latitude=40.7128&longitude=-74.0060&radius=10
```

**Query Parameters:**
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate
- `radius` (optional): Search radius in miles (default: 10)

**Response:** `200 OK`
```json
[
  {
    "_id": "...",
    "vendor": { ... },
    "coordinates": { ... },
    "distance": "2.45",
    ...
  }
]
```

### Create Location
Add a new location for the authenticated vendor.

```http
POST /api/locations
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "locationName": "Downtown Plaza",
  "notes": "Near the fountain",
  "date": "2024-01-15",
  "startTime": "11:00",
  "endTime": "20:00"
}
```

**Response:** `201 Created`
```json
{
  "_id": "...",
  "vendor": { ... },
  "coordinates": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  ...
}
```

**Notes:**
- Address is automatically geocoded from coordinates
- Location must be within the United States
- Coordinates are validated against US boundaries

### Update Location
```http
PUT /api/locations/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "locationName": "Updated Location Name",
  "startTime": "10:00",
  "endTime": "21:00",
  "isActive": true
}
```

**Response:** `200 OK`

### Delete Location
```http
DELETE /api/locations/:id
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Location removed"
}
```

### Get My Locations
Get all locations for the authenticated vendor.

```http
GET /api/locations/vendor/me
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "_id": "...",
    "vendor": "...",
    "coordinates": { ... },
    "address": { ... },
    ...
  }
]
```

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

## US-Only Validation

The application enforces US-only locations through multiple mechanisms:

1. **Coordinate Boundaries**: Validates latitude/longitude are within US territory
   - Continental US: 24.5° to 49.4° N, -125° to -66° W
   - Alaska: 51.2° to 71.5° N, -179° to -129° W
   - Hawaii: 18.9° to 28.4° N, -178° to -154° W

2. **Geocoding Verification**: Uses Google Maps Geocoding API to:
   - Convert coordinates to addresses
   - Verify country code is "US"
   - Extract accurate city, state, and ZIP code

3. **Address Components**: Only accepts locations with valid US state codes

If a location is outside the US, the API returns:
```json
{
  "message": "Location must be within the United States"
}
```

## Rate Limiting

Currently no rate limiting is implemented. For production, consider:
- Rate limiting per IP address
- Authenticated endpoint limits
- Geographic location creation limits per vendor per day

## Pagination

Currently not implemented. All list endpoints return all results.

For production, add pagination:
```http
GET /api/vendors?page=1&limit=20
```

## Authentication Flow

1. Vendor registers or logs in → receives JWT token
2. Store token in `localStorage` on client
3. Include token in subsequent requests:
   ```
   Authorization: Bearer <token>
   ```
4. Token expires after 30 days
5. Logout: Remove token from `localStorage`

## Best Practices

1. **Always use HTTPS in production**
2. **Store tokens securely** (httpOnly cookies or secure storage)
3. **Validate all inputs** on both client and server
4. **Handle errors gracefully** with user-friendly messages
5. **Log errors** for debugging (server-side only)
6. **Keep API keys secure** (never expose in client code)
