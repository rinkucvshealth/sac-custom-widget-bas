# BTP Deployment - Step by Step
Write-Host "Starting BTP Deployment..." -ForegroundColor Green

# Step 1: Build
Write-Host "Building application..." -ForegroundColor Yellow
npm run build

# Step 2: Check CF CLI
Write-Host "Checking Cloud Foundry CLI..." -ForegroundColor Yellow
$cfCheck = Get-Command cf -ErrorAction SilentlyContinue
if ($cfCheck) {
    Write-Host "Cloud Foundry CLI found" -ForegroundColor Green
} else {
    Write-Host "Cloud Foundry CLI not found. Please install manually." -ForegroundColor Red
    Write-Host "Download from: https://github.com/cloudfoundry/cli/releases/latest" -ForegroundColor Cyan
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 3: Login prompt
Write-Host "Please login to Cloud Foundry first:" -ForegroundColor Yellow
Write-Host "cf login -a https://api.cf.us10.hana.ondemand.com" -ForegroundColor Cyan
Read-Host "Press Enter after you have logged in"

# Step 4: Create services
Write-Host "Creating services..." -ForegroundColor Yellow
cf create-service hana hdi-shared sac-widget-db
cf create-service xsuaa application sac-widget-uaa -c '{"xsappname": "sac-custom-widget", "tenant-mode": "dedicated"}'

# Step 5: Deploy
Write-Host "Deploying application..." -ForegroundColor Yellow
cf push --no-start

# Step 6: Set environment variables
Write-Host "Setting environment variables..." -ForegroundColor Yellow
cf set-env sac-custom-widget NODE_ENV production
cf set-env sac-custom-widget PORT 8080
cf set-env sac-custom-widget SAP_HOST "vhssnds4ci.hec.sonos.com"
cf set-env sac-custom-widget SAP_PORT "44300"
cf set-env sac-custom-widget SAP_CLIENT "500"
cf set-env sac-custom-widget SAP_USERNAME "AIDATABOT"
cf set-env sac-custom-widget SAP_PASSWORD "<REPLACE_WITH_SAP_PASSWORD>"
cf set-env sac-custom-widget OPENAI_API_KEY "<REPLACE_WITH_OPENAI_API_KEY>"
cf set-env sac-custom-widget API_KEY "<REPLACE_WITH_WIDGET_API_KEY>"
cf set-env sac-custom-widget ALLOWED_ORIGIN "https://sonos.us10.sapanalytics.cloud/sap"

# Step 7: Bind and start
Write-Host "Binding services and starting..." -ForegroundColor Yellow
cf bind-service sac-custom-widget sac-widget-db
cf bind-service sac-custom-widget sac-widget-uaa
cf start sac-custom-widget

# Step 8: Show results
Write-Host "Deployment completed!" -ForegroundColor Green
cf apps


