# Set Environment Variables for BTP Deployment
# Run this after initial deployment

Write-Host "⚙️ Setting environment variables for SAC Custom Widget..." -ForegroundColor Green

# SAP Configuration
cf set-env sac-custom-widget SAP_HOST "vhssnds4ci.hec.sonos.com"
cf set-env sac-custom-widget SAP_PORT "44300"
cf set-env sac-custom-widget SAP_CLIENT "500"
cf set-env sac-custom-widget SAP_USERNAME "AIDATABOT"
cf set-env sac-custom-widget SAP_PASSWORD "Welcome@2025"

# OpenAI Configuration
cf set-env sac-custom-widget OPENAI_API_KEY "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"

# Server Configuration
cf set-env sac-custom-widget API_KEY "6b429687b35c3756bf6f99db7e884d36fadcc4c752e4ca336f4f03955ab4c22a"
cf set-env sac-custom-widget ALLOWED_ORIGIN "https://sonos.us10.sapanalytics.cloud/sap"

# Environment
cf set-env sac-custom-widget NODE_ENV "production"
cf set-env sac-custom-widget LOG_LEVEL "info"

Write-Host "✅ Environment variables set successfully!" -ForegroundColor Green
Write-Host "🔄 Restarting application..." -ForegroundColor Yellow

cf restart sac-custom-widget

Write-Host "✅ Application restarted with new environment variables!" -ForegroundColor Green


