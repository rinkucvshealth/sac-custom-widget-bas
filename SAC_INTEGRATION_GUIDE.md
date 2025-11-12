# 🎯 SAC Integration Guide - AI Chatbot Widget

## 📋 Overview

This guide will help you integrate the AI Chatbot Widget with SAP Analytics Cloud (SAC). The widget is now deployed and ready to use with your SAP S/4HANA system through BTP.

## 🚀 Quick Start

### 1. Widget Information
- **Widget URL**: `https://sac-custom-widget.cfapps.us10.hana.ondemand.com/widget/widget.js`
- **Widget ID**: `com.sap.chatbot`
- **Widget Name**: AI Chatbot
- **API Endpoint**: `https://sac-custom-widget.cfapps.us10.hana.ondemand.com/api`

### 2. SAC Integration Steps

#### Step 1: Upload Widget to SAC
1. **Open SAC** → Go to your SAC tenant: [https://sonos-q.us10.hcs.cloud.sap/sap/fpa/ui/app.html#/home](https://sonos-q.us10.hcs.cloud.sap/sap/fpa/ui/app.html#/home)
2. **Navigate to**: Application → Custom Widgets
3. **Click**: "Import Custom Widget"
4. **Upload**: The `widget.json` file from your project
5. **Verify**: Widget appears in the custom widgets list

#### Step 2: Create a New Story
1. **Create Story**: Application → Stories → Create → New Story
2. **Add Widget**: Insert → Custom Widget → AI Chatbot
3. **Configure Widget**: Set the following properties:
   - **API Endpoint**: `https://sac-custom-widget.cfapps.us10.hana.ondemand.com/api`
   - **API Key**: `6b429687b35c3756bf6f99db7e884d36fadcc4c752e4ca336f4f03955ab4c22a`
   - **Width**: 400px
   - **Height**: 600px

#### Step 3: Test the Integration
1. **Open the Story** with your widget
2. **Test Queries**:
   - "Show me customer data"
   - "Get sales information"
   - "List all products"
3. **Verify**: Widget connects to SAP and returns data

## 🔧 Advanced Configuration

### Widget Properties
The widget supports the following configurable properties:

```json
{
  "apiEndpoint": "https://sac-custom-widget.cfapps.us10.hana.ondemand.com/api",
  "apiKey": "6b429687b35c3756bf6f99db7e884d36fadcc4c752e4ca336f4f03955ab4c22a",
  "width": 400,
  "height": 600
}
```

### Widget Methods
The widget exposes these methods for programmatic control:

- **`sendQuery(query)`**: Send a query to the chatbot
- **`clearChat()`**: Clear the chat history

### Widget Events
The widget fires these events for SAC integration:

- **`onDataReceived`**: Fired when data is received from SAP
  - **Properties**:
    - `data`: Array of data results
    - `fields`: Field names
    - `entity`: Entity name
    - `summary`: Summary text

## 🎨 Customization Options

### 1. Styling
The widget uses SAP Fiori design principles with:
- **Primary Color**: #0070f2 (SAP Blue)
- **Font**: "72" (SAP Font)
- **Responsive Design**: Adapts to container size

### 2. Branding
You can customize:
- **Widget Name**: Change in `widget.json`
- **Icon**: Update the base64 encoded SVG
- **Colors**: Modify CSS in `widget.js`

### 3. Functionality
Extend the widget by:
- **Adding new SAP services** in the backend
- **Customizing query processing** in the AI logic
- **Adding new UI components** for specific use cases

## 🔍 Troubleshooting

### Common Issues

#### 1. Widget Not Loading
- **Check**: Widget URL is accessible
- **Verify**: CORS settings in the backend
- **Test**: Direct access to widget.js URL

#### 2. API Connection Issues
- **Verify**: API endpoint is correct
- **Check**: API key is valid
- **Test**: Direct API calls to `/api/chat/test-connection`

#### 3. SAP Data Not Loading
- **Check**: BTP Destination Service configuration
- **Verify**: Cloud Connector is running
- **Test**: SAP connectivity from BTP

### Debug Steps
1. **Open Browser Developer Tools**
2. **Check Console** for JavaScript errors
3. **Monitor Network** tab for API calls
4. **Verify** widget properties are set correctly

## 📊 Data Integration

### Supported SAP Services
The widget currently supports:
- **API_BUSINESS_PARTNER**: Customer and vendor data
- **Extensible**: Easy to add more OData services

### Data Format
The widget expects data in this format:
```json
{
  "success": true,
  "data": [
    {
      "field1": "value1",
      "field2": "value2"
    }
  ],
  "fields": ["field1", "field2"],
  "entity": "BusinessPartner",
  "summary": "Found 10 business partners"
}
```

## 🚀 Next Steps

### 1. Production Deployment
- **Update API Key**: Use a secure, environment-specific key
- **Configure CORS**: Restrict to your SAC domain
- **Enable Logging**: Monitor usage and performance

### 2. Enhanced Features
- **Add More SAP Services**: Extend backend to support more entities
- **Implement Caching**: Improve performance with data caching
- **Add Authentication**: Integrate with SAC user authentication

### 3. Advanced Integration
- **Bidirectional Communication**: Allow SAC to send data to widget
- **Real-time Updates**: Implement WebSocket connections
- **Custom Visualizations**: Add charts and graphs to widget

## 📞 Support

### Resources
- **SAC Documentation**: [SAP Help Portal](https://help.sap.com/viewer/product/SAP_ANALYTICS_CLOUD/)
- **Custom Widgets**: [SAC Custom Widget Guide](https://help.sap.com/viewer/00f68c2e08b941f081002fd3691d86a/)
- **BTP Integration**: [SAP BTP Documentation](https://help.sap.com/viewer/product/BTP/)

### Contact
For technical support or questions about this integration, please refer to your SAP administrator or BTP support team.

---

## ✅ Checklist

- [ ] Widget uploaded to SAC
- [ ] Story created with widget
- [ ] Widget properties configured
- [ ] API connection tested
- [ ] SAP data loading verified
- [ ] User acceptance testing completed
- [ ] Production deployment planned

**Congratulations!** Your AI Chatbot Widget is now integrated with SAC and ready to provide intelligent SAP data insights! 🎉