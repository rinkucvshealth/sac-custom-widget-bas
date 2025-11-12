# 🚀 SAP BTP Deployment Guide - Step by Step

Complete guide to deploy your SAC Custom Widget to SAP BTP Cloud Foundry.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **SAP BTP Account** with Cloud Foundry environment enabled
- [ ] **Cloud Foundry CLI** installed ([Download here](https://github.com/cloudfoundry/cli/releases))
- [ ] **Node.js 18.x** installed
- [ ] **npm** installed
- [ ] Access to your SAP S/4HANA system credentials
- [ ] OpenAI API key (if using AI features)
- [ ] Your SAC tenant URL

---

## 🔧 Step 1: Install Cloud Foundry CLI

### For Windows:

1. Download the installer from: https://github.com/cloudfoundry/cli/releases/latest
2. Run the installer (`cf-cli-installer.msi`)
3. Verify installation:
   ```powershell
   cf --version
   ```

### For Mac/Linux:

```bash
# Mac (using Homebrew)
brew install cloudfoundry/tap/cf-cli

# Or download binary
wget https://github.com/cloudfoundry/cli/releases/download/v8.x.x/cf-cli_8.x.x_linux_x86-64.tgz
tar -xzf cf-cli_8.x.x_linux_x86-64.tgz
sudo mv cf /usr/local/bin/
```

---

## 🔐 Step 2: Login to SAP BTP Cloud Foundry

1. **Get your Cloud Foundry API endpoint:**
   - Log in to SAP BTP Cockpit: https://cockpit.btp.cloud.sap
   - Navigate to your **Subaccount**
   - Go to **Cloud Foundry** → **Spaces**
   - Click on your space
   - Note the **API Endpoint** (e.g., `https://api.cf.us10.hana.ondemand.com`)

2. **Login via CLI:**
   ```powershell
   cf login -a https://api.cf.us10.hana.ondemand.com
   ```
   
   You'll be prompted for:
   - **Email**: Your BTP account email
   - **Password**: Your BTP account password
   - **Org**: Select your organization
   - **Space**: Select your space (usually `dev`, `test`, or `prod`)

3. **Verify login:**
   ```powershell
   cf target
   ```
   
   You should see your org and space information.

---

## 📦 Step 3: Build Your Application

1. **Navigate to your project directory:**
   ```powershell
   cd C:\sac-custom-widget-rinku
   ```

2. **Install dependencies (if not already done):**
   ```powershell
   npm install
   ```

3. **Build the TypeScript application:**
   ```powershell
   npm run build
   ```
   
   This creates the `dist/` folder with compiled JavaScript files.

4. **Verify build:**
   ```powershell
   dir dist
   ```
   
   You should see `server.js` and other compiled files.

---

## ⚙️ Step 4: Prepare Environment Variables

Before deploying, gather these values:

| Variable | Description | Example |
|----------|-------------|---------|
| `SAP_HOST` | Your SAP S/4HANA hostname | `vhssnds4ci.hec.sonos.com` |
| `SAP_PORT` | SAP port (usually 44300 for HTTPS) | `44300` |
| `SAP_CLIENT` | SAP client number | `500` |
| `SAP_USERNAME` | SAP username | `CDS_VIEWS_PY` |
| `SAP_PASSWORD` | SAP password | `your_password` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-...` |
| `API_KEY` | API key for widget authentication | `6b429687b35c3756bf6f99db7e884d36fadcc4c752e4ca336f4f03955ab4c22a` |
| `ALLOWED_ORIGIN` | Your SAC tenant URL | `https://sonos-q.us10.hcs.cloud.sap` |

---

## 🚀 Step 5: Deploy to Cloud Foundry

### Option A: Simple Deployment (Recommended for First Time)

1. **Deploy using manifest file:**
   ```powershell
   cf push --no-start
   ```
   
   This uses `manifest.yml` or `manifest-simple.yml` in your project.

2. **Set environment variables:**
   ```powershell
   # SAP Connection
   cf set-env sac-custom-widget SAP_HOST "vhssnds4ci.hec.sonos.com"
   cf set-env sac-custom-widget SAP_PORT "44300"
   cf set-env sac-custom-widget SAP_CLIENT "500"
   cf set-env sac-custom-widget SAP_USERNAME "CDS_VIEWS_PY"
   cf set-env sac-custom-widget SAP_PASSWORD "your_sap_password"
   
   # OpenAI
   cf set-env sac-custom-widget OPENAI_API_KEY "your_openai_api_key"
   
   # Server Configuration
   cf set-env sac-custom-widget API_KEY "6b429687b35c3756bf6f99db7e884d36fadcc4c752e4ca336f4f03955ab4c22a"
   cf set-env sac-custom-widget NODE_ENV "production"
   cf set-env sac-custom-widget PORT "8080"
   cf set-env sac-custom-widget ALLOWED_ORIGIN "https://sonos-q.us10.hcs.cloud.sap"
   ```

3. **Start the application:**
   ```powershell
   cf start sac-custom-widget
   ```

### Option B: Using PowerShell Script

1. **Edit the deployment script** (`deploy-simple.ps1`) with your credentials
2. **Run the script:**
   ```powershell
   .\deploy-simple.ps1
   ```

---

## 🔍 Step 6: Verify Deployment

1. **Check application status:**
   ```powershell
   cf apps
   ```
   
   Look for `sac-custom-widget` with status `started`.

2. **Get application URL:**
   ```powershell
   cf apps | findstr sac-custom-widget
   ```
   
   Or check the routes:
   ```powershell
   cf routes
   ```
   
   Your app URL will be: `https://sac-custom-widget.cfapps.us10.hana.ondemand.com`

3. **Test the health endpoint:**
   ```powershell
   curl https://sac-custom-widget.cfapps.us10.hana.ondemand.com/health
   ```
   
   Or open in browser: `https://sac-custom-widget.cfapps.us10.hana.ondemand.com/health`
   
   Expected response: `{"status":"ok"}`

4. **Test the API endpoint:**
   ```powershell
   curl -X POST https://sac-custom-widget.cfapps.us10.hana.ondemand.com/api/chat/query `
     -H "Content-Type: application/json" `
     -H "X-API-Key: 6b429687b35c3756bf6f99db7e884d36fadcc4c752e4ca336f4f03955ab4c22a" `
     -d '{\"query\":\"test\",\"sessionId\":\"test123\"}'
   ```

5. **Check application logs:**
   ```powershell
   cf logs sac-custom-widget --recent
   ```
   
   Look for any errors or warnings.

---

## 📝 Step 7: Update Widget Configuration

1. **Get your deployed application URL:**
   ```powershell
   cf apps | findstr sac-custom-widget
   ```
   
   Example: `https://sac-custom-widget.cfapps.us10.hana.ondemand.com`

2. **Update `widget/widget-rinku.json`:**
   
   Update the `apiEndpoint` property:
   ```json
   "properties": {
     "apiEndpoint": {
       "type": "string",
       "description": "API endpoint URL",
       "default": "https://sac-custom-widget.cfapps.us10.hana.ondemand.com/api"
     }
   }
   ```

3. **Update the widget URL in `widget-rinku.json`:**
   ```json
   "webcomponents": [
     {
       "kind": "main",
       "tag": "sap-chatbot-widget-rinku",
       "url": "https://sac-custom-widget.cfapps.us10.hana.ondemand.com/widget/widget-rinku.js?v=6.14.0",
       "integrity": "",
       "ignoreIntegrity": true
     }
   ]
   ```

4. **Update `widget/widget-rinku.js`:**
   
   Update the default API endpoint (line 380):
   ```javascript
   this._apiEndpoint = 'https://sac-custom-widget.cfapps.us10.hana.ondemand.com/api';
   ```

---

## 📤 Step 8: Deploy Widget Files to BTP

You need to serve the widget files from your BTP application. The widget files should be accessible at:
- `https://sac-custom-widget.cfapps.us10.hana.ondemand.com/widget/widget-rinku.js`
- `https://sac-custom-widget.cfapps.us10.hana.ondemand.com/widget/widget-rinku.json`

### Option A: Include Widget Files in Deployment

1. **Ensure widget files are in the project:**
   - `widget/widget-rinku.js`
   - `widget/widget-rinku.json`

2. **Verify your server serves static files:**
   
   Check `src/server.ts` - it should have:
   ```typescript
   app.use('/widget', express.static(path.join(__dirname, '../widget')));
   ```

3. **Rebuild and redeploy:**
   ```powershell
   npm run build
   cf push
   ```

### Option B: Use a Separate Static File Hosting

If you prefer, you can host widget files separately (e.g., GitHub Pages, CDN).

---

## 🎯 Step 9: Upload Widget to SAC

1. **Open SAP Analytics Cloud:**
   - Navigate to: https://sonos-q.us10.hcs.cloud.sap/sap/fpa/ui/app.html#/home

2. **Go to Custom Widgets:**
   - Menu → **Application** → **Custom Widgets**

3. **Import Widget:**
   - Click **"Import Custom Widget"**
   - Upload `widget/widget-rinku.json`
   - Or provide the URL: `https://sac-custom-widget.cfapps.us10.hana.ondemand.com/widget/widget-rinku.json`

4. **Verify Widget:**
   - Widget should appear in the custom widgets list
   - Name: "SAP GL Account Analytics Chatbot Rinku"

---

## ✅ Step 10: Configure Widget in SAC Story

1. **Create or Open a Story:**
   - Application → Stories → Create New Story

2. **Add Widget:**
   - Insert → Custom Widget → Select "SAP GL Account Analytics Chatbot Rinku"

3. **Configure Widget Properties:**
   - **API Endpoint**: `https://sac-custom-widget.cfapps.us10.hana.ondemand.com/api`
   - **API Key**: `6b429687b35c3756bf6f99db7e884d36fadcc4c752e4ca336f4f03955ab4c22a`
   - **Width**: 400
   - **Height**: 600

4. **Test the Widget:**
   - Type a query: "Show me customer data"
   - Verify it connects to your API and returns data

---

## 🔄 Step 11: Update After Code Changes

When you make changes to your code:

1. **Rebuild:**
   ```powershell
   npm run build
   ```

2. **Redeploy:**
   ```powershell
   cf push
   ```

3. **Restart (if needed):**
   ```powershell
   cf restart sac-custom-widget
   ```

---

## 🛠️ Troubleshooting

### Issue: Application fails to start

**Solution:**
```powershell
# Check logs
cf logs sac-custom-widget --recent

# Check environment variables
cf env sac-custom-widget

# Verify all required env vars are set
```

### Issue: CORS errors in browser

**Solution:**
- Verify `ALLOWED_ORIGIN` includes your SAC tenant URL
- Check CORS configuration in `src/server.ts`
- Restart application after changing CORS settings

### Issue: Cannot connect to SAP

**Solution:**
- Verify SAP credentials are correct
- Check SAP system is accessible from BTP
- Review SAP connection logs: `cf logs sac-custom-widget --recent`

### Issue: Widget not loading in SAC

**Solution:**
- Verify widget URL is accessible: `https://sac-custom-widget.cfapps.us10.hana.ondemand.com/widget/widget-rinku.js`
- Check browser console for errors
- Verify widget JSON is valid
- Check CORS settings

### Issue: API returns 401/403 errors

**Solution:**
- Verify `API_KEY` environment variable matches the key used in widget
- Check API key in widget configuration matches server `API_KEY`

---

## 📊 Useful Commands

```powershell
# View all applications
cf apps

# View application details
cf app sac-custom-widget

# View environment variables
cf env sac-custom-widget

# View application logs (real-time)
cf logs sac-custom-widget

# View recent logs
cf logs sac-custom-widget --recent

# Restart application
cf restart sac-custom-widget

# Stop application
cf stop sac-custom-widget

# Start application
cf start sac-custom-widget

# Scale application
cf scale sac-custom-widget -i 2 -m 1G

# Delete application
cf delete sac-custom-widget

# View routes
cf routes

# View services
cf services
```

---

## 🔒 Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** regularly
4. **Use HTTPS** for all endpoints
5. **Configure CORS** properly (don't use `*` in production)
6. **Monitor logs** for suspicious activity
7. **Use BTP's credential store** for sensitive data

---

## 📈 Next Steps

1. **Set up monitoring** in BTP Cockpit
2. **Configure autoscaling** (see `setup-autoscaling.ps1`)
3. **Set up alerts** for application failures
4. **Create backup** of environment variables
5. **Document** your deployment process

---

## 🎉 Success Checklist

- [ ] Application deployed and running
- [ ] Health endpoint returns `{"status":"ok"}`
- [ ] API endpoint responds to test queries
- [ ] Widget files accessible via URL
- [ ] Widget uploaded to SAC
- [ ] Widget configured in SAC story
- [ ] Widget successfully queries SAP data
- [ ] No errors in logs

---

## 📞 Need Help?

- Check application logs: `cf logs sac-custom-widget --recent`
- Review BTP Cockpit for application status
- Check SAP BTP documentation: https://help.sap.com/docs/btp
- Review Cloud Foundry docs: https://docs.cloudfoundry.org

---

**Congratulations!** Your widget is now deployed and ready to use in SAP Analytics Cloud! 🎊

