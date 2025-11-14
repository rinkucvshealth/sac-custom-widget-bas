# Set Environment Variables for BTP Deployment
# Run this after initial deployment

Write-Host "⚙️ Setting environment variables for SAC Custom Widget..." -ForegroundColor Green

# SAP Configuration
cf set-env sac-custom-widget SAP_HOST "vhssnds4ci.hec.sonos.com"
cf set-env sac-custom-widget SAP_PORT "44300"
cf set-env sac-custom-widget SAP_CLIENT "500"
cf set-env sac-custom-widget SAP_USERNAME "AIDATABOT"
cf set-env sac-custom-widget SAP_PASSWORD "<REPLACE_WITH_SAP_PASSWORD>"

# OpenAI Configuration
cf set-env sac-custom-widget OPENAI_API_KEY "<REPLACE_WITH_OPENAI_API_KEY>"

# Server Configuration
cf set-env sac-custom-widget API_KEY "<REPLACE_WITH_WIDGET_API_KEY>"
cf set-env sac-custom-widget ALLOWED_ORIGIN "https://sonos.us10.sapanalytics.cloud/sap"

# Environment
cf set-env sac-custom-widget NODE_ENV "production"
cf set-env sac-custom-widget LOG_LEVEL "info"

Write-Host "✅ Environment variables set successfully!" -ForegroundColor Green
Write-Host "🔄 Restarting application..." -ForegroundColor Yellow

cf restart sac-custom-widget

Write-Host "✅ Application restarted with new environment variables!" -ForegroundColor Green


