const axios = require('axios');
const https = require('https');

const agent = new https.Agent({ rejectUnauthorized: false });
const baseURL = 'https://vhssnds4ci.hec.sonos.com:44300';
const auth = { username: 'AIDATABOT', password: '<REPLACE_WITH_SAP_PASSWORD>' };

const services = [
  'API_GLACCOUNTLINEITEM',
  'API_GLACCOUNTLINEITEM;v=2',
  'API_GLACCOUNTLINEITEM_0001',
  'ZAPI_GLACCOUNTLINEITEM_0001'
];

async function testService(serviceName) {
  const url = `${baseURL}/sap/opu/odata/sap/${serviceName}/GLAccountLineItem?$top=1`;
  try {
    const response = await axios.get(url, {
      auth,
      httpsAgent: agent,
      params: { 'sap-client': '500' },
      timeout: 5000
    });
    return { service: serviceName, status: response.status, success: true };
  } catch (error) {
    const errorMsg = error.response?.data?.error?.message?.value || error.message;
    return { 
      service: serviceName, 
      status: error.response?.status || 'N/A', 
      error: errorMsg,
      success: false 
    };
  }
}

async function runTests() {
  console.log('Testing different service name variations...\n');
  
  const results = await Promise.all(services.map(testService));
  
  console.log('Results:');
  results.forEach(r => {
    if (r.success) {
      console.log(`  ✅ ${r.service}: SUCCESS (${r.status})`);
    } else {
      console.log(`  ❌ ${r.service}: FAILED (${r.status}) - ${r.error}`);
    }
  });
}

runTests().catch(console.error);

