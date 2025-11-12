# Autoscaling Configuration Guide

## Overview

The SAC Custom Widget application supports automatic scaling on SAP BTP Cloud Foundry to handle varying loads efficiently. This guide explains how to configure and manage autoscaling.

## Benefits

- **Automatic Resource Management**: The application automatically scales up during high demand and scales down during low usage
- **Cost Optimization**: Pay only for the resources actually used
- **Load Isolation**: Traffic is distributed across multiple application instances
- **S/4HANA Protection**: Prevents overwhelming the backend system by distributing requests

## Quick Setup

### Step 1: Install AutoScaler Plugin

```powershell
# Install the AutoScaler plugin from CF Community
cf install-plugin -r CF-Community "AutoScaler" -f
```

### Step 2: Create Autoscaling Service

```powershell
# Create the autoscaling service instance
cf create-service autoscaler standard sac-widget-autoscaler
```

### Step 3: Bind Service to Application

```powershell
# Bind the autoscaling service to your application
cf bind-service sac-custom-widget sac-widget-autoscaler

# Wait for service provisioning (can take 1-2 minutes)
```

### Step 4: Apply Autoscaling Policy

```powershell
# Apply the autoscaling policy
cf autoscaling-policy sac-custom-widget autoscaling-policy.json
```

### Alternative: Run Setup Script

For automated setup, simply run:

```powershell
.\setup-autoscaling.ps1
```

## Autoscaling Policy Configuration

### Current Policy (autoscaling-policy.json)

```json
{
  "instance_min_count": 1,
  "instance_max_count": 5,
  "scaling_rules": [
    {
      "metric_type": "cpu",
      "breach_duration_secs": 120,
      "threshold": 70,
      "operator": ">=",
      "cool_down_secs": 60,
      "adjustment": "+1"
    }
  ]
}
```

### Scaling Rules

#### CPU-Based Scaling
- **Scale Up**: When CPU usage >= 70% for 2 minutes, add 1 instance
- **Scale Down**: When CPU usage < 30% for 2 minutes, remove 1 instance
- **Cool-down Period**: 60 seconds (scale up) or 120 seconds (scale down)

#### Memory-Based Scaling
- **Scale Up**: When memory usage >= 70% for 2 minutes, add 1 instance
- **Scale Down**: When memory usage < 30% for 2 minutes, remove 1 instance

#### Throughput-Based Scaling
- **Scale Up**: When requests/second >= 100 for 2 minutes, add 1 instance
- **Scale Down**: When requests/second < 10 for 2 minutes, remove 1 instance

### Business Hours Schedule

The policy includes a recurring schedule for business hours (Monday-Friday, 9 AM - 5 PM Pacific):

```json
"schedules": {
  "timezone": "America/Los_Angeles",
  "recurring_schedule": [
    {
      "start_time": "09:00",
      "end_time": "17:00",
      "days_of_the_week": [1, 2, 3, 4, 5],
      "instance_min_count": 2,
      "instance_max_count": 5
    }
  ]
}
```

This ensures:
- **Business Hours**: Minimum 2 instances running (for high availability)
- **Off-Hours**: Minimum 1 instance running (for cost savings)

## Monitoring Autoscaling

### View Current Metrics

```powershell
# View real-time metrics
cf autoscaling-metric sac-custom-widget
```

This shows current CPU, memory, and throughput metrics for each instance.

### View Current Policy

```powershell
# View the active autoscaling policy
cf autoscaling-policy sac-custom-widget
```

### View Scaling History

```powershell
# View autoscaling events
cf autoscaling-history sac-custom-widget

# View recent autoscaling events with details
cf autoscaling-events sac-custom-widget --recent
```

### Monitor Application Instances

```powershell
# Check current instance count
cf app sac-custom-widget

# View detailed instance information
cf scale sac-custom-widget
```

## Adjusting Autoscaling

### Update Scaling Parameters

Edit `autoscaling-policy.json` and update the policy:

```powershell
# Apply updated policy
cf autoscaling-policy sac-custom-widget autoscaling-policy.json

# Verify the update
cf autoscaling-policy sac-custom-widget
```

### Increase Max Instances

To handle higher peak loads, increase `instance_max_count`:

```json
"instance_max_count": 10  // Scale up to 10 instances
```

### Adjust Thresholds

Fine-tune when scaling occurs by adjusting thresholds:

```json
{
  "metric_type": "cpu",
  "threshold": 80,  // Scale up at 80% instead of 70%
  "adjustment": "+2"  // Add 2 instances instead of 1
}
```

### Add Custom Schedules

Add additional schedules for specific periods:

```json
"schedules": {
  "recurring_schedule": [
    {
      "start_time": "09:00",
      "end_time": "17:00",
      "days_of_the_week": [1, 2, 3, 4, 5],
      "instance_min_count": 3,  // Weekday minimum
      "instance_max_count": 8
    },
    {
      "start_time": "09:00",
      "end_time": "17:00",
      "days_of_the_week": [0, 6],
      "instance_min_count": 1,  // Weekend minimum
      "instance_max_count": 3
    }
  ]
}
```

## Troubleshooting

### Autoscaling Not Working

1. **Check Plugin Installation**
   ```powershell
   cf plugins | Select-String "autoscaling"
   ```

2. **Verify Service is Bound**
   ```powershell
   cf services | Select-String "sac-widget-autoscaler"
   ```

3. **Check Service Status**
   ```powershell
   cf service sac-widget-autoscaler
   ```

4. **Verify Policy is Applied**
   ```powershell
   cf autoscaling-policy sac-custom-widget
   ```

### Scaling Too Aggressively

If the application is scaling too frequently:

1. **Increase Cool-Down Periods**
   ```json
   "cool_down_secs": 180  // Wait 3 minutes between scaling
   ```

2. **Adjust Breach Duration**
   ```json
   "breach_duration_secs": 300  // Require 5 minutes of threshold breach
   ```

### Scaling Not Responsive Enough

If scaling doesn't happen quickly enough:

1. **Decrease Thresholds**
   ```json
   "threshold": 60  // Scale at 60% instead of 70%
   ```

2. **Increase Adjustments**
   ```json
   "adjustment": "+2"  // Add 2 instances instead of 1
   ```

### Manual Override

To temporarily disable autoscaling:

```powershell
# Set fixed instance count
cf scale sac-custom-widget -i 3 -f  # -f forces instance count

# Re-enable autoscaling
cf autoscaling-policy sac-custom-widget autoscaling-policy.json
```

## Best Practices

1. **Monitor Regularly**: Check autoscaling metrics weekly
2. **Adjust Seasonally**: Update schedules for business cycles
3. **Test Scaling**: Monitor behavior during peak hours
4. **Set Alerts**: Configure BTP alerts for scaling events
5. **Document Changes**: Keep policy changes documented
6. **Review Costs**: Monitor costs vs. performance trade-offs

## Advanced Configuration

### Custom Metrics

You can add custom metrics by implementing application-level metrics:

```typescript
// In your application code
import { Counter } from '@sap/xs-logging';

const requestCounter = new Counter('requests_total');

// Track custom metrics
requestCounter.inc();
```

### Integration with BTP Monitoring

The autoscaling metrics integrate with SAP BTP monitoring services for comprehensive observability.

## Disabling Autoscaling

If you need to disable autoscaling:

```powershell
# Delete the autoscaling policy
cf delete-autoscaling-policy sac-custom-widget

# Unbind the service
cf unbind-service sac-custom-widget sac-widget-autoscaler

# Optional: Delete the service
cf delete-service sac-widget-autoscaler
```

## References

- [SAP BTP Autoscaling Documentation](https://help.sap.com/docs/autoscaler)
- [Cloud Foundry AutoScaler Plugin](https://github.com/cloudfoundry/app-autoscaler-cli-plugin)
- [Autoscaling Policy Schema](https://github.com/cloudfoundry/app-autoscaler/blob/master/docs/policy.md)






