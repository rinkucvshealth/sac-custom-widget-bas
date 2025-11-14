/**
 * Test API_OUTBOUND_DELIVERY_SRV with version 2 and A_OutbDeliveryHeader entity
 */

const axios = require('axios');
const https = require('https');

const SAP_HOST = process.env.SAP_HOST || 'vhssnds4ci.hec.sonos.com';
const SAP_PORT = process.env.SAP_PORT || '44300';
const SAP_USERNAME = process.env.SAP_USERNAME || 'AIDATABOT';
const SAP_PASSWORD = process.env.SAP_PASSWORD || '<REPLACE_WITH_SAP_PASSWORD>';
const SAP_CLIENT = process.env.SAP_CLIENT || '500';

const baseURL = `https://${SAP_HOST}:${SAP_PORT}`;

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

async function testUrl(url, description) {
  console.log('\n' + '='.repeat(70));
  console.log(`Testing: ${description}`);
  console.log('='.repeat(70));
  console.log(`📍 URL: ${baseURL}${url}`);
  console.log(`👤 User: ${SAP_USERNAME}`);
  console.log(`🏢 Client: ${SAP_CLIENT}`);
  
  try {
    const response = await client.get(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log(`\n✅ Status: ${response.status}`);
    console.log(`✅ Request successful!`);
    
    if (response.data) {
      console.log(`\n📊 Response Data:`);
      if (response.data.d) {
        const results = response.data.d.results || response.data.d;
        if (Array.isArray(results)) {
          console.log(`   Records found: ${results.length}`);
          if (results.length > 0) {
            console.log(`   Sample record fields: ${Object.keys(results[0]).slice(0, 10).join(', ')}`);
            console.log(`   Sample record (first 3 fields):`);
            const sample = results[0];
            const keys = Object.keys(sample).slice(0, 3);
            keys.forEach(key => {
              console.log(`     ${key}: ${sample[key]}`);
            });
          }
        } else {
          console.log(`   Response structure:`, JSON.stringify(Object.keys(response.data.d || {}), null, 2));
        }
      } else {
        console.log(`   Response keys: ${Object.keys(response.data).join(', ')}`);
      }
    }
    
    return { success: true, status: response.status };
    
  } catch (error) {
    const status = error.response?.status;
    const errorData = error.response?.data;
    
    console.log(`\n❌ Status: ${status || 'N/A'}`);
    console.log(`❌ Error Type: ${error.response ? 'HTTP Error' : error.code || 'Network Error'}`);
    
    if (error.response) {
      console.log(`\n📋 Error Response:`);
      
      // Try to parse XML error if it's XML
      if (typeof errorData === 'string' && errorData.includes('<?xml')) {
        console.log(`   XML Error Response:`);
        console.log(errorData.substring(0, 500));
        
        // Extract error message from XML
        const messageMatch = errorData.match(/<message[^>]*>([^<]+)<\/message>/);
        const codeMatch = errorData.match(/<code>([^<]+)<\/code>/);
        
        if (messageMatch) {
          console.log(`\n🔍 Error Message: ${messageMatch[1]}`);
        }
        if (codeMatch) {
          console.log(`   Error Code: ${codeMatch[1]}`);
        }
      } else {
        console.log(JSON.stringify(errorData, null, 2));
      }
      
      if (error.response.data?.error) {
        const sapError = error.response.data.error;
        console.log(`\n🔍 SAP Error Details:`);
        console.log(`   Code: ${sapError.code || 'N/A'}`);
        console.log(`   Message: ${sapError.message?.value || sapError.message || 'N/A'}`);
      }
    } else {
      console.log(`\n❌ Error: ${error.message}`);
      if (error.code) {
        console.log(`   Error Code: ${error.code}`);
      }
    }
    
    return { success: false, status: status || 'N/A', error: error.message };
  }
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('API_OUTBOUND_DELIVERY_SRV - Version 2 Test');
  console.log('='.repeat(70));
  
  // Test 1: Try the exact URL provided
  await testUrl(
    '/sap/opu/odata/sap/API_OUTBOUND_DELIVERY_SRV;v=2/A_OutbDeliveryHeader',
    'API_OUTBOUND_DELIVERY_SRV v2 - A_OutbDeliveryHeader'
  );
  
  // Test 2: Try with $top=1 to limit results
  await testUrl(
    '/sap/opu/odata/sap/API_OUTBOUND_DELIVERY_SRV;v=2/A_OutbDeliveryHeader?$top=1',
    'API_OUTBOUND_DELIVERY_SRV v2 - A_OutbDeliveryHeader with $top=1'
  );
  
  // Test 3: Try service document
  await testUrl(
    '/sap/opu/odata/sap/API_OUTBOUND_DELIVERY_SRV;v=2/',
    'API_OUTBOUND_DELIVERY_SRV v2 - Service Document'
  );
  
  // Test 4: Try metadata
  await testUrl(
    '/sap/opu/odata/sap/API_OUTBOUND_DELIVERY_SRV;v=2/$metadata',
    'API_OUTBOUND_DELIVERY_SRV v2 - Metadata'
  );
  
  console.log('\n' + '='.repeat(70));
  console.log('Test Complete');
  console.log('='.repeat(70));
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});




