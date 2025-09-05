# API Documentation

This document describes the API endpoints and their usage in the Roofing Contractor CRM system.

## Base URL

All API endpoints are prefixed with `/api/` and run on the same domain as the application.

## Authentication

Currently, the API uses a simple authentication system. Future versions will implement JWT tokens or session-based authentication.

## Endpoints

### Places API

#### GET `/api/places`

Fetches address suggestions from Google Places API based on user input.

**Purpose**: Provides autocomplete functionality for address input fields in the contractor registration form.

**Query Parameters**:
- `input` (string, required): The address input to search for
- `types` (string, optional): Type of place to search for (default: "address")

**Request Example**:
```http
GET /api/places?input=123 Main Street&types=address
```

**Response Format**:
```json
{
  "predictions": [
    {
      "place_id": "ChIJd8BlQ2BZwokRAFUEcm_qrcA",
      "description": "123 Main Street, New York, NY, USA",
      "structured_formatting": {
        "main_text": "123 Main Street",
        "secondary_text": "New York, NY, USA"
      }
    }
  ],
  "status": "OK"
}
```

**Response Fields**:
- `predictions` (array): Array of place predictions
  - `place_id` (string): Unique identifier for the place
  - `description` (string): Full address description
  - `structured_formatting` (object): Structured address components
    - `main_text` (string): Primary address component
    - `secondary_text` (string): Secondary address component
- `status` (string): Response status ("OK", "ZERO_RESULTS", "OVER_QUERY_LIMIT", etc.)

**Error Responses**:

**400 Bad Request**:
```json
{
  "error": "Missing required parameter: input"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Failed to fetch places data",
  "details": "Google Places API error message"
}
```

**Rate Limiting**: 
- No explicit rate limiting implemented
- Relies on Google Places API rate limits
- Debounced on client side (300ms delay)

**Usage Example**:

```typescript
// Client-side usage
const fetchAddressSuggestions = async (input: string) => {
  try {
    const response = await fetch(`/api/places?input=${encodeURIComponent(input)}`);
    const data = await response.json();
    
    if (data.status === 'OK') {
      setAddressSuggestions(data.predictions);
    }
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
  }
};
```

## Implementation Details

### Google Places API Integration

The Places API endpoint acts as a proxy to Google Places API to:
1. Hide API keys from client-side code
2. Add server-side validation
3. Implement error handling
4. Provide consistent response format

### Security Considerations

- API keys are stored server-side only
- Input validation and sanitization
- CORS headers configured appropriately
- Error messages don't expose sensitive information

### Performance Optimizations

- Client-side debouncing (300ms)
- Caching of recent searches (future enhancement)
- Minimal data transfer with structured formatting

## Error Handling

All API endpoints follow consistent error handling patterns:

1. **Validation Errors** (400): Invalid input parameters
2. **Authentication Errors** (401): Missing or invalid authentication
3. **Authorization Errors** (403): Insufficient permissions
4. **Not Found Errors** (404): Resource not found
5. **Server Errors** (500): Internal server errors

Error response format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details (optional)"
}
```

## Development Notes

- All API routes are located in `app/api/` directory
- Use TypeScript for type safety
- Implement proper error handling
- Add request/response logging for debugging
- Consider implementing API versioning for future updates
