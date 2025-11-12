# SAC Custom Widget Chatbot

AI-powered chatbot widget for SAP Analytics Cloud that uses Natural Language Processing to query S/4HANA OData services.

## Architecture

- **Backend**: Node.js/Express server with OpenAI integration
- **Widget**: Vanilla JavaScript Web Component
- **Data Source**: Direct S/4HANA OData access (port 44300)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Build TypeScript**
   ```bash
   npm run build
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
sac-custom-widget/
├── src/
│   ├── server.ts              # Express server
│   ├── routes/
│   │   └── chat.ts            # Chat API endpoints
│   ├── clients/
│   │   ├── openai-client.ts   # OpenAI integration
│   │   └── sap-client.ts      # SAP OData client
│   ├── utils/                 # Utilities (logger, cache)
│   ├── analytics/             # Aggregation logic
│   └── types/                 # TypeScript definitions
├── widget/
│   ├── widget.json            # SAC Custom Widget manifest
│   ├── widget.js              # Widget web component
│   └── widget.css             # Widget styling
└── dist/                      # Compiled output

```

## API Endpoints

### POST `/api/chat/query`
Query SAP data using natural language.

**Request:**
```json
{
  "query": "Show me all customers in Germany"
}
```

**Response:**
```json
{
  "success": true,
  "summary": "Found 150 customers in Germany",
  "data": [...],
  "fields": ["Customer", "CustomerName", "Country"],
  "entity": "A_Customer",
  "recordCount": 150
}
```

## Widget Integration in SAC

1. **Upload Widget**: Analytics Designer → Custom Widgets → Import `widget.json`
2. **Create Analytic Application**: Add custom widget to canvas
3. **Configure**: Set API endpoint and API key in widget properties
4. **Script**: Add button click handler to call `ChatWidget_1.sendQuery(query)`

## Security

- API key authentication required for all requests
- CORS restricted to configured SAC tenant domain
- Rate limiting on API endpoints

## Deployment

### Option 1: SAP BTP Cloud Foundry
```bash
cf push sac-chatbot -m 512M
```

### Option 2: Docker
```bash
docker build -t sac-widget .
docker run -p 3001:3001 --env-file .env sac-widget
```

## License

ISC

