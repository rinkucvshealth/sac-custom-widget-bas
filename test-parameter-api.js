// Test script for the new parameter-based OData API
const axios = require('axios');

// Test the new C_SALESANALYTICSQRY_1_CDS API with function import pattern
async function testParameterAPI() {
    console.log('Testing new parameter-based OData API...');
    
    try {
        // Test the exact URL pattern you provided
        const testUrl = 'http://localhost:3000/api/chat/query';
        const testQuery = {
            query: "Show me sales analytics with exchange rate type M and display currency USD"
        };
        
        console.log('Sending test query:', testQuery.query);
        
        const response = await axios.post(testUrl, testQuery, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        
        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));
        
        if (response.data.success) {
            console.log(`✅ Success! Found ${response.data.recordCount} records`);
            console.log('Entity:', response.data.entity);
            console.log('Service:', response.data.serviceName);
        } else {
            console.log('❌ Query failed:', response.data.error);
            if (response.data.requiresParameters) {
                console.log('Required parameters:', response.data.mandatoryFilters);
                console.log('Example query:', response.data.exampleQuery);
            }
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Test parameter validation
async function testParameterValidation() {
    console.log('\nTesting parameter validation...');
    
    try {
        const testUrl = 'http://localhost:3000/api/chat/query';
        const testQuery = {
            query: "Show me sales analytics" // Missing required parameters
        };
        
        console.log('Sending incomplete query:', testQuery.query);
        
        const response = await axios.post(testUrl, testQuery, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        
        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));
        
        if (response.data.requiresParameters) {
            console.log('✅ Parameter validation working correctly');
            console.log('Required parameters:', response.data.mandatoryFilters);
        } else {
            console.log('❌ Parameter validation not working as expected');
        }
        
    } catch (error) {
        console.error('❌ Parameter validation test failed:', error.message);
    }
}

// Run tests
async function runTests() {
    console.log('🚀 Starting parameter-based API tests...\n');
    
    await testParameterAPI();
    await testParameterValidation();
    
    console.log('\n✨ Tests completed!');
}

runTests().catch(console.error);

