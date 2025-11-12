# Quick Start Guide

Get the SAC Custom Widget chatbot up and running in 5 minutes!

## Step 1: Configure Environment (2 minutes)

Create a `.env` file in the project root:

```bash
# S/4HANA Connection
SAP_HOST=vhssnds4ci.hec.sonos.com
SAP_PORT=44300
SAP_CLIENT=500
SAP_USERNAME=CDS_VIEWS_PY
SAP_PASSWORD=your_sap_password

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Server
PORT=3001
NODE_ENV=development
API_KEY=test_key_12345

# CORS - Use * for local development
ALLOWED_ORIGIN=*
```

**Important:** Replace the placeholder values with your actual credentials!

## Step 2: Install & Build (1 minute)

```bash
npm install
npm run build
```

## Step 3: Update Service Whitelist (30 seconds)

Edit `src/constants.ts` and add your available SAP services:

```typescript
export const SERVICE_WHITELIST = [
  'API_BUSINESS_PARTNER',  // Already configured
  'API_SALES_ORDER_SRV',   // Add your services here
  'API_PRODUCT_SRV',
  // Add more...
];
```

## Step 4: Start Server (30 seconds)

```bash
npm run dev
```

You should see:

```
[INFO] SAC Custom Widget server running on port 3001
[INFO] Widget files available at http://localhost:3001/widget/
[INFO] API endpoints available at http://localhost:3001/api/
```

## Step 5: Test Locally (1 minute)

Open `test.html` in your browser:

```bash
# Windows
start test.html

# Mac
open test.html

# Linux
xdg-open test.html
```

Or navigate to: `http://localhost:3001/test.html`

Try these queries:
- "Show me customer data"
- "Get sales information"
- "List all products"

## Next Steps

### For SAC Integration:

1. **Deploy to a public server** (see [DEPLOYMENT.md](./DEPLOYMENT.md))
   - SAP BTP (recommended)
   - Azure App Service
   - Heroku
   - Docker

2. **Update widget.json** with your server URL:
   ```json
   "url": "https://your-server.com/widget/widget.js"
   ```

3. **Upload to SAC:**
   - Log in to SAC
   - Go to Files → Public
   - Click + → Custom Widget
   - Upload `widget/widget.json`

4. **Create Analytic Application:**
   - Create new Analytic Application
   - Drag "AI Chatbot" widget to canvas
   - Set API Endpoint and API Key in properties
   - Test!

See [SAC_INTEGRATION_GUIDE.md](./SAC_INTEGRATION_GUIDE.md) for detailed instructions.

---

## Troubleshooting

### Server won't start

**Error:** `Missing required environment variables`
- **Fix:** Create `.env` file with all required variables

**Error:** `Port 3001 already in use`
- **Fix:** Change PORT in `.env` or kill the process using the port

### No data returned

**Error:** API returns empty results
- **Fix 1:** Check `SERVICE_WHITELIST` includes the service
- **Fix 2:** Verify SAP credentials in `.env`
- **Fix 3:** Check S/4HANA is accessible from your machine

### Widget shows API error

**Error:** "Unauthorized: Invalid API key"
- **Fix:** Update API key in widget properties or test.html

**Error:** "CORS error"
- **Fix:** Set `ALLOWED_ORIGIN=*` in `.env` for local testing

---

## Testing Checklist

- [ ] Server starts without errors
- [ ] Health endpoint works: `curl http://localhost:3001/health`
- [ ] Widget loads in test.html
- [ ] Can send queries and get responses
- [ ] Data appears in widget chat
- [ ] Events are logged in Event Log

---

## Common Queries to Test

```
# Customer/Business Partner
"Show me customer data"
"List all customers"
"Get business partners"

# Sales Orders
"Show sales information"
"Get sales orders"
"Display sales data"

# Products/Materials
"Show me products"
"List all materials"
"Get product information"

# Service Selection
"Use API_BUSINESS_PARTNER"
"Use API_SALES_ORDER_SRV"
```

---

## Project Structure Overview

```
sac-custom-widget/
├── src/
│   ├── server.ts              # Express server
│   ├── config.ts              # Configuration
│   ├── routes/
│   │   └── chat.ts            # Chat API endpoint
│   ├── clients/
│   │   ├── openai-client.ts   # OpenAI integration
│   │   └── sap-client.ts      # SAP OData client
│   ├── utils/                 # Logger, cache
│   └── types/                 # TypeScript types
├── widget/
│   ├── widget.json            # SAC widget manifest
│   └── widget.js              # Widget web component
├── dist/                      # Compiled JavaScript (generated)
├── test.html                  # Local testing page
├── .env                       # Environment variables (create this!)
└── package.json               # Dependencies
```

---

## Development Tips

### Hot Reload

The `npm run dev` command uses `ts-node` for faster development. For production:

```bash
npm run build
npm start
```

### Debugging

Enable debug logs:

```env
LOG_LEVEL=debug
```

Check logs for:
- OpenAI API calls
- SAP OData requests
- Cache hits/misses
- Entity matching

### Adding More Services

1. Add service name to `SERVICE_WHITELIST` in `src/constants.ts`
2. Restart server
3. Test with: "Use YOUR_SERVICE_NAME"

### Customizing the Widget

Edit `widget/widget.js`:
- Change colors in the `<style>` section
- Modify chat UI layout
- Add custom event handlers
- Change welcome message

---

## Performance Tips

- Cache is enabled by default (5-30 min TTL)
- Metadata cached for 10 minutes
- Entity data cached for 2 minutes
- OpenAI responses cached for 30 minutes

Monitor cache hit rates in debug logs.

---

## Security Notes

**For Local Development:**
- `ALLOWED_ORIGIN=*` is OK
- Use simple API key

**For Production:**
- Set `ALLOWED_ORIGIN` to your SAC tenant URL
- Use strong API key (32+ characters)
- Enable HTTPS
- Never commit `.env` file

---

## Need Help?

1. Check [SAC_INTEGRATION_GUIDE.md](./SAC_INTEGRATION_GUIDE.md) for SAC setup
2. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment options
3. Look at server logs for errors
4. Check browser console (F12) for client errors
5. Review [README.md](./README.md) for API documentation

---

## What's Next?

- ✅ Server running locally
- ✅ Widget tested
- 📋 Deploy to production (see DEPLOYMENT.md)
- 📋 Upload to SAC (see SAC_INTEGRATION_GUIDE.md)
- 📋 Create Analytic Application
- 📋 Go live!

