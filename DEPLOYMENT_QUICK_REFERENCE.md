# 🚀 Quick Deployment Reference

## One-Command Deployment

```powershell
.\deploy-to-btp.ps1
```

This script will guide you through the entire deployment process.

---

## Manual Deployment (Quick Steps)

### 1. Build
```powershell
npm install
npm run build
```

### 2. Login to Cloud Foundry
```powershell
cf login -a https://api.cf.us10.hana.ondemand.com
```

### 3. Deploy
```powershell
cf push --no-start
```

### 4. Set Environment Variables
```powershell
cf set-env sac-custom-widget SAP_HOST "vhssnds4ci.hec.sonos.com"
cf set-env sac-custom-widget SAP_PORT "44300"
cf set-env sac-custom-widget SAP_CLIENT "500"
cf set-env sac-custom-widget SAP_USERNAME "CDS_VIEWS_PY"
cf set-env sac-custom-widget SAP_PASSWORD "your_password"
cf set-env sac-custom-widget OPENAI_API_KEY "your_openai_key"
cf set-env sac-custom-widget API_KEY "6b429687b35c3756bf6f99db7e884d36fadcc4c752e4ca336f4f03955ab4c22a"
cf set-env sac-custom-widget NODE_ENV "production"
cf set-env sac-custom-widget PORT "8080"
cf set-env sac-custom-widget ALLOWED_ORIGIN "https://sonos-q.us10.hcs.cloud.sap"
```

### 5. Start
```powershell
cf start sac-custom-widget
```

### 6. Get URL
```powershell
cf apps | findstr sac-custom-widget
```

---

## Update Widget Configuration

After deployment, update `widget/widget-rinku.json`:

```json
{
  "properties": {
    "apiEndpoint": {
      "default": "https://YOUR-APP-URL.cfapps.us10.hana.ondemand.com/api"
    }
  },
  "webcomponents": [{
    "url": "https://YOUR-APP-URL.cfapps.us10.hana.ondemand.com/widget/widget-rinku.js?v=6.14.0"
  }]
}
```

---

## Common Commands

```powershell
# View logs
cf logs sac-custom-widget --recent

# Check status
cf apps

# Restart
cf restart sac-custom-widget

# View environment
cf env sac-custom-widget

# Update after code changes
npm run build
cf push
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check Node.js version (18.x) |
| Login fails | Verify BTP credentials |
| App won't start | Check logs: `cf logs sac-custom-widget --recent` |
| CORS errors | Verify `ALLOWED_ORIGIN` matches SAC URL |
| Widget not loading | Check widget URL is accessible in browser |

---

For detailed instructions, see: **BTP_DEPLOYMENT_STEP_BY_STEP.md**

