# Field Mapping Process - Best Practices

## Overview

This document describes the process for discovering and configuring field mappings for SAP OData APIs to ensure the chatbot returns accurate results.

## Why Field Mapping is Needed

SAP systems have different field names in:
1. **User-friendly names** (what business users understand)
2. **Table technical names** (ACDOCA: RACCT, GJAHR, etc.)
3. **OData API names** (GLAccount, FiscalYear, etc.)

The chatbot needs to map between these automatically.

## Step-by-Step Process

### Step 1: Discover the API

1. **Identify the OData Service:**
   - Service name: e.g., `API_GLACCOUNTLINEITEM`
   - Entity name: e.g., `GLAccountLineItem`

2. **Query the Metadata:**
   ```
   GET /sap/opu/odata/sap/{SERVICE}/{ENTITY}?$metadata
   ```
   This returns the XML metadata showing all available fields.

3. **Query a Sample Record:**
   ```
   GET /sap/opu/odata/sap/{SERVICE}/{ENTITY}?$top=1
   ```
   This shows actual field names in the JSON response.

### Step 2: Identify Field Mappings

For each field, determine:

1. **API Field Name** (from the OData response)
   - Example: `GLAccount`, `FiscalYear`, `CompanyCode`

2. **User-Friendly Names** (what users might say)
   - Example: "GL Account", "Account Number", "Fiscal Year", "Year"

3. **Table Technical Names** (from SAP tables like ACDOCA)
   - Example: `RACCT`, `GJAHR`, `RBUKRS`
   - Check SAP documentation or SE11 transaction

4. **Amount Fields** (for aggregations)
   - Identify which fields represent monetary amounts
   - Mark the primary amount field for aggregations

### Step 3: Add to Configuration

Edit `src/config/field-mappings.ts` and add your API mapping:

```typescript
{
  apiName: 'API_YOUR_SERVICE',
  entityName: 'YourEntity',
  description: 'Description of what this API provides',
  mappings: [
    {
      userFriendly: ['UserTerm1', 'UserTerm2'],
      technicalNames: ['TECHNICAL_NAME'],
      apiFieldName: 'ActualAPIFieldName',
      description: 'What this field represents'
    },
    // ... more mappings
  ]
}
```

### Step 4: Test the Mapping

1. **Test Individual Fields:**
   ```typescript
   mapFieldToAPI('API_YOUR_SERVICE', 'YourEntity', 'UserTerm1')
   // Should return: 'ActualAPIFieldName'
   ```

2. **Test with Actual Query:**
   - Run a query in the chatbot
   - Check logs for the generated OData `$filter`
   - Verify it uses correct API field names

3. **Test Aggregations:**
   - Test amount aggregations
   - Verify it uses the correct amount field

### Step 5: Document Business Questions

Create a mapping document showing:

1. **Common Business Questions:**
   ```
   "What is the total amount for GL Account 41000000 in fiscal year 2026?"
   ```

2. **Expected Mappings:**
   - GL Account → GLAccount
   - Fiscal Year → FiscalYear
   - Amount → AmountInFreeDefinedCurrency1

3. **Test Results:**
   - Document what works
   - Document any issues found

## Discovery Tools

### Tool 1: Metadata Explorer Script

Create a script to explore OData metadata:

```typescript
// explore-api-metadata.ts
import axios from 'axios';

async function exploreAPI(serviceName: string, entityName: string) {
  const url = `/sap/opu/odata/sap/${serviceName}/${entityName}`;
  
  // Get metadata
  const metadata = await axios.get(`${url}?$metadata`);
  console.log('Metadata:', metadata.data);
  
  // Get sample data
  const sample = await axios.get(`${url}?$top=1`);
  console.log('Sample fields:', Object.keys(sample.data.value[0]));
  
  return {
    metadata,
    sampleFields: Object.keys(sample.data.value[0])
  };
}
```

### Tool 2: Field Name Tester

Create a utility to test mappings:

```typescript
// test-field-mapping.ts
import { mapFieldToAPI } from './utils/api-field-mapper';

function testMapping(apiName: string, entityName: string) {
  const testCases = [
    'FiscalYear',    // User-friendly
    'GJAHR',         // Technical
    'Year',          // User-friendly alias
    'FiscalYear'     // Already correct API name
  ];
  
  testCases.forEach(test => {
    const result = mapFieldToAPI(apiName, entityName, test);
    console.log(`${test} → ${result}`);
  });
}
```

## Best Practices

### 1. **Start with Common Queries**

Identify the most common business questions first:
- "Show me sales for..."
- "Total amount for GL Account..."
- "Customer data for..."

### 2. **Map Both Directions**

Map both:
- User-friendly → API (most common)
- Technical/Table → API (for compatibility)

### 3. **Handle Aliases**

Support multiple ways users might reference the same field:
- "Year", "Fiscal Year", "Accounting Year" → all map to `FiscalYear`

### 4. **Document Amount Fields**

Clearly identify:
- Primary amount field (for aggregations)
- Alternative amount fields (fallbacks)

### 5. **Test with Real Data**

Always test with:
- Actual SAP data
- Real business queries
- Various filter combinations

## Maintenance Process

### When Adding New APIs

1. **Document the Discovery:**
   - Service name
   - Entity name
   - Sample API endpoint
   - Available fields

2. **Create the Mapping:**
   - Add to `field-mappings.ts`
   - Test each field mapping
   - Document in API-specific docs

3. **Update Tests:**
   - Add test cases
   - Verify mappings work
   - Test common business queries

4. **Update Documentation:**
   - Add to this process doc
   - Document common use cases
   - Share with team

### When Field Names Change

If SAP changes field names:

1. **Update Configuration:**
   - Update `field-mappings.ts`
   - Keep old mappings for backward compatibility (if needed)

2. **Test Thoroughly:**
   - Verify all queries still work
   - Update documentation

## Troubleshooting

### Issue: Field Not Found (400 Error)

**Symptoms:**
- OData returns: "Property X not found in type Y"

**Solution:**
1. Query metadata to see actual field names
2. Update mapping to use correct API field name
3. Test with sample query

### Issue: Wrong Data Returned

**Symptoms:**
- Filter applies but returns wrong data

**Solution:**
1. Check if field mapping is correct
2. Verify filter is being applied correctly
3. Test with known-good filter values

### Issue: Aggregation Returns Wrong Value

**Symptoms:**
- Aggregation doesn't match table/expected result

**Solution:**
1. Verify amount field mapping is correct
2. Check if using correct amount field
3. Verify precision/formatting matches

## Quick Reference

### Configuration File
`src/config/field-mappings.ts`

### Mapper Utility
`src/utils/api-field-mapper.ts`

### Usage in Code
```typescript
import { mapFieldToAPI } from '../utils/api-field-mapper';

const apiField = mapFieldToAPI('API_GLACCOUNTLINEITEM', 'GLAccountLineItem', 'FiscalYear');
// Returns: 'FiscalYear'

const apiField2 = mapFieldToAPI('API_GLACCOUNTLINEITEM', 'GLAccountLineItem', 'GJAHR');
// Returns: 'FiscalYear' (mapped from ACDOCA name)
```





