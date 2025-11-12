# Environment Variables Setup

## Missing Variables

Your `.env` file is missing the following required variables:

### Required Variables to Add:

```bash
# SAP Connection Settings
SAP_HOST=vhssnds4ci.hec.sonos.com
SAP_PORT=44300
SAP_CLIENT=500

# API Authentication
API_KEY=your_api_key_here
```

## Complete .env File Template

Your `.env` file should contain:

```bash
# S/4HANA Connection
SAP_HOST=vhssnds4ci.hec.sonos.com
SAP_PORT=44300
SAP_CLIENT=500
SAP_USERNAME=RTAYAL1
SAP_PASSWORD=your_sap_password

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Server Configuration
PORT=3001
NODE_ENV=development
API_KEY=your_api_key_here

# CORS - Use * for local development
ALLOWED_ORIGIN=*

# Logging (optional)
LOG_LEVEL=info
```

## Quick Fix

Add these lines to your `.env` file:

```bash
SAP_HOST=vhssnds4ci.hec.sonos.com
SAP_PORT=44300
SAP_CLIENT=500
API_KEY=test_key_12345
```

**Note:** 
- Replace `test_key_12345` with your actual API key
- Make sure `SAP_HOST`, `SAP_PORT`, and `SAP_CLIENT` match your SAP system configuration
- The `PORT` is currently set to 3000, but the server defaults to 3001. Either set `PORT=3001` in .env or the server will use 3001 by default.

## Verify Setup

After adding the variables, run:
```bash
node check-env.js
```

This will verify all required variables are set.

## Start Server

Once all variables are set, start the server:
```bash
npm run dev
```

The server should start on port 3001 (or the port specified in PORT environment variable).

