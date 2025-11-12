# Service Name Resolution Issue - API_GLACCOUNTLINEITEM

## 🔍 **Issue Summary**

The service `API_GLACCOUNTLINEITEM` is being resolved by SAP Gateway to `ZAPI_GLACCOUNTLINEITEM_0001`, but access is being denied with a 403 error.

**Error Message:**
```
No authorization to access Service 'ZAPI_GLACCOUNTLINEITEM_0001'
```

**User Statement:** "There are no auth issues"

## 📋 **Test Results**

All service name variations tested return 403:

| Service Name | Status | Error Message |
|--------------|--------|---------------|
| `API_GLACCOUNTLINEITEM` | 403 | No authorization to access Service 'ZAPI_GLACCOUNTLINEITEM_0001' |
| `API_GLACCOUNTLINEITEM;v=2` | 403 | No service found for namespace '', name 'API_GLACCOUNTLINEITEM', version '0002' |
| `API_GLACCOUNTLINEITEM_0001` | 403 | No service found for namespace '', name 'API_GLACCOUNTLINEITEM_0001', version '0001' |
| `ZAPI_GLACCOUNTLINEITEM_0001` | 403 | No service found for namespace '', name 'ZAPI_GLACCOUNTLINEITEM_0001', version '0001' |

## 🤔 **Possible Causes**

1. **Service Not Published in Gateway**
   - The service might not be activated/published in SAP Gateway
   - Transaction: `/IWFND/MAINT_SERVICE`
   - Check if service is listed and activated

2. **Service Name Mismatch**
   - Gateway is resolving `API_GLACCOUNTLINEITEM` → `ZAPI_GLACCOUNTLINEITEM_0001`
   - But the actual published service might have a different name
   - Need to check what services are actually published

3. **OnPremise Connectivity Proxy Issue**
   - When routing through connectivity proxy, service name resolution might be different
   - The proxy might need different headers or path format

4. **Service Version Mismatch**
   - The service might be published with a different version number
   - Need to check actual service version in Gateway

## 🔧 **Next Steps**

1. **Check Gateway Service Catalog**
   - Transaction: `/IWFND/MAINT_SERVICE`
   - Search for services containing "GLACCOUNT" or "GL"
   - Verify the exact service name and version

2. **Check Service Activation**
   - Ensure the service is activated for the target system
   - Check service binding and activation status

3. **Verify Service Name**
   - Check what the actual published service name is
   - It might be different from `API_GLACCOUNTLINEITEM`

4. **Test Direct Access**
   - Try accessing the service directly (not through connectivity proxy)
   - Compare results to identify if it's a proxy routing issue

## 📝 **Questions for Basis Team**

1. What is the exact service name published in Gateway for GL Account Line Items?
2. Is the service activated and available for the target system?
3. What version number is the service published with?
4. Are there any special requirements for accessing this service through OnPremise connectivity?

---

**Last Updated:** November 10, 2025

