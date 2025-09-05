# EmberNFT Pinata Relayer

A Cloudflare Worker that acts as a secure API wrapper for Pinata IPFS services, providing endpoints for file retrieval and presigned upload URLs. Built with direct HTTP API calls for optimal performance and minimal dependencies.

## Features

- **GET /:hash** - Stream files directly from Pinata gateway (no processing overhead)
- **POST /upload** - Create presigned upload URLs using Pinata HTTP API
- CORS support for web applications
- Input validation and error handling
- Direct streaming for optimal performance on file retrieval
- Zero dependencies - pure HTTP API implementation

## Setup

### 1. Install Dependencies

Make sure you have [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed:

```bash
npm install -g wrangler
```

No additional dependencies needed - the Worker uses only native fetch APIs!

### 2. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .dev.vars.example .dev.vars
```

2. Fill in your Pinata credentials in `.dev.vars`:
```env
PINATA_JWT=your_pinata_jwt_token_here
PINATA_GATEWAY=your-gateway.mypinata.cloud
```

3. Update `wrangler.toml` with your Pinata gateway URL.

### 3. Set Production Secrets

For production deployment, set the secrets using Wrangler:

```bash
wrangler secret put PINATA_JWT
wrangler secret put PINATA_GATEWAY
```

### 4. Deploy

```bash
wrangler deploy
```

## API Endpoints

### GET /:hash

Streams a file directly from Pinata gateway by IPFS hash. Returns the raw file with original headers and content-type.

**Request:**
```http
GET /bafkreib4pqtikzdjlj4zigobmd63lig7u6oxlug24snlr6atjlmlza45dq
```

**Response:**
Returns the raw file content with original content-type headers. For example:
- Images: `Content-Type: image/png` with binary image data
- JSON: `Content-Type: application/json` with JSON content
- Text: `Content-Type: text/plain` with text content

**Error Responses:**
- `400 Bad Request`: "Invalid IPFS hash format" (text/plain)
- `404 Not Found`: "File not found on IPFS" (text/plain) 
- `500 Internal Server Error`: "Internal server error" (text/plain)

### POST /upload

Creates a presigned upload URL for client-side file uploads using the Pinata HTTP API.

**Request:**
```http
POST /upload
Content-Type: application/json

{
  "expires": 1800,
  "maxFileSize": 5000000,
  "mimeTypes": ["image/*", "application/json"],
  "name": "My File",
  "keyvalues": {
    "env": "prod"
  },
  "groupId": "ad4bc3bf-8794-49e7-94ff-fea1ce745779"
}
```

**Response:**
```json
{
  "success": true,
  "uploadUrl": "https://api.pinata.cloud/v3/files",
  "expires": 1800,
  "fields": {},
  "options": {
    "maxFileSize": 5000000,
    "mimeTypes": ["image/*", "application/json"],
    "name": "My File",
    "keyvalues": {
      "env": "prod"
    },
    "groupId": "ad4bc3bf-8794-49e7-94ff-fea1ce745779"
  }
}
```

## Development

### Local Development

```bash
npm run dev
# or
wrangler dev
```

This will start a local development server at `http://localhost:8787`.

### Testing the Endpoints

Test file retrieval (streams file directly):
```bash
curl https://your-worker.your-subdomain.workers.dev/QmYourIPFSHash
# Returns raw file content with original headers
```

Test file retrieval with output to file:
```bash
curl https://your-worker.your-subdomain.workers.dev/QmYourIPFSHash -o downloaded-file.png
```

Test upload URL creation:
```bash
curl -X POST https://your-worker.your-subdomain.workers.dev/upload \
  -H "Content-Type: application/json" \
  -d '{"expires": 300}'
```

### Using the Upload URL

Once you get the presigned URL, you can upload files directly:

```javascript
// Get upload URL from your worker
const response = await fetch('/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ expires: 1800 })
});
const { uploadUrl } = await response.json();

// Upload file using the presigned URL
const file = new File(['content'], 'test.txt', { type: 'text/plain' });
const uploadResponse = await fetch(uploadUrl, {
  method: 'POST',
  body: file
});
```

### Architecture Benefits

**GET Endpoint (Direct Streaming):**
- Zero processing overhead - files stream directly from Pinata gateway
- Preserves original content-type and headers  
- Optimal performance for large files
- No memory usage for file buffering

**POST Endpoint (Pinata SDK):**
- Reliable presigned URL generation
- Rich configuration options (file size, MIME types, metadata)
- Built-in error handling and validation
- Consistent API interface

## Architecture

This Worker uses **direct HTTP API calls** for optimal performance and minimal overhead:

### GET Endpoint - Direct Streaming
- Makes direct HTTP calls to Pinata gateway
- Streams `response.body` directly to client (no memory buffering)
- Preserves original content-type and headers
- Supports files of any size without memory limitations
- Minimal latency and processing overhead

### POST Endpoint - Direct API Calls
- Makes direct HTTP calls to Pinata's presigned URL API
- Zero dependencies and minimal bundle size
- Native error handling with proper HTTP status codes
- Clean parameter validation and forwarding

## Configuration Options

### Upload Endpoint Parameters

- `expires` (number): URL validity in seconds (max 3600)
- `maxFileSize` (number): Maximum file size in bytes
- `mimeTypes` (array): Allowed MIME types (supports wildcards)
- `name` (string): Name for the uploaded file
- `keyvalues` (object): Additional metadata key-value pairs
- `groupId` (string): Target group ID for file organization

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

Common error codes:
- `400` - Bad request (invalid parameters)
- `404` - File not found
- `500` - Internal server error

## Security

- Pinata JWT token is stored as a Cloudflare secret
- CORS headers configured for cross-origin requests
- Input validation for IPFS hash format
- Rate limiting through Cloudflare's built-in features

## License

MIT License