# ✅ Corrected Test Query

## Use This Query (WITH Ledger):

```
sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L
```

## Why Your Previous Query Didn't Match:

**Your Query:**
```
What is the total amount for GL Account 41000000 in fiscal year 2026 for company code 1710?
```

**Missing:** Ledger filter - so it summed across ALL ledgers

**Result:**
- 315 records (all ledgers)
- -230,248.6 (sum of all ledgers)

**Expected:**
- 63 records (ledger 0L only)
- -46,049.72 (ledger 0L only)

## ✅ Correct Query Format:

Always include **ledger 0L** when querying GL Account data:

```
sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L
```

## 📋 Alternative Ways to Specify Ledger:

All these work:
- `ledger 0L`
- `with ledger 0L`
- `for ledger 0L`
- `ledger is 0L`
- `restrict to ledger 0L`





