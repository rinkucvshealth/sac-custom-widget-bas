# SAP BTP Deployment Script - Complete Guide
# This script guides you through deploying your SAC Custom Widget to SAP BTP

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SAP BTP Deployment Script" -ForegroundColor Cyan
Write-Host "  SAC Custom Widget - Rinku" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Prerequisites
Write-Host "Step 1: Checking Prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js not found. Please install Node.js 18.x" -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "  ✓ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ npm not found" -ForegroundColor Red
    exit 1
}

# Check Cloud Foundry CLI
try {
    $cfVersion = cf --version 2>$null
    Write-Host "  ✓ Cloud Foundry CLI found: $cfVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Cloud Foundry CLI not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Please install Cloud Foundry CLI:" -ForegroundColor Yellow
    Write-Host "  1. Download from: https://github.com/cloudfoundry/cli/releases/latest" -ForegroundColor White
    Write-Host "  2. Run the installer" -ForegroundColor White
    Write-Host "  3. Restart PowerShell and run this script again" -ForegroundColor White
    exit 1
}

Write-Host ""

# Step 2: Build Application
Write-Host "Step 2: Building Application..." -ForegroundColor Yellow
Write-Host "  Running: npm install" -ForegroundColor Gray
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ npm install failed" -ForegroundColor Red
    exit 1
}

Write-Host "  Running: npm run build" -ForegroundColor Gray
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "  ✓ Build successful" -ForegroundColor Green
Write-Host ""

# Step 3: Check Cloud Foundry Login
Write-Host "Step 3: Checking Cloud Foundry Authentication..." -ForegroundColor Yellow
$cfTarget = cf target 2>&1
if ($LASTEXITCODE -ne 0 -or $cfTarget -match "Not logged in") {
    Write-Host "  ⚠ Not logged in to Cloud Foundry" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Please login to Cloud Foundry:" -ForegroundColor Cyan
    Write-Host "  cf login -a https://api.cf.us10.hana.ondemand.com" -ForegroundColor White
    Write-Host ""
    Write-Host "  Replace 'us10' with your region if different" -ForegroundColor Gray
    Write-Host ""
    $continue = Read-Host "  Press Enter after you've logged in, or 'q' to quit"
    if ($continue -eq 'q') {
        exit 0
    }
} else {
    Write-Host "  ✓ Logged in to Cloud Foundry" -ForegroundColor Green
    Write-Host "  $cfTarget" -ForegroundColor Gray
}
Write-Host ""

# Step 4: Get Environment Variables
Write-Host "Step 4: Environment Variables Configuration" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Please provide the following information:" -ForegroundColor Cyan
Write-Host "  (Press Enter to use default values shown in brackets)" -ForegroundColor Gray
Write-Host ""

$sapHost = Read-Host "  SAP Host [vhssnds4ci.hec.sonos.com]"
if ([string]::IsNullOrWhiteSpace($sapHost)) { $sapHost = "vhssnds4ci.hec.sonos.com" }

$sapPort = Read-Host "  SAP Port [44300]"
if ([string]::IsNullOrWhiteSpace($sapPort)) { $sapPort = "44300" }

$sapClient = Read-Host "  SAP Client [500]"
if ([string]::IsNullOrWhiteSpace($sapClient)) { $sapClient = "500" }

$sapUsername = Read-Host "  SAP Username [CDS_VIEWS_PY]"
if ([string]::IsNullOrWhiteSpace($sapUsername)) { $sapUsername = "CDS_VIEWS_PY" }

$sapPassword = Read-Host "  SAP Password" -AsSecureString
$sapPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sapPassword))

$openaiKey = Read-Host "  OpenAI API Key" -AsSecureString
$openaiKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($openaiKey))

$apiKey = Read-Host "  API Key [<REPLACE_WITH_WIDGET_API_KEY>]"
if ([string]::IsNullOrWhiteSpace($apiKey)) { $apiKey = "<REPLACE_WITH_WIDGET_API_KEY>" }

$allowedOrigin = Read-Host "  SAC Tenant URL [https://sonos-q.us10.hcs.cloud.sap]"
if ([string]::IsNullOrWhiteSpace($allowedOrigin)) { $allowedOrigin = "https://sonos-q.us10.hcs.cloud.sap" }

Write-Host ""
Write-Host "  ✓ Environment variables collected" -ForegroundColor Green
Write-Host ""

# Step 5: Deploy Application
Write-Host "Step 5: Deploying Application to Cloud Foundry..." -ForegroundColor Yellow
Write-Host "  This may take a few minutes..." -ForegroundColor Gray
Write-Host ""

Write-Host "  Running: cf push --no-start" -ForegroundColor Gray
cf push --no-start
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Deployment failed" -ForegroundColor Red
    Write-Host "  Check the error messages above" -ForegroundColor Yellow
    exit 1
}

Write-Host "  ✓ Application deployed (not started yet)" -ForegroundColor Green
Write-Host ""

# Step 6: Set Environment Variables
Write-Host "Step 6: Setting Environment Variables..." -ForegroundColor Yellow

Write-Host "  Setting SAP connection variables..." -ForegroundColor Gray
cf set-env sac-custom-widget SAP_HOST $sapHost
cf set-env sac-custom-widget SAP_PORT $sapPort
cf set-env sac-custom-widget SAP_CLIENT $sapClient
cf set-env sac-custom-widget SAP_USERNAME $sapUsername
cf set-env sac-custom-widget SAP_PASSWORD $sapPasswordPlain

Write-Host "  Setting OpenAI API key..." -ForegroundColor Gray
cf set-env sac-custom-widget OPENAI_API_KEY $openaiKeyPlain

Write-Host "  Setting server configuration..." -ForegroundColor Gray
cf set-env sac-custom-widget API_KEY $apiKey
cf set-env sac-custom-widget NODE_ENV "production"
cf set-env sac-custom-widget PORT "8080"
cf set-env sac-custom-widget ALLOWED_ORIGIN $allowedOrigin

Write-Host "  ✓ Environment variables set" -ForegroundColor Green
Write-Host ""

# Step 7: Start Application
Write-Host "Step 7: Starting Application..." -ForegroundColor Yellow
cf start sac-custom-widget
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Failed to start application" -ForegroundColor Red
    Write-Host "  Check logs: cf logs sac-custom-widget --recent" -ForegroundColor Yellow
    exit 1
}

Write-Host "  ✓ Application started" -ForegroundColor Green
Write-Host ""

# Step 8: Get Application URL
Write-Host "Step 8: Getting Application Information..." -ForegroundColor Yellow
$appInfo = cf app sac-custom-widget
$appUrl = ($appInfo | Select-String -Pattern "routes:\s*(https://[^\s]+)").Matches.Groups[1].Value

if ([string]::IsNullOrWhiteSpace($appUrl)) {
    Write-Host "  ⚠ Could not automatically detect URL" -ForegroundColor Yellow
    Write-Host "  Run: cf apps | findstr sac-custom-widget" -ForegroundColor Cyan
} else {
    Write-Host "  ✓ Application URL: $appUrl" -ForegroundColor Green
}

Write-Host ""

# Step 9: Test Application
Write-Host "Step 9: Testing Application..." -ForegroundColor Yellow
if (-not [string]::IsNullOrWhiteSpace($appUrl)) {
    $healthUrl = "$appUrl/health"
    Write-Host "  Testing health endpoint: $healthUrl" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $healthUrl -Method GET -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ Health check passed" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Health check returned status: $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ⚠ Could not reach health endpoint" -ForegroundColor Yellow
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
} else {
    Write-Host "  ⚠ Skipping health check (URL not detected)" -ForegroundColor Yellow
}

Write-Host ""

# Step 10: Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not [string]::IsNullOrWhiteSpace($appUrl)) {
    Write-Host "Application URL: $appUrl" -ForegroundColor White
    Write-Host ""
    Write-Host "Widget Files:" -ForegroundColor Cyan
    Write-Host "  - Widget JS: $appUrl/widget/widget-rinku.js" -ForegroundColor White
    Write-Host "  - Widget JSON: $appUrl/widget/widget-rinku.json" -ForegroundColor White
    Write-Host ""
    Write-Host "API Endpoint: $appUrl/api" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Update widget-rinku.json with the API endpoint URL" -ForegroundColor White
Write-Host "  2. Upload widget-rinku.json to SAC" -ForegroundColor White
Write-Host "  3. Configure widget in your SAC story" -ForegroundColor White
Write-Host "  4. Test the widget functionality" -ForegroundColor White
Write-Host ""

Write-Host "Useful Commands:" -ForegroundColor Yellow
Write-Host "  - View logs: cf logs sac-custom-widget --recent" -ForegroundColor White
Write-Host "  - Check status: cf apps" -ForegroundColor White
Write-Host "  - Restart app: cf restart sac-custom-widget" -ForegroundColor White
Write-Host "  - View env vars: cf env sac-custom-widget" -ForegroundColor White
Write-Host ""

Write-Host "For detailed instructions, see: BTP_DEPLOYMENT_STEP_BY_STEP.md" -ForegroundColor Cyan
Write-Host ""

# Clean up sensitive variables
$sapPasswordPlain = $null
$openaiKeyPlain = $null

