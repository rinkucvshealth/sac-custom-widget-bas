# SAP BTP Deployment Guide

## Prerequisites

1. **SAP BTP Account** with Cloud Foundry environment
2. **BTP CLI** installed
3. **Cloud Foundry CLI** installed
4. **Node.js** and **npm** installed

## Quick Deployment

### 1. Install Required Tools

```powershell
# Install BTP CLI
choco install btp-cli

# Install Cloud Foundry CLI  
choco install cloudfoundry-cli
```

### 2. Authenticate

```powershell
# Login to BTP
btp login

# Login to Cloud Foundry
cf login -a https://api.cf.us10.hana.ondemand.com
```

### 3. Deploy Application

```powershell
# Run the deployment script
.\deploy-scripts.ps1

# Set environment variables
.\set-env-vars.ps1
```

## Manual Deployment Steps

### 1. Build Application
```powershell
npm run build
```

### 2. Create Services
```powershell
cf create-service hana hdi-shared sac-widget-db
cf create-service xsuaa application sac-widget-uaa -c xsuaa-config.json
```

### 3. Deploy Application
```powershell
cf push --no-start
```

### 4. Set Environment Variables
```powershell
cf set-env sac-custom-widget NODE_ENV production
cf set-env sac-custom-widget SAP_HOST "vhssnds4ci.hec.sonos.com"
cf set-env sac-custom-widget SAP_PORT "44300"
cf set-env sac-custom-widget SAP_CLIENT "500"
cf set-env sac-custom-widget SAP_USERNAME "AIDATABOT"
cf set-env sac-custom-widget SAP_PASSWORD "Welcome@2025"
cf set-env sac-custom-widget OPENAI_API_KEY "your-openai-key"
cf set-env sac-custom-widget API_KEY "your-api-key"
cf set-env sac-custom-widget ALLOWED_ORIGIN "https://sonos.us10.sapanalytics.cloud/sap"
```

### 5. Bind Services and Start
```powershell
cf bind-service sac-custom-widget sac-widget-db
cf bind-service sac-custom-widget sac-widget-uaa
cf start sac-custom-widget
```

## Post-Deployment

### 1. Get Application URL
```powershell
cf apps | findstr sac-custom-widget
```

### 2. Test Application
- Visit the application URL
- Test the `/health` endpoint
- Test the `/api/chat/query` endpoint

### 3. Configure SAC
- Upload widget files to SAC
- Configure widget in SAC applications
- Test widget functionality

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are installed
   - Verify TypeScript compilation

2. **Service Binding Issues**
   - Check service creation status: `cf services`
   - Verify service binding: `cf service sac-custom-widget`

3. **Environment Variables**
   - Check environment variables: `cf env sac-custom-widget`
   - Restart application after setting variables

4. **Authentication Issues**
   - Verify BTP login: `btp get accounts/global-account`
   - Check CF login: `cf target`

### Useful Commands

```powershell
# Check application status
cf apps

# View application logs
cf logs sac-custom-widget --recent

# Check environment variables
cf env sac-custom-widget

# Restart application
cf restart sac-custom-widget

# Scale application
cf scale sac-custom-widget -i 2 -m 1G
```

## Security Considerations

1. **Environment Variables**: Store sensitive data in BTP environment variables
2. **API Keys**: Use BTP's secure credential store
3. **CORS**: Configure allowed origins properly
4. **Rate Limiting**: Implement proper rate limiting
5. **Authentication**: Use BTP's UAA service for authentication

## Monitoring

1. **Application Logs**: Use `cf logs` to monitor application logs
2. **BTP Cockpit**: Monitor application health in BTP Cockpit
3. **Custom Metrics**: Implement custom metrics for monitoring
4. **Alerts**: Set up alerts for application failures

## Scaling

### Manual Scaling

```powershell
# Scale horizontally
cf scale sac-custom-widget -i 3

# Scale vertically  
cf scale sac-custom-widget -m 1G -k 2G
```

### Automatic Scaling (Recommended)

For production environments, configure automatic scaling to handle varying load automatically.

#### Setup Autoscaling

```powershell
# Run the autoscaling setup script
.\setup-autoscaling.ps1
```

This script will:
1. Install the AutoScaler Cloud Foundry plugin
2. Create the autoscaling service instance
3. Bind it to your application
4. Apply the autoscaling policy

#### Autoscaling Configuration

The application uses the policy defined in `autoscaling-policy.json`:

- **Instance Range**: 1 to 5 instances
- **Scale Up When**: CPU or Memory usage > 70% for 2 minutes
- **Scale Down When**: CPU or Memory usage < 30% for 2 minutes
- **Business Hours** (9 AM - 5 PM, Mon-Fri): Minimum 2 instances
- **Off-Hours**: Minimum 1 instance

#### Monitor Autoscaling

```powershell
# View autoscaling metrics
cf autoscaling-metric sac-custom-widget

# View current autoscaling policy
cf autoscaling-policy sac-custom-widget

# View autoscaling history
cf autoscaling-history sac-custom-widget

# View autoscaling events
cf autoscaling-events sac-custom-widget
```

#### Manual Autoscaling Commands

```powershell
# Check if autoscaling service is bound
cf services

# Update autoscaling policy
cf autoscaling-policy sac-custom-widget autoscaling-policy.json

# Delete autoscaling policy (disable autoscaling)
cf delete-autoscaling-policy sac-custom-widget

# Unbind autoscaling service
cf unbind-service sac-custom-widget sac-widget-autoscaler

# Delete autoscaling service
cf delete-service sac-widget-autoscaler
```


