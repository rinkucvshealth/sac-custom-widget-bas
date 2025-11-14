const axios = require('axios');
const https = require('https');

const agent = new https.Agent({ rejectUnauthorized: false });
const baseURL = 'https://vhssnds4ci.hec.sonos.com:44300';
const auth = { username: 'AIDATABOT', password: '<REPLACE_WITH_SAP_PASSWORD>' };

const serviceName = 'API_CUSTOMER_RETURNS_DELIVERY_SRV';
const entityName = 'A_ReturnsDeliveryItem';

async function testService() {
  console.log('Testing API_CUSTOMER_RETURNS_DELIVERY_SRV...\n');
  console.log(`Service: ${serviceName}`);
  console.log(`Entity: ${entityName}`);
  console.log(`User: ${auth.username}`);
  console.log(`Client: 500\n`);
  
  try {
    // Test 1: Metadata access
    console.log('Test 1: Metadata access');
    const metadataUrl = `${baseURL}/sap/opu/odata/sap/${serviceName}/$metadata`;
    const metadataResponse = await axios.get(metadataUrl, {
      auth,
      httpsAgent: agent,
      params: { 'sap-client': '500' },
      timeout: 10000
    });
    console.log(`✅ Metadata Status: ${metadataResponse.status}`);
    
    // Test 2: Entity access with $top=1
    console.log('\nTest 2: Entity access with $top=1');
    const entityUrl = `${baseURL}/sap/opu/odata/sap/${serviceName}/${entityName}`;
    const entityResponse = await axios.get(entityUrl, {
      auth,
      httpsAgent: agent,
      params: { 
        'sap-client': '500',
        '$top': 1,
        '$format': 'json'
      },
      timeout: 10000
    });
    
    console.log(`✅ Entity Status: ${entityResponse.status}`);
    console.log(`✅ Records returned: ${entityResponse.data?.value?.length || entityResponse.data?.d?.results?.length || 0}`);
    
    if (entityResponse.data?.value?.length > 0 || entityResponse.data?.d?.results?.length > 0) {
      const record = entityResponse.data?.value?.[0] || entityResponse.data?.d?.results?.[0];
      console.log(`✅ Sample record fields: ${Object.keys(record).slice(0, 10).join(', ')}...`);
      console.log(`✅ First record sample:`, JSON.stringify(record, null, 2).substring(0, 500));
    }
    
    // Test 3: With $top=10 to get more records
    console.log('\nTest 3: Entity access with $top=10');
    const entityResponse2 = await axios.get(entityUrl, {
      auth,
      httpsAgent: agent,
      params: { 
        'sap-client': '500',
        '$top': 10,
        '$format': 'json'
      },
      timeout: 10000
    });
    
    console.log(`✅ Entity Status: ${entityResponse2.status}`);
    console.log(`✅ Records returned: ${entityResponse2.data?.value?.length || entityResponse2.data?.d?.results?.length || 0}`);
    
    console.log('\n✅ SERVICE IS ACCESSIBLE!');
    
  } catch (error) {
    console.log(`❌ Error: ${error.response?.status || 'N/A'}`);
    if (error.response?.data) {
      console.log(`❌ Error Data:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`❌ Error Message: ${error.message}`);
    }
    console.log('\n❌ SERVICE IS NOT ACCESSIBLE');
  }
}

testService().catch(console.error);

