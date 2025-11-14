/**
 * Test API Access Script
 * Tests access to multiple SAP OData services
 */

const axios = require('axios');
const https = require('https');

// List of APIs to test
const apisToTest = [
  'API_CUSTOMER_RETURNS_DELIVERY_SRV',
  'API_GLACCOUNTLINEITEM',
  'API_MATERIAL_DOCUMENT_SRV',
  'MMIM_MATERIAL_DATA_SRV',
  'API_CUSTOMER_MATERIAL_SRV',
  'API_PURCHASEORDER_PROCESS_SRV',
  'API_INBOUND_DELIVERY_SRV',
  'API_OUTBOUND_DELIVERY_SRV',
  'API_SALES_ORDER_SRV',
  'API_BILLING_DOCUMENT_SRV',
  'API_CREDIT_MEMO_REQUEST_SRV',
  'API_CUSTOMER_RETURN_SRV',
  'UI_MATERIALSERIALNUMBER',
  'MM_SUPPLIER_INVOICE_MANAGE'
];

// Get credentials from environment or use defaults
const SAP_HOST = process.env.SAP_HOST || 'vhssnds4ci.hec.sonos.com';
const SAP_PORT = process.env.SAP_PORT || '44300';
const SAP_USERNAME = process.env.SAP_USERNAME || 'AIDATABOT';
const SAP_PASSWORD = process.env.SAP_PASSWORD || '<REPLACE_WITH_SAP_PASSWORD>';
const SAP_CLIENT = process.env.SAP_CLIENT || '500';

const baseURL = `https://${SAP_HOST}:${SAP_PORT}`;

// Create axios instance with basic auth
const client = axios.create({
  baseURL,
  auth: {
    username: SAP_USERNAME,
    password: SAP_PASSWORD
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'sap-client': SAP_CLIENT
  }
});

// Test a single API service
async function testService(serviceName) {
  console.log(`\nTesting: ${serviceName}`);
  console.log('-'.repeat(60));
  
  try {
    // Try to access the service root metadata
    const metadataUrl = `/sap/opu/odata/sap/${serviceName}/$metadata`;
    console.log(`  URL: ${baseURL}${metadataUrl}`);
    
    const response = await client.get(metadataUrl, {
      headers: {
        'Accept': 'application/xml'
      }
    });
    
    console.log(`  ✅ Status: ${response.status}`);
    console.log(`  ✅ Service is accessible`);
    
    // Try to get service document (list of entity sets)
    try {
      const serviceDocUrl = `/sap/opu/odata/sap/${serviceName}/`;
      const serviceDocResponse = await client.get(serviceDocUrl);
      
      if (serviceDocResponse.data && serviceDocResponse.data.d) {
        const entitySets = serviceDocResponse.data.d.EntitySets || [];
        console.log(`  ✅ Entity Sets: ${entitySets.length} found`);
        if (entitySets.length > 0) {
          console.log(`  ✅ Sample entities: ${entitySets.slice(0, 3).map(e => e.Name || e).join(', ')}`);
        }
      }
    } catch (docError) {
      console.log(`  ⚠️  Service document access failed: ${docError.response?.status || docError.message}`);
    }
    
    return { serviceName, accessible: true, status: response.status };
    
  } catch (error) {
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const errorData = error.response?.data;
    
    console.log(`  ❌ Status: ${status || 'N/A'}`);
    
    if (status === 401) {
      console.log(`  ❌ Error: Unauthorized - Check credentials`);
    } else if (status === 403) {
      console.log(`  ❌ Error: Forbidden - No authorization to access this service`);
      if (errorData?.error?.message) {
        console.log(`  ❌ Message: ${JSON.stringify(errorData.error.message)}`);
      }
    } else if (status === 404) {
      console.log(`  ❌ Error: Service not found`);
    } else if (status === 500) {
      console.log(`  ❌ Error: Internal server error`);
    } else {
      console.log(`  ❌ Error: ${error.message}`);
      if (errorData) {
        console.log(`  ❌ Response: ${JSON.stringify(errorData).substring(0, 200)}`);
      }
    }
    
    return { 
      serviceName, 
      accessible: false, 
      status: status || 'N/A',
      error: error.message,
      errorDetails: errorData
    };
  }
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('SAP OData API Access Test');
  console.log('='.repeat(60));
  console.log(`Host: ${SAP_HOST}:${SAP_PORT}`);
  console.log(`User: ${SAP_USERNAME}`);
  console.log(`Client: ${SAP_CLIENT}`);
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const api of apisToTest) {
    const result = await testService(api);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  
  const accessible = results.filter(r => r.accessible);
  const notAccessible = results.filter(r => !r.accessible);
  
  console.log(`\n✅ Accessible (${accessible.length}):`);
  accessible.forEach(r => {
    console.log(`   - ${r.serviceName} (${r.status})`);
  });
  
  console.log(`\n❌ Not Accessible (${notAccessible.length}):`);
  notAccessible.forEach(r => {
    console.log(`   - ${r.serviceName} (${r.status})`);
  });
  
  console.log('\n' + '='.repeat(60));
}

// Run the test
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});




