# 🚀 SAC Widget Upload Guide - Ready to Use!

## ✅ **Pre-Flight Check: Everything is Ready!**

- ✅ **Backend Running**: `https://sac-custom-widget.cfapps.us10.hana.ondemand.com`
- ✅ **Widget JS Accessible**: `https://sac-custom-widget.cfapps.us10.hana.ondemand.com/widget/widget.js`
- ✅ **Widget JSON Accessible**: `https://sac-custom-widget.cfapps.us10.hana.ondemand.com/widget/widget.json`
- ✅ **API Endpoint Ready**: `https://sac-custom-widget.cfapps.us10.hana.ondemand.com/api`
- ✅ **Health Check**: Passing

---

## 📦 **Option 1: Direct Upload (Recommended)**

### **Step 1: Download Widget JSON**
1. Open this URL in your browser:
   ```
   https://sac-custom-widget.cfapps.us10.hana.ondemand.com/widget/widget.json
   ```
2. **Save the file** as `widget.json` to your computer

### **Step 2: Upload to SAC**
1. **Open SAP Analytics Cloud**:
   - Go to: [https://sonos-q.us10.hcs.cloud.sap/sap/fpa/ui/app.html#/home](https://sonos-q.us10.hcs.cloud.sap/sap/fpa/ui/app.html#/home)
   
2. **Navigate to Custom Widgets**:
   - Click: **Application** → **Custom Widgets**
   - Or: **Menu** → **Custom Widgets** → **Import Custom Widget**

3. **Import Widget**:
   - Click: **"Import Custom Widget"** or **"+"** button
   - Select: The `widget.json` file you downloaded
   - Click: **"Import"** or **"OK"**

4. **Verify Widget**:
   - Widget should appear in the list as: **"SAP GL Account Analytics Chatbot"**
   - Version: **6.14.0**

---

## 🎨 **Option 2: Create a Story with the Widget**

### **Step 1: Create New Story**
1. In SAC, go to: **Application** → **Stories** → **Create** → **New Story**
2. Give it a name (e.g., "GL Account Chatbot")

### **Step 2: Add Widget**
1. Click: **Insert** → **Custom Widget**
2. Select: **"SAP GL Account Analytics Chatbot"**
3. The widget will appear on your canvas

### **Step 3: Configure Widget Properties**
1. **Select the widget** on the canvas
2. In the **Properties** panel, configure:

   **Required Properties:**
   - **API Endpoint**: `https://sac-custom-widget.cfapps.us10.hana.ondemand.com/api`
   - **API Key**: `6b429687b35c3756bf6f99db7e884d36fadcc4c752e4ca336f4f03955ab4c22a`
   
   **Optional Properties:**
   - **Width**: `400` (or your preferred width)
   - **Height**: `600` (or your preferred height)

3. **Save** the story

---

## 🧪 **Step 3: Test the Widget**

### **Test Queries to Try:**

1. **GL Account Aggregation** (Recommended):
   ```
   sum amount for GL Account 41000000 fiscal year 2026 company code 1710 ledger 0L
   ```

2. **GL Account Data**:
   ```
   Show me GL Account line items for fiscal year 2026
   ```

3. **Material Data**:
   ```
   Show me material data
   ```

4. **Customer Returns**:
   ```
   Show me customer returns delivery items
   ```

### **Expected Behavior:**
- ✅ Widget loads without errors
- ✅ Chat interface appears
- ✅ Queries are processed
- ✅ Results are displayed in the chat
- ✅ Status shows "Ready" when idle

---

## 🔧 **Troubleshooting**

### **Issue: Widget Not Loading**
- **Check**: Widget JSON URL is accessible
- **Verify**: Browser console for CORS errors
- **Solution**: Ensure widget.json points to correct widget.js URL

### **Issue: "Unauthorized" Error**
- **Check**: API Key is correct in widget properties
- **Verify**: API Key matches: `6b429687b35c3756bf6f99db7e884d36fadcc4c752e4ca336f4f03955ab4c22a`
- **Solution**: Update widget properties with correct API Key

### **Issue: "No matching services found"**
- **Check**: Query includes specific entity names (e.g., "GL Account", "Customer")
- **Verify**: Backend logs for service matching
- **Solution**: Use more specific queries (e.g., "Show me GL Account line items")

### **Issue: SAP Authorization Errors**
- **Check**: User `AIDATABOT` has required SAP authorizations
- **Verify**: BTP Destination is configured correctly
- **Solution**: Contact Basis team to grant required authorizations

---

## 📋 **Widget Configuration Summary**

| Property | Value |
|----------|-------|
| **Widget ID** | `com.sap.chatbot.glaccount.analytics` |
| **Version** | `6.14.0` |
| **Widget Name** | SAP GL Account Analytics Chatbot |
| **Widget JS URL** | `https://sac-custom-widget.cfapps.us10.hana.ondemand.com/widget/widget.js?v=6.14.0` |
| **API Endpoint** | `https://sac-custom-widget.cfapps.us10.hana.ondemand.com/api` |
| **API Key** | `6b429687b35c3756bf6f99db7e884d36fadcc4c752e4ca336f4f03955ab4c22a` |

---

## ✅ **Ready to Go!**

Your widget is **fully deployed and ready** to use in SAP Analytics Cloud!

**Next Steps:**
1. ✅ Upload widget.json to SAC
2. ✅ Create a story and add the widget
3. ✅ Configure API endpoint and API key
4. ✅ Start querying your SAP data!

---

## 🎉 **Success Indicators**

You'll know it's working when:
- ✅ Widget appears in SAC custom widgets list
- ✅ Widget loads in a story without errors
- ✅ Chat interface is visible and responsive
- ✅ Queries return data from SAP
- ✅ Status shows "Ready" when idle

**Happy querying!** 🚀

