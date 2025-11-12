# 🔐 Authorization Issue - GL Account Service Access

## ❌ **Current Error**

When querying GL Account data, you're seeing:
```
An error occurred
```

**Root Cause:** The SAP user `AIDATABOT` does not have authorization to access the `API_GLACCOUNTLINEITEM` service.

---

## 📋 **Error Details**

### **From Backend Logs:**
```
SAP Error Status: 403
SAP Error Code: /IWFND/CM_CONSUMER/101
SAP Error Message: "No authorization to access Service 'ZAPI_GLACCOUNTLINEITEM_0001'"
```

### **What's Happening:**
1. ✅ **Query Processing**: Working correctly
   - Query: `sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L`
   - Filters extracted: GLAccount=41000000, FiscalYear=2026, CompanyCode=1710, Ledger=0L
   - OData query built correctly

2. ✅ **Service Matching**: Working correctly
   - Service identified: `API_GLACCOUNTLINEITEM`
   - Entity identified: `GLAccountLineItem`

3. ❌ **SAP Authorization**: **FAILING**
   - User `AIDATABOT` lacks permission to access `ZAPI_GLACCOUNTLINEITEM_0001`
   - This is a SAP Gateway service authorization issue

---

## ✅ **What's Been Fixed**

### **Improved Error Messages:**
- Backend now detects authorization errors (403)
- Returns user-friendly error messages
- Provides guidance on what needs to be done

### **Error Response Format:**
```json
{
  "success": false,
  "summary": "Authorization Error: Access to this SAP service is not authorized.",
  "error": "The user account does not have permission to access API_GLACCOUNTLINEITEM. Please contact your SAP Basis team to grant the required authorizations.",
  "serviceName": "API_GLACCOUNTLINEITEM",
  "entity": "GLAccountLineItem"
}
```

---

## 🔧 **What Needs to Be Done**

### **Action Required: Contact SAP Basis Team**

The Basis team needs to grant the following authorizations to user `AIDATABOT`:

#### **1. Service Authorization**
- **Service**: `API_GLACCOUNTLINEITEM` (Gateway Service: `ZAPI_GLACCOUNTLINEITEM_0001`)
- **Authorization Object**: `/IWFND/CM_CONSUMER`
- **Action**: Grant access to the service

#### **2. Transaction to Check/Activate**
- **Transaction**: `/IWFND/MAINT_SERVICE`
- **Action**: Verify service `API_GLACCOUNTLINEITEM` is activated and published
- **Check**: Service version `0001` is available

#### **3. User Role Assignment**
- **User**: `AIDATABOT`
- **Role**: Assign role with authorization for:
  - `/IWFND/CM_CONSUMER` (Gateway Consumer)
  - Service-specific authorizations for `API_GLACCOUNTLINEITEM`

#### **4. Alternative: Check Service Name**
- Verify the service name in Gateway
- It might be published as a different name
- Check transaction `/IWFND/MAINT_SERVICE` for exact service name

---

## 📝 **Information to Provide to Basis Team**

### **Service Details:**
- **Service ID**: `API_GLACCOUNTLINEITEM`
- **Service Version**: `0001`
- **Gateway Service Name**: `ZAPI_GLACCOUNTLINEITEM_0001`
- **Namespace**: `/SAP/`
- **User**: `AIDATABOT`
- **Error Code**: `/IWFND/CM_CONSUMER/101`

### **Request:**
```
Please grant user AIDATABOT authorization to access:
- Service: API_GLACCOUNTLINEITEM (ZAPI_GLACCOUNTLINEITEM_0001)
- Authorization Object: /IWFND/CM_CONSUMER
- This is required for the SAC chatbot to query GL Account line items
```

### **Transaction to Use:**
1. `/IWFND/MAINT_SERVICE` - Check service activation
2. `/IWFND/ERROR_LOG` - View detailed error logs
3. PFCG (Role Maintenance) - Assign roles to user

---

## ✅ **How to Verify Once Fixed**

### **Test Query:**
```
sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L
```

### **Expected Result:**
- ✅ No authorization error
- ✅ Data returned from SAP
- ✅ Aggregation calculated correctly
- ✅ Result matches ACDOCA table (expected: -46049.72)

### **Check Logs:**
```powershell
cf logs sac-custom-widget --recent | Select-String "GL Account|aggregation|403"
```

**Success Indicators:**
- No `403` errors
- `Retrieved X records for aggregation`
- `Aggregation result: -46049.72`

---

## 📊 **Current Status**

| Component | Status | Notes |
|-----------|--------|-------|
| **Backend** | ✅ Running | Deployed and accessible |
| **Widget** | ✅ Running | Loaded in SAC |
| **Query Processing** | ✅ Working | Filters extracted correctly |
| **Service Matching** | ✅ Working | API_GLACCOUNTLINEITEM identified |
| **SAP Authorization** | ❌ **BLOCKING** | User lacks permissions |
| **Error Messages** | ✅ Improved | Now shows clear authorization error |

---

## 🎯 **Next Steps**

1. **Immediate**: Contact Basis team with the information above
2. **Wait**: Basis team grants authorizations
3. **Verify**: Test the query again in SAC widget
4. **Confirm**: Verify results match ACDOCA table

---

## 📞 **Support**

If you need additional information for the Basis team:
- Check `BASIS_TEAM_PRESENTATION.md` for mitigation details
- Check backend logs: `cf logs sac-custom-widget --recent`
- Test API directly: Use the test scripts in `scripts/` folder

---

**Last Updated**: November 10, 2025  
**Status**: Waiting for Basis team authorization

