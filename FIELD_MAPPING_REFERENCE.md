# GL Account Field Mapping Reference

## Primary ACDOCA to OData API Mappings

This document shows the exact field name mappings between the ACDOCA table and the OData API service (`API_GLACCOUNTLINEITEM`).

### Core Field Mappings

| ACDOCA Table Field | OData API Field                    | Description                          |
|-------------------|------------------------------------|--------------------------------------|
| RACCT             | GLAccount                         | G/L Account Number                   |
| GJAHR             | FiscalYear                        | Fiscal Year                          |
| RBUKRS            | CompanyCode                       | Company Code                         |
| RLDNR             | Ledger                            | Ledger                               |
| OSL               | AmountInFreeDefinedCurrency1     | Amount in Freely Defined Currency 1 |

### Additional Field Mappings

| ACDOCA Table Field | OData API Field      | Description          |
|-------------------|----------------------|---------------------|
| RCLNT             | Client               | Client/Mandant      |
| BELNR             | DocumentNumber       | Document Number     |
| DOCLN             | GLAccountLineItem    | Line Item Number    |
| PRCTR             | ProfitCenter         | Profit Center       |
| FAREA             | FunctionalArea       | Functional Area     |
| KOKRS             | ControllingArea      | Controlling Area    |

## Usage Examples

### Filter Mapping Example

**User Input:**
```
sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L
```

**Extracted Filters:**
```json
{
  "GLAccount": "41000000",
  "FiscalYear": "2026",
  "CompanyCode": "1710",
  "Ledger": "0L"
}
```

**OData $filter Generated:**
```
GLAccount eq '41000000' and FiscalYear eq '2026' and CompanyCode eq '1710' and Ledger eq '0L'
```

**Note:** All field names are automatically mapped from user-friendly names or ACDOCA names to OData API field names.

### Aggregation Field Mapping

**User Input:**
```
sum amount
```

**Mapped Field:**
- `Amount` → `AmountInFreeDefinedCurrency1` (maps to OSL in ACDOCA)

**OData Response:**
- Field `AmountInFreeDefinedCurrency1` contains the same value as `OSL` in ACDOCA table

## Implementation

The mapping is implemented in `src/utils/gl-account-mapper.ts`:

```typescript
// Example mapping function
mapGLAccountField('FiscalYear', true) // Returns 'FiscalYear' (OData name)
mapGLAccountField('GJAHR', true)     // Returns 'FiscalYear' (mapped from ACDOCA)
mapGLAccountField('RACCT', true)      // Returns 'GLAccount' (mapped from ACDOCA)
```

## Important Notes

1. **OData API uses different names:** The OData service `API_GLACCOUNTLINEITEM` uses different field names than the ACDOCA table, even though they access the same underlying data.

2. **Automatic mapping:** The system automatically maps:
   - User-friendly names (e.g., "FiscalYear") → OData API names
   - ACDOCA technical names (e.g., "GJAHR") → OData API names
   - Amount references → `AmountInFreeDefinedCurrency1`

3. **Same data, different names:** Both ACDOCA table and OData API access the same underlying data, but use different field names. The mapping ensures queries work correctly with the OData API.

4. **Aggregation compatibility:** Aggregating `AmountInFreeDefinedCurrency1` via OData API will give the same result as aggregating `OSL` in the ACDOCA table.





