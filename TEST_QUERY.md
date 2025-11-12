# Test Query for GL Account Aggregation

## 🎯 Primary Test Query

Copy and paste this exact query into your SAC widget:

```
sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L
```

## 📊 Expected Result

- **Summary:** "SUM(Amount) for GLAccountLineItem: -46,049.72 (from 63 records)"
- **Result:** `-46049.72`
- **Should match:** ACDOCA table aggregation result

## 🔄 Alternative Query Formats

You can also try these variations (all should work):

### Option 1: More Explicit
```
What is the total amount for GL Account 41000000 in fiscal year 2026 for company code 1710 with ledger 0L?
```

### Option 2: Short Version
```
Total amount GL Account 41000000 year 2026 company 1710 ledger 0L
```

### Option 3: Using Technical Names Directly
```
Sum AmountInFreeDefinedCurrency1 for GL Account where GLAccount is 41000000 and FiscalYear is 2026 and CompanyCode is 1710 and Ledger is 0L
```

## ✅ What Should Happen

1. **Field Mapping (Automatic):**
   - `GL Account` → Maps to `GLAccount` filter
   - `fiscal year` → Maps to `FiscalYear` filter
   - `company code` → Maps to `CompanyCode` filter
   - `ledger` → Maps to `Ledger` filter
   - `amount` → Maps to `AmountInFreeDefinedCurrency1` for aggregation

2. **OData Query Generated:**
   ```
   $filter: FiscalYear eq '2026' and GLAccount eq '41000000' and CompanyCode eq '1710' and Ledger eq '0L'
   ```

3. **Aggregation:**
   - Sums `AmountInFreeDefinedCurrency1` field
   - Returns: `-46049.72`

## 🧪 Step-by-Step Testing

### Test 1: Basic Query
1. Enter: `sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L`
2. Check result matches: **-46049.72**
3. Verify record count matches ACDOCA (63 records)

### Test 2: Incremental Filters
1. First: `Show me GL Account 41000000`
2. Then: `restrict for fiscal year 2026`
3. Then: `and company code 1710`
4. Then: `sum the amount`

### Test 3: Different Phrasing
1. Try: `Total amount for GL Account 41000000 in year 2026`
2. Then add: `for company 1710`
3. Then add: `and ledger 0L`

## 🔍 Verification

Compare with ACDOCA Table:
- **Table:** ACDOCA
- **Filters:** RCLNT=41000000, RACCT=41000000, RLDNR=0L, RBUKRS=1710, GJAHR=2026
- **Sum of OSL:** -46049.72
- **Record Count:** 63

## 🐛 If Result Doesn't Match

Check logs:
```powershell
cf logs sac-custom-widget --recent | Select-String "OData|filter|aggregation|AmountInFreeDefinedCurrency1"
```

Look for:
- OData $filter using correct field names (FiscalYear, GLAccount, etc.)
- Aggregation field: `AmountInFreeDefinedCurrency1`
- Result value in logs





