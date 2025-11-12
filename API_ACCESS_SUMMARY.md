# API Access Summary - Required Authorizations

## 📊 **Test Results Summary**

**User:** `AIDATABOT`  
**Client:** `500`  
**Test Date:** November 10, 2025  
**Total APIs Tested:** 14

### **Statistics:**
- ✅ **Fully Accessible:** 0
- ⚠️ **Metadata Only (Entity 403):** 12
- ❌ **Not Accessible:** 2 (metadata also 403)

---

## 📋 **Access Requirements Table**

| # | Service Name | Entity | Metadata | Entity Data | Gateway Service | Error Code | Access Required |
|---|--------------|--------|----------|-------------|-----------------|------------|-----------------|
| 1 | `API_CUSTOMER_RETURNS_DELIVERY_SRV` | `A_ReturnsDeliveryItem` | ✅ 200 | ❌ 403 | `ZAPI_CUSTOMER_RETURNS_DELIVERY_SRV_0001` | `/IWFND/CM_CONSUMER/101` | Gateway Service Authorization |
| 2 | `API_GLACCOUNTLINEITEM` | `GLAccountLineItem` | ✅ 200 | ❌ 403 | `ZAPI_GLACCOUNTLINEITEM_0001` | `/IWFND/CM_CONSUMER/101` | Gateway Service Authorization |
| 3 | `API_MATERIAL_DOCUMENT_SRV` | `A_MaterialDocumentItem` | ✅ 200 | ❌ 403 | `ZAPI_MATERIAL_DOCUMENT_SRV_0001` | `/IWFND/CM_CONSUMER/101` | Gateway Service Authorization |
| 4 | `MMIM_MATERIAL_DATA_SRV` | `I_InvtryMgmtMatlMstrVH` | ✅ 200 | ❌ 403 | `ZMMIM_MATERIAL_DATA_SRV_0001` | `/IWFND/CM_CONSUMER/101` | Gateway Service Authorization |
| 5 | `API_CUSTOMER_MATERIAL_SRV` | `A_CustomerMaterial` | ✅ 200 | ❌ 403 | `ZAPI_CUSTOMER_MATERIAL_SRV_0001` | `/IWFND/CM_CONSUMER/101` | Gateway Service Authorization |
| 6 | `API_PURCHASEORDER_PROCESS_SRV` | `A_PurchaseOrder` | ✅ 200 | ❌ 403 | `ZAPI_PURCHASEORDER_PROCESS_SRV_0001` | `/IWFND/CM_CONSUMER/101` | Gateway Service Authorization |
| 7 | `API_INBOUND_DELIVERY_SRV` | `A_InbDeliveryHeader` | ❌ 403 | ❌ 403 | `ZAPI_INBOUND_DELIVERY_SRV_0001` | `/IWFND/MED/170` | Service Activation + Authorization |
| 8 | `API_OUTBOUND_DELIVERY_SRV` | `A_OutbDeliveryHeader` | ❌ 403 | ❌ 403 | `ZAPI_OUTBOUND_DELIVERY_SRV_0001` | `/IWFND/MED/170` | Service Activation + Authorization |
| 9 | `API_SALES_ORDER_SRV` | `A_SalesOrder` | ✅ 200 | ❌ 403 | `ZAPI_SALES_ORDER_SRV_0001` | `/IWFND/CM_CONSUMER/101` | Gateway Service Authorization |
| 10 | `API_BILLING_DOCUMENT_SRV` | `A_BillingDocument` | ✅ 200 | ❌ 403 | `ZAPI_BILLING_DOCUMENT_SRV_0001` | `/IWFND/CM_CONSUMER/101` | Gateway Service Authorization |
| 11 | `API_CREDIT_MEMO_REQUEST_SRV` | `A_CreditMemoRequest` | ✅ 200 | ❌ 403 | `ZAPI_CREDIT_MEMO_REQUEST_SRV_0001` | `/IWFND/CM_CONSUMER/101` | Gateway Service Authorization |
| 12 | `API_CUSTOMER_RETURN_SRV` | `A_CustomerReturn` | ✅ 200 | ❌ 403 | `ZAPI_CUSTOMER_RETURN_SRV_0001` | `/IWFND/CM_CONSUMER/101` | Gateway Service Authorization |
| 13 | `UI_MATERIALSERIALNUMBER` | `MaterialSerialNumber` | ✅ 200 | ❌ 403 | `ZUI_MATERIALSERIALNUMBER_0001` | `/IWFND/CM_CONSUMER/101` | Gateway Service Authorization |
| 14 | `MM_SUPPLIER_INVOICE_MANAGE` | `A_SupplierInvoice` | ✅ 200 | ❌ 403 | `ZMM_SUPPLIER_INVOICE_MANAGE_0001` | `/IWFND/CM_CONSUMER/101` | Gateway Service Authorization |

---

## 🔐 **Access Requirements by Category**

### **Category 1: Gateway Service Authorization Required (12 APIs)**

**Error Code:** `/IWFND/CM_CONSUMER/101`  
**Error Message:** "No authorization to access Service 'Z[SERVICE_NAME]_0001'"

**APIs Affected:**
1. `API_CUSTOMER_RETURNS_DELIVERY_SRV` → `ZAPI_CUSTOMER_RETURNS_DELIVERY_SRV_0001`
2. `API_GLACCOUNTLINEITEM` → `ZAPI_GLACCOUNTLINEITEM_0001`
3. `API_MATERIAL_DOCUMENT_SRV` → `ZAPI_MATERIAL_DOCUMENT_SRV_0001`
4. `MMIM_MATERIAL_DATA_SRV` → `ZMMIM_MATERIAL_DATA_SRV_0001`
5. `API_CUSTOMER_MATERIAL_SRV` → `ZAPI_CUSTOMER_MATERIAL_SRV_0001`
6. `API_PURCHASEORDER_PROCESS_SRV` → `ZAPI_PURCHASEORDER_PROCESS_SRV_0001`
7. `API_SALES_ORDER_SRV` → `ZAPI_SALES_ORDER_SRV_0001`
8. `API_BILLING_DOCUMENT_SRV` → `ZAPI_BILLING_DOCUMENT_SRV_0001`
9. `API_CREDIT_MEMO_REQUEST_SRV` → `ZAPI_CREDIT_MEMO_REQUEST_SRV_0001`
10. `API_CUSTOMER_RETURN_SRV` → `ZAPI_CUSTOMER_RETURN_SRV_0001`
11. `UI_MATERIALSERIALNUMBER` → `ZUI_MATERIALSERIALNUMBER_0001`
12. `MM_SUPPLIER_INVOICE_MANAGE` → `ZMM_SUPPLIER_INVOICE_MANAGE_0001`

**Required Actions:**
1. **Authorization Object:** `/IWFND/CM_CONSUMER`
2. **Grant access** to user `AIDATABOT` for all Z-prefixed Gateway services listed above
3. **Transaction:** PFCG (Role Maintenance) or SU01 (User Maintenance)
4. **Verify:** Transaction `/IWFND/MAINT_SERVICE` - ensure services are activated

---

### **Category 2: Service Activation + Authorization Required (2 APIs)**

**Error Code:** `/IWFND/MED/170`  
**Error Message:** "No service found for namespace '', name '[SERVICE_NAME]', version '0001'"

**APIs Affected:**
1. `API_INBOUND_DELIVERY_SRV` → `ZAPI_INBOUND_DELIVERY_SRV_0001`
2. `API_OUTBOUND_DELIVERY_SRV` → `ZAPI_OUTBOUND_DELIVERY_SRV_0001`

**Required Actions:**
1. **Activate Service in Gateway:**
   - Transaction: `/IWFND/MAINT_SERVICE`
   - Search for service: `API_INBOUND_DELIVERY_SRV` and `API_OUTBOUND_DELIVERY_SRV`
   - Activate and publish the services
   
2. **Grant Authorization:**
   - Authorization Object: `/IWFND/CM_CONSUMER`
   - Grant access to user `AIDATABOT` for the activated services

---

## 📝 **Action Items for Basis Team**

### **Immediate Actions Required:**

1. **Grant Gateway Service Authorization:**
   - **User:** `AIDATABOT`
   - **Authorization Object:** `/IWFND/CM_CONSUMER`
   - **Services:** All 12 Z-prefixed Gateway services listed in Category 1
   - **Transaction:** PFCG or SU01

2. **Activate Delivery Services:**
   - **Transaction:** `/IWFND/MAINT_SERVICE`
   - **Services to Activate:**
     - `API_INBOUND_DELIVERY_SRV`
     - `API_OUTBOUND_DELIVERY_SRV`
   - **Then grant authorization** as per Category 1

3. **Verify Service Activation:**
   - **Transaction:** `/IWFND/MAINT_SERVICE`
   - Check that all services are:
     - ✅ Listed in Gateway
     - ✅ Activated
     - ✅ Published
     - ✅ Accessible via OData

---

## 🔍 **Pattern Analysis**

### **Common Pattern:**
- **Metadata Accessible:** 12/14 APIs (86%)
- **Entity Data Blocked:** 14/14 APIs (100%)
- **Gateway Service Resolution:** All services resolve to Z-prefixed versions
- **Error Code:** `/IWFND/CM_CONSUMER/101` for 12 APIs, `/IWFND/MED/170` for 2 APIs

### **Root Cause:**
The user `AIDATABOT` lacks authorization to access Gateway services. All services are being resolved by Gateway to Z-prefixed versions (e.g., `API_GLACCOUNTLINEITEM` → `ZAPI_GLACCOUNTLINEITEM_0001`), but the user does not have the required authorization object `/IWFND/CM_CONSUMER` granted.

---

## ✅ **Verification Steps**

After Basis team grants authorizations:

1. **Re-run test script:**
   ```bash
   node scripts/test-all-apis.js
   ```

2. **Expected Results:**
   - Metadata: 200 OK (already working)
   - Entity Data: 200 OK (should work after authorization)
   - Records returned: > 0

3. **Test via Widget:**
   - Query: "Show me GL Account line items"
   - Query: "Show me material document items"
   - Query: "Show me sales orders"
   - All should return data instead of 403 errors

---

## 📞 **Contact Information**

**For Basis Team:**
- **User:** `AIDATABOT`
- **Client:** `500`
- **Authorization Object:** `/IWFND/CM_CONSUMER`
- **Transaction for Verification:** `/IWFND/MAINT_SERVICE`
- **Transaction for Authorization:** PFCG or SU01

---

**Last Updated:** November 10, 2025  
**Test Script:** `scripts/test-all-apis.js`

