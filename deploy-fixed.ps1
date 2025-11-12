# Simplified BTP Deployment Script - Fixed Version
Write-Host "🚀 Starting Simplified BTP Deployment..." -ForegroundColor Green

# Step 1: Build the application
Write-Host "📦 Building application..." -ForegroundColor Yellow
npm run build

# Step 2: Check if Cloud Foundry CLI is available
Write-Host "🔍 Checking Cloud Foundry CLI..." -ForegroundColor Yellow
try {
    $null = cf --version 2>$null
    Write-Host "✅ Cloud Foundry CLI found" -ForegroundColor Green
}
catch {
    Write-Host "❌ Cloud Foundry CLI not found. Please install it manually." -ForegroundColor Red
    Write-Host "📋 Manual installation steps:" -ForegroundColor Cyan
    Write-Host "   1. Download from: https://github.com/cloudfoundry/cli/releases/latest" -ForegroundColor White
    Write-Host "   2. Extract to C:\cf-cli\" -ForegroundColor White
    Write-Host "   3. Add C:\cf-cli to your PATH" -ForegroundColor White
    Write-Host "   4. Restart PowerShell and run this script again" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 3: Login to Cloud Foundry
Write-Host "🔐 Please login to Cloud Foundry..." -ForegroundColor Yellow
Write-Host "Run: cf login -a https://api.cf.us10.hana.ondemand.com" -ForegroundColor Cyan
Write-Host "Press Enter when you have completed the login..." -ForegroundColor Yellow
Read-Host

# Step 4: Create services
Write-Host "🔧 Creating BTP services..." -ForegroundColor Yellow
cf create-service hana hdi-shared sac-widget-db
cf create-service xsuaa application sac-widget-uaa -c '{"xsappname": "sac-custom-widget", "tenant-mode": "dedicated"}'

# Step 5: Deploy the application
Write-Host "🚀 Deploying application..." -ForegroundColor Yellow
cf push --no-start

# Step 6: Set environment variables
Write-Host "⚙️ Setting environment variables..." -ForegroundColor Yellow
cf set-env sac-custom-widget NODE_ENV production
cf set-env sac-custom-widget PORT 8080
cf set-env sac-custom-widget SAP_HOST "vhssnds4ci.hec.sonos.com"
cf set-env sac-custom-widget SAP_PORT "44300"
cf set-env sac-custom-widget SAP_CLIENT "500"
cf set-env sac-custom-widget SAP_USERNAME "AIDATABOT"
cf set-env sac-custom-widget SAP_PASSWORD "Welcome@2025"
cf set-env sac-custom-widget OPENAI_API_KEY "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"
cf set-env sac-custom-widget API_KEY "6b429687b35c3756bf6f99db7e884d36fadcc4c752e4ca336f4f03955ab4c22a"
cf set-env sac-custom-widget ALLOWED_ORIGIN "https://sonos.us10.sapanalytics.cloud/sap"

# Step 7: Bind services and start
Write-Host "🔗 Binding services and starting application..." -ForegroundColor Yellow
cf bind-service sac-custom-widget sac-widget-db
cf bind-service sac-custom-widget sac-widget-uaa
cf start sac-custom-widget

# Step 8: Get application URL
Write-Host "🌐 Getting application URL..." -ForegroundColor Yellow
cf apps

Write-Host "✅ Application deployed successfully!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Note the application URL from the output above" -ForegroundColor White
Write-Host "   2. Test the health endpoint: https://your-app-url/health" -ForegroundColor White
Write-Host "   3. Test the API endpoint: https://your-app-url/api/chat/query" -ForegroundColor White
Write-Host "   4. Configure SAC to use your widget" -ForegroundColor White


