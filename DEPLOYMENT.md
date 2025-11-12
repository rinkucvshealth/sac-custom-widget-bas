# Deployment Guide

This guide covers deploying the SAC Custom Widget server to production.

## Deployment Options

### Option 1: SAP BTP Cloud Foundry (Recommended)

SAP BTP provides the easiest integration with SAC and automatic HTTPS.

#### Prerequisites
- SAP BTP account with Cloud Foundry enabled
- Cloud Foundry CLI installed: https://docs.cloudfoundry.org/cf-cli/install-go-cli.html

#### Steps

1. **Create `manifest.yml` in project root:**

```yaml
applications:
- name: sac-chatbot
  memory: 512M
  instances: 1
  buildpacks:
    - nodejs_buildpack
  command: npm start
  env:
    NODE_ENV: production
```

2. **Build the project:**

```bash
npm run build
```

3. **Login to Cloud Foundry:**

```bash
cf login -a https://api.cf.YOUR_REGION.hana.ondemand.com
```

4. **Push the application:**

```bash
cf push
```

5. **Set environment variables:**

```bash
cf set-env sac-chatbot SAP_HOST "vhssnds4ci.hec.sonos.com"
cf set-env sac-chatbot SAP_PORT "44300"
cf set-env sac-chatbot SAP_CLIENT "500"
cf set-env sac-chatbot SAP_USERNAME "CDS_VIEWS_PY"
cf set-env sac-chatbot SAP_PASSWORD "your_password"
cf set-env sac-chatbot OPENAI_API_KEY "your_openai_key"
cf set-env sac-chatbot API_KEY "your_secure_api_key"
cf set-env sac-chatbot ALLOWED_ORIGIN "https://your-sac-tenant.cloud.sap"

cf restage sac-chatbot
```

6. **Get the application URL:**

```bash
cf apps
```

Your server will be available at: `https://sac-chatbot.cfapps.YOUR_REGION.hana.ondemand.com`

7. **Update widget.json:**

Edit `widget/widget.json` and replace the URL with your BTP URL:

```json
"url": "https://sac-chatbot.cfapps.YOUR_REGION.hana.ondemand.com/widget/widget.js"
```

---

### Option 2: Azure App Service

#### Prerequisites
- Azure account
- Azure CLI installed

#### Steps

1. **Create App Service:**

```bash
az login
az group create --name sac-chatbot-rg --location eastus
az appservice plan create --name sac-chatbot-plan --resource-group sac-chatbot-rg --sku B1 --is-linux
az webapp create --name sac-chatbot --resource-group sac-chatbot-rg --plan sac-chatbot-plan --runtime "NODE|18-lts"
```

2. **Configure environment variables:**

```bash
az webapp config appsettings set --name sac-chatbot --resource-group sac-chatbot-rg --settings \
  SAP_HOST="vhssnds4ci.hec.sonos.com" \
  SAP_PORT="44300" \
  SAP_CLIENT="500" \
  SAP_USERNAME="CDS_VIEWS_PY" \
  SAP_PASSWORD="your_password" \
  OPENAI_API_KEY="your_openai_key" \
  API_KEY="your_secure_api_key" \
  ALLOWED_ORIGIN="https://your-sac-tenant.cloud.sap" \
  NODE_ENV="production"
```

3. **Deploy:**

```bash
npm run build
az webapp deployment source config-zip --name sac-chatbot --resource-group sac-chatbot-rg --src deploy.zip
```

Your server will be at: `https://sac-chatbot.azurewebsites.net`

---

### Option 3: Docker (Any Cloud Provider)

#### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

#### Create `.dockerignore`

```
node_modules
.env
.git
*.md
test.html
```

#### Build and run

```bash
docker build -t sac-chatbot .
docker run -p 3001:3001 --env-file .env sac-chatbot
```

#### Deploy to Docker Hub

```bash
docker tag sac-chatbot your-dockerhub-username/sac-chatbot
docker push your-dockerhub-username/sac-chatbot
```

Then deploy to any cloud provider that supports Docker (AWS ECS, Google Cloud Run, Azure Container Instances, etc.)

---

### Option 4: Heroku

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps

1. **Create Heroku app:**

```bash
heroku login
heroku create sac-chatbot
```

2. **Set environment variables:**

```bash
heroku config:set SAP_HOST="vhssnds4ci.hec.sonos.com"
heroku config:set SAP_PORT="44300"
heroku config:set SAP_CLIENT="500"
heroku config:set SAP_USERNAME="CDS_VIEWS_PY"
heroku config:set SAP_PASSWORD="your_password"
heroku config:set OPENAI_API_KEY="your_openai_key"
heroku config:set API_KEY="your_secure_api_key"
heroku config:set ALLOWED_ORIGIN="https://your-sac-tenant.cloud.sap"
heroku config:set NODE_ENV="production"
```

3. **Deploy:**

```bash
git push heroku main
```

Your server will be at: `https://sac-chatbot.herokuapp.com`

---

## Post-Deployment Checklist

### 1. Verify Server is Running

```bash
curl https://your-server-url.com/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-10-10T..."}
```

### 2. Test API Endpoint

```bash
curl -X POST https://your-server-url.com/api/chat/query \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{"query":"Show me customer data"}'
```

### 3. Test Widget Files

```bash
curl https://your-server-url.com/widget/widget.json
curl https://your-server-url.com/widget/widget.js
```

### 4. Update widget.json

Edit `widget/widget.json` with your production server URL:

```json
"url": "https://your-production-server.com/widget/widget.js"
```

### 5. Upload to SAC

1. Log in to SAC
2. Go to Files → Public
3. Upload `widget.json`
4. Test in an Analytic Application

### 6. Configure Security

- ✅ Change default API_KEY
- ✅ Set ALLOWED_ORIGIN to your SAC tenant URL
- ✅ Enable HTTPS
- ✅ Rotate SAP credentials regularly
- ✅ Monitor API usage
- ✅ Set up logging and monitoring

### 7. Performance Tuning

- Enable caching (already configured)
- Consider CDN for widget files
- Scale instances based on usage
- Monitor response times
- Set up health checks

---

## Monitoring & Maintenance

### Logs

**SAP BTP:**
```bash
cf logs sac-chatbot --recent
cf logs sac-chatbot # tail logs
```

**Azure:**
```bash
az webapp log tail --name sac-chatbot --resource-group sac-chatbot-rg
```

**Heroku:**
```bash
heroku logs --tail
```

### Scaling

**SAP BTP:**
```bash
cf scale sac-chatbot -i 2 # scale to 2 instances
cf scale sac-chatbot -m 1G # scale to 1GB memory
```

**Azure:**
```bash
az appservice plan update --name sac-chatbot-plan --resource-group sac-chatbot-rg --sku P1V2
```

### Updates

1. Make code changes
2. Test locally
3. Build: `npm run build`
4. Deploy using your chosen method
5. Verify deployment
6. Monitor for errors

---

## Troubleshooting

### CORS Errors
- Verify ALLOWED_ORIGIN matches SAC tenant URL exactly
- Check for trailing slashes
- Look for http vs https mismatch

### API Authentication Errors
- Verify API_KEY is set correctly
- Check X-API-Key header in requests
- Look at server logs for rejected requests

### SAP Connection Errors
- Verify SAP credentials
- Check network connectivity from deployment platform to SAP
- Verify SAP host and port
- Check service whitelist

### Widget Not Loading
- Verify widget.json URL is correct
- Check CORS configuration
- Verify widget files are accessible
- Look at browser console for errors

---

## Security Best Practices

1. **Never commit .env files**
2. **Use strong API keys** (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
3. **Rotate credentials** regularly
4. **Monitor access logs** for suspicious activity
5. **Keep dependencies updated**: `npm audit fix`
6. **Use HTTPS only**
7. **Implement rate limiting** (already configured)
8. **Restrict CORS to specific origins**
9. **Use environment variables** for all secrets
10. **Enable security headers** (consider adding helmet.js)

---

## Cost Optimization

### SAP BTP
- Start with 1 instance, scale as needed
- Use 512MB memory (sufficient for most workloads)
- Monitor monthly usage

### Azure
- Use B1 tier for development
- Scale to P1V2 for production
- Enable auto-scaling

### Heroku
- Use Eco dyno for development ($5/month)
- Use Standard dyno for production ($25/month)

---

## Support

For deployment issues:
1. Check server logs
2. Verify environment variables
3. Test health endpoint
4. Check network connectivity
5. Review SAC Custom Widget logs

