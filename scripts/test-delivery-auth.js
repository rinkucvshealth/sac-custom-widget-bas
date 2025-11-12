/**
 * Detailed Test for Delivery Services Authorization
 * Tests API_INBOUND_DELIVERY_SRV and API_OUTBOUND_DELIVERY_SRV
 * to get detailed error messages
 */

const axios = require('axios');
const https = require('https');

const SAP_HOST = process.env.SAP_HOST || 'vhssnds4ci.hec.sonos.com';
const SAP_PORT = process.env.SAP_PORT || '44300';
const SAP_USERNAME = process.env.SAP_USERNAME || 'AIDATABOT';
const SAP_PASSWORD = process.env.SAP_PASSWORD || 'Welcome@2025';
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

async function testService(serviceName) {
  console.log('\n' + '='.repeat(70));
  console.log(`Testing: ${serviceName}`);
  console.log('='.repeat(70));
  
  try {
    const metadataUrl = `/sap/opu/odata/sap/${serviceName}/$metadata`;
    console.log(`\n📍 URL: ${baseURL}${metadataUrl}`);
    console.log(`👤 User: ${SAP_USERNAME}`);
    console.log(`🏢 Client: ${SAP_CLIENT}`);
    
    const response = await client.get(metadataUrl, {
      headers: {
        'Accept': 'application/xml'
      }
    });
    
    console.log(`\n✅ Status: ${response.status}`);
    console.log(`✅ Service is accessible`);
    
  } catch (error) {
    const status = error.response?.status;
    const errorData = error.response?.data;
    
    console.log(`\n❌ Status: ${status || 'N/A'}`);
    console.log(`❌ Error Type: ${error.response ? 'HTTP Error' : error.code || 'Network Error'}`);
    
    if (error.response) {
      console.log(`\n📋 Full Error Response:`);
      console.log(JSON.stringify(error.response.data, null, 2));
      
      if (error.response.data?.error) {
        const sapError = error.response.data.error;
        console.log(`\n🔍 SAP Error Details:`);
        console.log(`   Code: ${sapError.code || 'N/A'}`);
        console.log(`   Message: ${sapError.message?.value || sapError.message || 'N/A'}`);
        console.log(`   Inner Error: ${JSON.stringify(sapError.innererror || {}, null, 2)}`);
        
        if (sapError.message?.value) {
          console.log(`\n💡 Authorization Issue:`);
          const message = sapError.message.value;
          if (message.includes('authorization') || message.includes('authorized')) {
            console.log(`   - This is an authorization/permission issue`);
            console.log(`   - The service exists but user lacks access permissions`);
            console.log(`   - Contact SAP Basis admin to grant authorization`);
            console.log(`   - Required authorization objects:`);
            console.log(`     • S_SD_DLV (Delivery Documents)`);
            console.log(`     • S_VL (Shipping)`);
            console.log(`     • S_WM_* (Warehouse Management - for Inbound)`);
          }
        }
      }
    } else {
      console.log(`\n❌ Error: ${error.message}`);
      if (error.code) {
        console.log(`   Error Code: ${error.code}`);
      }
    }
  }
}

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('SAP Delivery Services Authorization Test');
  console.log('='.repeat(70));
  
  await testService('API_INBOUND_DELIVERY_SRV');
  await testService('API_OUTBOUND_DELIVERY_SRV');
  
  console.log('\n' + '='.repeat(70));
  console.log('Test Complete');
  console.log('='.repeat(70));
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});




