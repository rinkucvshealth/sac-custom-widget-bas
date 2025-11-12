# GL Account Aggregation - Deployment & Testing Guide

## ✅ What Needs to Be Deployed

### **Backend Only** (No Widget Upload Needed!)

**Good News:** The widget doesn't need to be refreshed! All changes are in the backend API. The widget already sends queries correctly.

**You only need to:**
1. ✅ Rebuild the backend TypeScript code (Already done ✅)
2. ✅ Redeploy the backend to BTP Cloud Foundry
3. ✅ Test with the query format below

## 🚀 Deployment Steps

### Step 1: Rebuild (Already Completed ✅)
```powershell
npm run build
```
✅ **Status:** Build completed successfully

### Step 2: Deploy to BTP Cloud Foundry

**Option A: Using PowerShell Script**
```powershell
.\deploy-scripts.ps1
```

**Option B: Manual Deployment**
```powershell
# Login to Cloud Foundry
cf login -a https://api.cf.us10.hana.ondemand.com

# Push the application
cf push sac-custom-widget

# Restart to ensure changes are loaded
cf restart sac-custom-widget
```

**Option C: Quick Deploy (if already configured)**
```powershell
cf push
```

### Step 3: Verify Deployment
```powershell
# Check application status
cf apps | findstr sac-custom-widget

# View recent logs
cf logs sac-custom-widget --recent
```

## 📝 Query Format for Testing

### **Exact Query to Match ACDOCA Table Results**

Use this natural language query in the widget:

```
sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L client 41000000
```

### **Alternative Query Formats** (all should work):

**Format 1: Natural Language**
```
What is the total amount for GL Account 41000000 in fiscal year 2026 for company code 1710?
```

**Format 2: More Explicit**
```
Sum the OSL amount for GL Account 41000000 where fiscal year is 2026 and company code is 1710 and ledger is 0L
```

**Format 3: Concise**
```
Total amount GL Account 41000000 year 2026 company 1710 ledger 0L
```

### **What Happens Automatically:**

1. ✅ System detects GL Account query
2. ✅ Maps filter names to technical names:
   - `GL Account` → RACCT
   - `fiscal year` → GJAHR
   - `company code` → RBUKRS
   - `ledger` → RLDNR
   - `client` → RCLNT
3. ✅ Uses OSL field for amount aggregation
4. ✅ Applies filters: RACCT=41000000, GJAHR=2026, RBUKRS=1710, RLDNR=0L, RCLNT=41000000
5. ✅ Calculates sum with 2-decimal precision
6. ✅ Returns: **-46049.72** (matching ACDOCA table)

## 🧪 Testing Checklist

### Test 1: Basic Aggregation
**Query:**
```
sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L
```

**Expected Result:**
- Summary: "SUM(Amount) for GLAccountLineItem: -46,049.72 (from X records)"
- Data: `{ "sum": -46049.72, "recordCount": 63 }`

### Test 2: Verify Field Mapping
**Query:**
```
sum OSL for GL Account where AccountNumber is 41000000 and FiscalYear is 2026
```

**Expected Result:**
- Should map AccountNumber → RACCT
- Should map FiscalYear → GJAHR
- Should use OSL field directly
- Result: -46049.72

### Test 3: Filter Combination
**Query:**
```
Show me total amount for GL Account 41000000
```
Then follow-up:
```
restrict for fiscal year 2026
```
Then follow-up:
```
and company code 1710
```

**Expected Result:**
- Filters should combine correctly
- Final result: -46049.72

## 📊 Expected Response Format

```json
{
  "success": true,
  "summary": "SUM(Amount) for GLAccountLineItem: -46,049.72 (from 63 records)",
  "data": [{
    "sum": -46049.72,
    "recordCount": 63
  }],
  "fields": ["sum", "recordCount"],
  "entity": "GLAccountLineItem",
  "serviceName": "API_GLACCOUNTLINEITEM",
  "recordCount": 1,
  "sessionId": "your-session-id"
}
```

## 🔍 Verification Steps

### Step 1: Compare with ACDOCA Table
1. Open SAP GUI → Transaction SE16N
2. Query table: **ACDOCA**
3. Apply filters:
   - RCLNT = 41000000
   - RACCT = 41000000
   - RLDNR = 0L
   - RBUKRS = 1710
   - GJAHR = 2026
4. Sum the **OSL** column
5. Result should be: **-46049.72**

### Step 2: Test via Widget
1. Open SAC dashboard with widget
2. Enter query: `sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L`
3. Compare result with ACDOCA table

### Step 3: Check Logs (if mismatch)
```powershell
# View backend logs
cf logs sac-custom-widget --recent | findstr "GL Account\|OSL\|aggregation\|filter"

# Look for:
# - "Mapped GL Account field..."
# - "Using primary amount field: OSL"
# - "Aggregation result: -46049.72"
```

## 🐛 Troubleshooting

### Issue: Result doesn't match ACDOCA

**Check:**
1. ✅ Filters are applied correctly (check logs)
2. ✅ OSL field is being used (check logs)
3. ✅ All records fetched (check recordCount)
4. ✅ Precision matches (should be 2 decimals)

**Debug Query:**
```
Show me GL Account 41000000 records for fiscal year 2026
```
This will show the actual records and fields available.

### Issue: Widget Not Updating

**Solution:** Widget doesn't need updating! It sends queries to the backend API which has all the changes.

**Verify API is updated:**
```powershell
# Check deployment date
cf app sac-custom-widget

# Restart if needed
cf restart sac-custom-widget
```

### Issue: Field Mapping Not Working

**Check:**
- Query contains GL Account keywords
- Filters are in natural language or technical names
- Check logs for "Mapped GL Account field" messages

## 📋 Summary

### ✅ What's Done:
- [x] Backend code compiled successfully
- [x] Field mapping implemented
- [x] OSL field prioritization
- [x] Aggregation precision matching SAP
- [x] Performance optimizations

### 🚀 What You Need to Do:
1. [ ] Deploy backend to BTP (`cf push`)
2. [ ] Test with query: `sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L`
3. [ ] Verify result matches ACDOCA: **-46049.72**

### ❌ What You DON'T Need:
- ❌ Re-upload widget to SAC (no changes needed)
- ❌ Modify widget code
- ❌ Update widget.json

## 🎯 Quick Test Command

After deployment, test directly:

```powershell
# Test API directly (optional)
curl -X POST https://sac-custom-widget.cfapps.us10.hana.ondemand.com/api/chat/query `
  -H "Content-Type: application/json" `
  -H "X-API-Key: your-api-key" `
  -d '{"query": "sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L"}'
```

Expected response should show `"sum": -46049.72`





