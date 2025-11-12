# SAP BTP Cloud Foundry Autoscaling Setup Script
# This script configures automatic scaling for the SAC Custom Widget application

Write-Host "🚀 Starting Cloud Foundry Autoscaling Setup..." -ForegroundColor Green

# Step 1: Check Cloud Foundry CLI
Write-Host "`n📋 Checking Cloud Foundry CLI..." -ForegroundColor Yellow
try {
    $cfVersion = cf --version 2>$null
    Write-Host "✅ Cloud Foundry CLI found: $cfVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Cloud Foundry CLI not found. Please install it first." -ForegroundColor Red
    exit 1
}

# Step 2: Check if autoscaling plugin is installed
Write-Host "`n📋 Checking for Autoscaler Plugin..." -ForegroundColor Yellow
try {
    $pluginOutput = cf plugins 2>$null | Select-String "autoscaling"
    if ($pluginOutput) {
        Write-Host "✅ Autoscaler Plugin found" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  Autoscaler Plugin not found. Installing..." -ForegroundColor Yellow
        Write-Host "   Installing AutoScaler plugin from CF-Community repository..." -ForegroundColor Cyan
        cf install-plugin -r CF-Community "AutoScaler" -f
        Write-Host "✅ Autoscaler Plugin installed successfully" -ForegroundColor Green
    }
}
catch {
    Write-Host "❌ Failed to install autoscaler plugin. Please install manually:" -ForegroundColor Red
    Write-Host "   Run: cf install-plugin -r CF-Community 'AutoScaler' -f" -ForegroundColor Cyan
    exit 1
}

# Step 3: Target the correct Cloud Foundry space
Write-Host "`n📋 Checking Cloud Foundry target..." -ForegroundColor Yellow
cf target

# Step 4: Create autoscaling service instance (if not exists)
Write-Host "`n📋 Creating Autoscaling Service..." -ForegroundColor Yellow
try {
    $services = cf services 2>$null
    if ($services -match "sac-widget-autoscaler") {
        Write-Host "✅ Autoscaling service already exists" -ForegroundColor Green
    }
    else {
        Write-Host "   Creating autoscaling service instance..." -ForegroundColor Cyan
        cf create-service autoscaler standard sac-widget-autoscaler
        Write-Host "✅ Autoscaling service created successfully" -ForegroundColor Green
    }
}
catch {
    Write-Host "❌ Failed to create autoscaling service. Error: $_" -ForegroundColor Red
    exit 1
}

# Step 5: Bind autoscaling service to application
Write-Host "`n📋 Binding Autoscaling Service to Application..." -ForegroundColor Yellow
try {
    Write-Host "   Binding sac-widget-autoscaler to sac-custom-widget..." -ForegroundColor Cyan
    cf bind-service sac-custom-widget sac-widget-autoscaler
    Write-Host "✅ Autoscaling service bound successfully" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Binding failed. It may already be bound or app doesn't exist yet." -ForegroundColor Yellow
    Write-Host "   Continuing with policy creation..." -ForegroundColor Cyan
}

# Step 6: Create autoscaling policy
Write-Host "`n📋 Creating Autoscaling Policy..." -ForegroundColor Yellow
if (Test-Path "autoscaling-policy.json") {
    try {
        Write-Host "   Applying autoscaling policy from autoscaling-policy.json..." -ForegroundColor Cyan
        cf autoscaling-policy sac-custom-widget autoscaling-policy.json
        Write-Host "✅ Autoscaling policy applied successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to apply autoscaling policy. Error: $_" -ForegroundColor Red
        Write-Host "   You can apply it manually with:" -ForegroundColor Cyan
        Write-Host "   cf autoscaling-policy sac-custom-widget autoscaling-policy.json" -ForegroundColor Yellow
    }
}
else {
    Write-Host "❌ autoscaling-policy.json not found" -ForegroundColor Red
    Write-Host "   Please ensure the policy file exists in the current directory" -ForegroundColor Yellow
}

# Step 7: Display autoscaling status
Write-Host "`n📊 Displaying Autoscaling Status..." -ForegroundColor Yellow
try {
    cf autoscaling-metric sac-custom-widget
}
catch {
    Write-Host "   Getting autoscaling status..." -ForegroundColor Cyan
}

# Step 8: Summary
Write-Host "`n✅ Autoscaling setup completed!" -ForegroundColor Green
Write-Host "`n📋 Summary of autoscaling configuration:" -ForegroundColor Cyan
Write-Host "   • Min instances: 1" -ForegroundColor White
Write-Host "   • Max instances: 5" -ForegroundColor White
Write-Host "   • Scale up when: CPU/Memory > 70%" -ForegroundColor White
Write-Host "   • Scale down when: CPU/Memory < 30%" -ForegroundColor White
Write-Host "   • Business hours (9am-5pm, M-F): Min 2 instances" -ForegroundColor White
Write-Host "`n💡 Useful commands:" -ForegroundColor Cyan
Write-Host "   • View metrics: cf autoscaling-metric sac-custom-widget" -ForegroundColor Yellow
Write-Host "   • View policy:  cf autoscaling-policy sac-custom-widget" -ForegroundColor Yellow
Write-Host "   • Delete policy: cf delete-autoscaling-policy sac-custom-widget" -ForegroundColor Yellow
Write-Host "`n"






