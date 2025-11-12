# SAC Example Scripts

This document provides ready-to-use scripts for integrating the chatbot widget into your SAC Analytic Applications.

## Scenario 1: Basic Button Integration

### Setup:
- Input Field: `Input_1`
- Button: `Button_1`
- Chatbot Widget: `ChatWidget_1`

### Button onClick Script:

```javascript
// Get the query from input field
var query = Input_1.getValue();

// Validate input
if (!query || query.trim() === "") {
    Application.showMessage("Please enter a query", "warning");
    return;
}

// Send to chatbot
ChatWidget_1.sendQuery(query);

// Clear input
Input_1.setValue("");
```

---

## Scenario 2: Update Table with Results

### Setup:
- Chatbot Widget: `ChatWidget_1`
- Table: `Table_1`

### ChatWidget onDataReceived Event Script:

```javascript
// This script runs when the chatbot receives data

// Get event data
var detail = ChatWidget_1.getProperty("lastEventData");

// Log to console
console.log("Summary: " + detail.summary);
console.log("Entity: " + detail.entity);
console.log("Records: " + detail.data.length);

// Display summary in a message
Application.showMessage(detail.summary, "success");

// Note: Direct table population from the widget requires
// SAC Acquired Data or custom data binding setup
// Contact your SAC administrator for data model configuration
```

---

## Scenario 3: Pre-filled Query Buttons

### Setup:
- Multiple buttons with predefined queries
- Chatbot Widget: `ChatWidget_1`

### Button 1 (Customers) onClick:

```javascript
ChatWidget_1.sendQuery("Show me all customers");
```

### Button 2 (Sales) onClick:

```javascript
ChatWidget_1.sendQuery("Get sales information");
```

### Button 3 (Products) onClick:

```javascript
ChatWidget_1.sendQuery("List all products");
```

---

## Scenario 4: Clear Chat Button

### Setup:
- Button: `ClearButton_1`
- Chatbot Widget: `ChatWidget_1`

### Button onClick Script:

```javascript
ChatWidget_1.clearChat();
Application.showMessage("Chat cleared", "info");
```

---

## Scenario 5: Dynamic Query Builder

### Setup:
- Dropdown: `EntityDropdown_1` (options: Customer, Sales, Product)
- Input Field: `FilterInput_1`
- Button: `SearchButton_1`
- Chatbot Widget: `ChatWidget_1`

### Button onClick Script:

```javascript
// Get selected entity
var entity = EntityDropdown_1.getSelectedKey();

// Get filter value
var filterValue = FilterInput_1.getValue();

// Build query
var query = "Show me " + entity;

if (filterValue && filterValue.trim() !== "") {
    query += " where " + filterValue;
}

// Send to chatbot
ChatWidget_1.sendQuery(query);
```

---

## Scenario 6: Error Handling

### ChatWidget onDataReceived Event:

```javascript
try {
    var detail = ChatWidget_1.getProperty("lastEventData");
    
    if (detail.error) {
        // Handle error
        Application.showMessage("Error: " + detail.error, "error");
    } else if (detail.data && detail.data.length > 0) {
        // Success - data received
        Application.showMessage(
            "Loaded " + detail.data.length + " records", 
            "success"
        );
    } else {
        // No data found
        Application.showMessage("No data found", "warning");
    }
} catch (e) {
    console.error("Error processing data:", e);
    Application.showMessage("An error occurred", "error");
}
```

---

## Scenario 7: Loading Indicator

### Setup:
- Chatbot Widget: `ChatWidget_1`
- Text widget: `StatusText_1`

### Before sending query:

```javascript
// Show loading
StatusText_1.setText("Loading...");
StatusText_1.setStyle(TextStyle.Bold);

// Send query
ChatWidget_1.sendQuery(query);
```

### ChatWidget onDataReceived Event:

```javascript
// Update status
StatusText_1.setText("Data loaded");
StatusText_1.setStyle(TextStyle.Normal);
```

---

## Scenario 8: Multi-Service Query

### Setup:
- Service Dropdown: `ServiceDropdown_1`
- Query Input: `QueryInput_1`
- Button: `SendButton_1`
- Chatbot Widget: `ChatWidget_1`

### Button onClick Script:

```javascript
// Get service selection
var service = ServiceDropdown_1.getSelectedKey();

// Get query
var query = QueryInput_1.getValue();

// First, select the service
if (service && service !== "") {
    ChatWidget_1.sendQuery("use " + service);
    
    // Wait a moment, then send the actual query
    setTimeout(function() {
        if (query && query.trim() !== "") {
            ChatWidget_1.sendQuery(query);
        }
    }, 1000);
} else {
    // No service selected, send query directly
    ChatWidget_1.sendQuery(query);
}
```

---

## Scenario 9: Save Query History

### Setup:
- Chatbot Widget: `ChatWidget_1`
- Global variable: `QueryHistory` (Array)

### Application onInitialization:

```javascript
// Initialize query history
var QueryHistory = [];
```

### Before sending query:

```javascript
var query = Input_1.getValue();

// Add to history
QueryHistory.push({
    query: query,
    timestamp: new Date().toISOString()
});

// Send query
ChatWidget_1.sendQuery(query);

// Log history
console.log("Query history:", QueryHistory);
```

---

## Scenario 10: Conditional Widget Display

### Setup:
- Checkbox: `ShowChatbot_1`
- Chatbot Widget: `ChatWidget_1`

### Checkbox onChange Script:

```javascript
var isChecked = ShowChatbot_1.isChecked();

if (isChecked) {
    ChatWidget_1.setVisible(true);
} else {
    ChatWidget_1.setVisible(false);
}
```

---

## Advanced: Integration with SAC Data Models

### Using Acquired Data (Requires SAC Configuration)

```javascript
// After receiving data from chatbot
var detail = ChatWidget_1.getProperty("lastEventData");
var data = detail.data;

// Convert to SAC-compatible format
var sacData = data.map(function(row) {
    return {
        // Map your fields
        Dimension1: row.Customer,
        Measure1: row.NetAmount
    };
});

// Set to acquired data source (requires pre-configuration)
// DataSource_1.setData(sacData);
```

---

## Debugging Tips

### Enable Console Logging:

```javascript
console.log("Widget properties:", {
    apiEndpoint: ChatWidget_1.getProperty("apiEndpoint"),
    apiKey: ChatWidget_1.getProperty("apiKey") ? "***" : "not set"
});
```

### Test Widget Methods:

```javascript
// Test if widget is responsive
try {
    ChatWidget_1.sendQuery("test");
    console.log("Widget is working");
} catch (e) {
    console.error("Widget error:", e);
}
```

---

## Common Gotchas

1. **Property Names:**
   - SAC uses `ChatWidget_1` (with underscore and number)
   - Not `chatWidget` or `ChatWidget`

2. **Event Handling:**
   - Event handlers must be configured in SAC UI
   - Can't add event listeners in script dynamically

3. **Timing:**
   - Widget needs time to initialize
   - Use setTimeout for sequential queries

4. **Data Binding:**
   - Direct table population requires SAC data model configuration
   - Can't dynamically set table data without acquired data setup

5. **CORS:**
   - Ensure server ALLOWED_ORIGIN matches SAC tenant URL
   - Check browser console for CORS errors

---

## Need More Help?

- Check browser console (F12) for errors
- Review server logs for API issues
- Verify widget properties are set correctly
- Test with simple queries first
- Contact SAC administrator for data model setup

