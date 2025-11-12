# Quick Test Queries for GL Account Aggregation

## 🎯 Primary Test Query (Matches ACDOCA Table)

```
sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L client 41000000
```

**Expected Result:** `-46049.72`

---

## 📝 Additional Test Queries

### Test 1: Simple Aggregation
```
Total amount for GL Account 41000000
```

### Test 2: With Year Filter
```
Sum amount for GL Account 41000000 fiscal year 2026
```

### Test 3: Complete Filter Set
```
Show me total OSL amount for GL Account 41000000 where fiscal year is 2026 and company code is 1710 and ledger is 0L
```

### Test 4: Using Technical Names Directly
```
Sum OSL for GL Account where RACCT eq 41000000 and GJAHR eq 2026 and RBUKRS eq 1710
```

### Test 5: Step-by-Step Filtering
**First Query:**
```
Show me GL Account 41000000
```

**Follow-up:**
```
Restrict for fiscal year 2026
```

**Follow-up:**
```
And company code 1710
```

**Follow-up:**
```
Sum the amount
```

---

## 🔍 Verification Queries

### Check Available Fields
```
Show me GL Account 41000000 records for fiscal year 2026
```
*This will show the actual data fields available*

### Check Filter Application
```
Count GL Account records where account number is 41000000 and fiscal year is 2026
```
*This verifies filters are working*

### Check Amount Field
```
What fields are available for GL Account Line Item?
```
*This helps verify OSL field is accessible*

---

## 📊 Expected Response Structure

All queries should return responses in this format:

```json
{
  "success": true,
  "summary": "SUM(Amount) for GLAccountLineItem: -46,049.72 (from 63 records)",
  "data": [{
    "sum": -46049.72,
    "recordCount": 63
  }],
  "entity": "GLAccountLineItem",
  "serviceName": "API_GLACCOUNTLINEITEM"
}
```

---

## 🎯 Key Test Points

1. **Field Mapping:** Filters should map to technical names (RACCT, GJAHR, etc.)
2. **OSL Field:** Amount aggregation should use OSL field
3. **Precision:** Result should have 2 decimal places
4. **Matching:** Result should match ACDOCA table sum exactly

---

## 💡 Tips

- Use natural language - the system will map to technical names automatically
- You can mix natural language and technical names
- Filters persist in session, so you can build queries incrementally
- Use "Show me" for data exploration, "Sum/Total" for aggregation





