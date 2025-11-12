# Troubleshooting 400 Error - GL Account Aggregation

## Current Issue

The API is returning a 400 Bad Request error when querying GL Account data with filters.

## Enhanced Logging Deployed

I've added enhanced error logging that will show:
1. The exact OData query being sent
2. The $filter parameter
3. The detailed SAP error message

## Next Steps

### Step 1: Test Query Again
After deploying, run the query in the widget:
```
sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L
```

### Step 2: Check Logs for Details
```powershell
cf logs sac-custom-widget --recent | Select-String "OData|filter|Error|SAP Error"
```

Look for:
- `OData $filter:` - Shows the filter being sent
- `SAP Error Data:` - Shows what SAP rejected
- `Request params:` - Shows all query parameters

### Step 3: Possible Issues

#### Issue 1: Field Name Mismatch
The OData service might use different field names than the ACDOCA table:
- ACDOCA uses: RACCT, GJAHR, RBUKRS, RLDNR
- OData might use: GLAccount, FiscalYear, CompanyCode, Ledger

**Solution:** We may need to map differently for OData vs ACDOCA table

#### Issue 2: Filter Syntax
The $filter syntax might need adjustment:
- Current: `RACCT eq '41000000' and GJAHR eq '2026'`
- Might need: Different quote/format

#### Issue 3: Field Doesn't Exist
The mapped field names might not exist in the OData service

**Solution:** Query metadata to get actual field names

### Step 4: Test Without Filters First
Try a simple query to see if basic access works:
```
Show me GL Account records
```

Then add filters one by one to isolate the issue.

## Quick Diagnostic Queries

1. **Test basic access:**
   ```
   Show me GL Account Line Items
   ```

2. **Test with one filter:**
   ```
   Show me GL Account 41000000
   ```

3. **Test aggregation without filters:**
   ```
   Sum amount for GL Account
   ```

4. **Test with filters:**
   ```
   Sum amount for GL Account 41000000 fiscal year 2026
   ```

## What to Check in Logs

After running a query, check logs for:
```powershell
cf logs sac-custom-widget --recent | findstr /C:"OData" /C:"filter" /C:"Error" /C:"SAP"
```

Expected output should show:
- The exact filter being sent
- The SAP error message
- The field names being used





