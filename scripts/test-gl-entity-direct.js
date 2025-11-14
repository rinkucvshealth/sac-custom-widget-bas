const axios = require('axios');
const https = require('https');

const agent = new https.Agent({ rejectUnauthorized: false });
const baseURL = 'https://vhssnds4ci.hec.sonos.com:44300';
const auth = { username: 'AIDATABOT', password: '<REPLACE_WITH_SAP_PASSWORD>' };

const entityPath = '/sap/opu/odata/sap/API_GLACCOUNTLINEITEM/GLAccountLineItem';

async function testEntity() {
  console.log('Testing direct entity access...\n');
  console.log(`URL: ${baseURL}${entityPath}`);
  console.log(`User: ${auth.username}`);
  console.log(`Client: 500\n`);
  
  try {
    // Test 1: Basic access with $top=1
    console.log('Test 1: Basic access with $top=1');
    const response1 = await axios.get(`${baseURL}${entityPath}`, {
      auth,
      httpsAgent: agent,
      params: { 
        'sap-client': '500',
        '$top': 1,
        '$format': 'json'
      },
      timeout: 10000
    });
    
    console.log(`✅ Status: ${response1.status}`);
    console.log(`✅ Records returned: ${response1.data?.value?.length || response1.data?.d?.results?.length || 0}`);
    if (response1.data?.value?.length > 0 || response1.data?.d?.results?.length > 0) {
      const record = response1.data?.value?.[0] || response1.data?.d?.results?.[0];
      console.log(`✅ Sample record fields: ${Object.keys(record).slice(0, 10).join(', ')}...`);
    }
    
    // Test 2: With filters (the actual query from the widget)
    console.log('\nTest 2: With filters (GL Account 41000000, Fiscal Year 2026, Company Code 1710, Ledger 0L)');
    const response2 = await axios.get(`${baseURL}${entityPath}`, {
      auth,
      httpsAgent: agent,
      params: { 
        'sap-client': '500',
        '$top': 100,
        '$format': 'json',
        '$filter': "GLAccount eq '41000000' and FiscalYear eq '2026' and CompanyCode eq '1710' and Ledger eq '0L'"
      },
      timeout: 10000
    });
    
    console.log(`✅ Status: ${response2.status}`);
    console.log(`✅ Records returned: ${response2.data?.value?.length || response2.data?.d?.results?.length || 0}`);
    if (response2.data?.value?.length > 0 || response2.data?.d?.results?.length > 0) {
      const records = response2.data?.value || response2.data?.d?.results;
      console.log(`✅ First record:`, JSON.stringify(records[0], null, 2).substring(0, 500));
      
      // Check for amount field
      const amountField = records[0].AmountInFreeDefinedCurrency1 || records[0].OSL || records[0].Amount;
      if (amountField !== undefined) {
        console.log(`✅ Amount field found: ${Object.keys(records[0]).find(k => k.includes('Amount') || k === 'OSL')}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.response?.status || 'N/A'}`);
    if (error.response?.data) {
      console.log(`❌ Error Data:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`❌ Error Message: ${error.message}`);
    }
  }
}

testEntity().catch(console.error);

