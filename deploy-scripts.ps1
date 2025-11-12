# SAP BTP Deployment Script
# Run this script to deploy your SAC Custom Widget to BTP

Write-Host "🚀 Starting SAP BTP Deployment..." -ForegroundColor Green

# Step 1: Build the application
Write-Host "📦 Building application..." -ForegroundColor Yellow
npm run build

# Step 2: Login to BTP (if not already logged in)
Write-Host "🔐 Checking BTP authentication..." -ForegroundColor Yellow
btp --version

# Step 3: Login to Cloud Foundry
Write-Host "☁️ Logging into Cloud Foundry..." -ForegroundColor Yellow
cf login -a https://api.cf.us10.hana.ondemand.com

# Step 4: Create services
Write-Host "🔧 Creating BTP services..." -ForegroundColor Yellow
cf create-service hana hdi-shared sac-widget-db
cf create-service xsuaa application sac-widget-uaa -c '{
  "xsappname": "sac-custom-widget",
  "tenant-mode": "dedicated",
  "scopes": [
    {
      "name": "$XSAPPNAME.Display",
      "description": "Display access"
    },
    {
      "name": "$XSAPPNAME.Edit", 
      "description": "Edit access"
    }
  ],
  "role-templates": [
    {
      "name": "Viewer",
      "description": "View data",
      "scope-references": ["$XSAPPNAME.Display"]
    },
    {
      "name": "Editor",
      "description": "Edit data", 
      "scope-references": ["$XSAPPNAME.Display", "$XSAPPNAME.Edit"]
    }
  ]
}'

# Step 5: Deploy the application
Write-Host "🚀 Deploying application..." -ForegroundColor Yellow
cf push --no-start

# Step 6: Set environment variables
Write-Host "⚙️ Setting environment variables..." -ForegroundColor Yellow
cf set-env sac-custom-widget NODE_ENV production
cf set-env sac-custom-widget PORT 8080

# Step 7: Bind services
Write-Host "🔗 Binding services..." -ForegroundColor Yellow
cf bind-service sac-custom-widget sac-widget-db
cf bind-service sac-custom-widget sac-widget-uaa

# Step 8: Start the application
Write-Host "▶️ Starting application..." -ForegroundColor Yellow
cf start sac-custom-widget

# Step 9: Get application URL
Write-Host "🌐 Getting application URL..." -ForegroundColor Yellow
cf apps | findstr sac-custom-widget

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Set your SAP and OpenAI credentials using: cf set-env" -ForegroundColor White
Write-Host "   2. Test your application at the URL shown above" -ForegroundColor White
Write-Host "   3. Configure SAC to use your widget" -ForegroundColor White


