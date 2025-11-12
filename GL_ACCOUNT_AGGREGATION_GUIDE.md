# GL Account Aggregation Guide - ACDOCA Compatibility

## Overview

This guide explains how the API ensures GL Account Line Item aggregations match the results from the SAP ACDOCA table query interface.

## Key Features

### 1. **Field Name Mapping**
The system automatically maps user-friendly field names to SAP technical field names:

| User-Friendly Name | SAP Technical Name | Description |
|-------------------|-------------------|-------------|
| Client | RCLNT | Client/Mandant |
| AccountNumber / GLAccount | RACCT | G/L Account Number |
| Ledger | RLDNR | Ledger |
| CompanyCode | RBUKRS | Company Code |
| FiscalYear / Year | GJAHR | Fiscal Year |
| DocumentNumber | BELNR | Document Number |
| LineItem | DOCLN | G/L Account Line Item |
| Amount / AmountInFreeDefinedCurrency1 | **OSL** | Amount in Freely Defined Currency 1 |

### 2. **OSL Field Priority**
For GL Account aggregations, the system prioritizes the **OSL** field (Amount in Freely Defined Currency 1) which matches the ACDOCA table standard:

```typescript
// When aggregating "Amount", the system automatically uses OSL field
{
  "entityName": "GLAccount",
  "aggregationType": "sum",
  "aggregationField": "Amount"  // Automatically mapped to OSL
}
```

### 3. **Filter Mapping**
Filters are automatically mapped to SAP technical names:

**Example Query:**
```json
{
  "filters": {
    "Client": "41000000",
    "AccountNumber": "41000000",
    "Ledger": "0L",
    "CompanyCode": "1710",
    "FiscalYear": "2026"
  }
}
```

**Mapped to SAP:**
```json
{
  "filters": {
    "RCLNT": "41000000",
    "RACCT": "41000000",
    "RLDNR": "0L",
    "RBUKRS": "1710",
    "GJAHR": "2026"
  }
}
```

## Performance Optimizations

### 1. **Increased Record Limit**
- Increased `$top` limit from 1,000 to **10,000** records for aggregation queries
- Ensures complete dataset for accurate aggregation

### 2. **Precision Matching**
- Aggregation calculations use **2 decimal precision** to match SAP behavior
- Proper rounding prevents floating-point precision errors

### 3. **Warning System**
- System warns if fetched records match the limit (indicating potential pagination needed)
- Helps identify when aggregation might be incomplete

## Usage Examples

### Example 1: Sum of OSL Amount
**Query:** "Total amount for GL Account 41000000 for fiscal year 2026"

**Expected Result:** -46049.72 (matching ACDOCA table)

**API Request:**
```json
{
  "query": "sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L"
}
```

**Generated Filters:**
- RACCT = "41000000"
- GJAHR = "2026"
- RBUKRS = "1710"
- RLDNR = "0L"

**Aggregation:**
- Field: OSL
- Type: SUM
- Result: -46049.72

### Example 2: Using Technical Field Names Directly
You can also use technical field names directly:

```json
{
  "query": "sum OSL for GL Account where RACCT eq 41000000 and GJAHR eq 2026"
}
```

## Implementation Details

### Field Mapping Module
Location: `src/utils/gl-account-mapper.ts`

**Key Functions:**
- `mapGLAccountField(fieldName: string)`: Maps field name to technical name
- `isAmountField(fieldName: string)`: Checks if field is an amount field
- `getPrimaryAmountField()`: Returns 'OSL' as primary amount field

### Aggregation Helper
Location: `src/utils/aggregation-helper.ts`

**Key Functions:**
- `sumField(records, fieldName, precision)`: Sums field values with SAP precision
- `calculateAggregation(...)`: Performs aggregation with proper precision
- `mightHaveMoreRecords(fetchedCount, limit)`: Checks if pagination needed

## Verification

To verify the aggregation matches ACDOCA:

1. **Run the same query in SAP GUI:**
   - Open transaction SE16N
   - Query table ACDOCA
   - Apply filters: RCLNT=41000000, RACCT=41000000, RLDNR=0L, RBUKRS=1710, GJAHR=2026
   - Sum the OSL column
   - Expected: -46049.72

2. **Run API query:**
   ```bash
   POST /api/chat/query
   {
     "query": "sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L"
   }
   ```

3. **Compare Results:**
   - API result should match ACDOCA table sum exactly
   - Both should show: -46049.72

## Troubleshooting

### Issue: Aggregation doesn't match ACDOCA

**Check:**
1. Filters are correctly mapped to technical names
2. OSL field is being used (not another amount field)
3. All records are fetched (check for pagination warnings)
4. Field names match exactly (case-sensitive)

**Debug Steps:**
```typescript
// Check field mapping
mapGLAccountField('Amount') // Should return 'OSL'

// Check available fields in response
logger.info('Available fields:', Object.keys(sapData[0]))

// Verify filter application
logger.info('Applied filters:', filters)
```

### Issue: Performance Problems

**Solutions:**
1. Ensure filters are applied at database level (check $filter parameter)
2. Monitor record count (should be < 10,000 for best performance)
3. Consider pagination for very large datasets

## Best Practices

1. **Always specify filters:** Don't aggregate without filters (too many records)
2. **Use user-friendly names:** System will map to technical names automatically
3. **Monitor warnings:** Pay attention to pagination warnings
4. **Verify against SAP:** Always compare with ACDOCA table results

## Technical Notes

- Field mapping is case-insensitive
- OSL is prioritized for amount aggregations
- Precision is set to 2 decimals to match SAP
- Null/undefined values are safely handled (treated as 0)





