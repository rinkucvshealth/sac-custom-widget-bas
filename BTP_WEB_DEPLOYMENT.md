# BTP Web Deployment Guide

## 🚀 Deploy Using BTP Cockpit (Web Interface)

Since CLI installation is having issues, here's how to deploy using the web interface:

### Step 1: Access BTP Cockpit
1. Go to: https://cockpit.btp.cloud.sap/
2. Login with your BTP credentials
3. Navigate to your subaccount

### Step 2: Create Cloud Foundry Environment
1. Go to **Cloud Foundry** → **Spaces**
2. Create a new space (e.g., "dev" or "production")
3. Note down your **API endpoint** and **org/space**

### Step 3: Prepare Your Application
Your application is already built and ready. The key files are:
- `dist/` folder (compiled JavaScript)
- `manifest.yml` (deployment configuration)
- `package.json` (dependencies)

### Step 4: Deploy via Web Interface
1. In BTP Cockpit, go to **Cloud Foundry** → **Applications**
2. Click **Create Application**
3. Choose **Upload Application**
4. Upload your application files

### Step 5: Configure Environment Variables
Set these environment variables in the web interface:
```
NODE_ENV=production
PORT=8080
SAP_HOST=vhssnds4ci.hec.sonos.com
SAP_PORT=44300
SAP_CLIENT=500
SAP_USERNAME=AIDATABOT
SAP_PASSWORD=<REPLACE_WITH_SAP_PASSWORD>
OPENAI_API_KEY=<REPLACE_WITH_OPENAI_API_KEY>
API_KEY=<REPLACE_WITH_WIDGET_API_KEY>
ALLOWED_ORIGIN=https://sonos.us10.sapanalytics.cloud/sap
```

### Step 6: Create Services
Create these services in BTP Cockpit:
1. **HANA Database**: `hana` service, `hdi-shared` plan
2. **UAA Service**: `xsuaa` service, `application` plan

### Step 7: Bind Services
Bind the services to your application in the web interface.

### Step 8: Start Application
Start your application and note the URL.

## 🎯 Benefits of Web Interface
- ✅ No CLI installation required
- ✅ Visual interface for configuration
- ✅ Built-in monitoring and logging
- ✅ Easy service management
- ✅ Automatic scaling options

## 📋 Next Steps After Deployment
1. Test your application URL
2. Configure SAC to use your widget
3. Set up monitoring and alerts
4. Configure custom domains if needed

## 🔧 Troubleshooting
- Check application logs in BTP Cockpit
- Verify environment variables are set correctly
- Ensure services are properly bound
- Check network connectivity to SAP system


