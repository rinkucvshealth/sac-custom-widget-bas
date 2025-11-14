const axios = require('axios');
const https = require('https');

const agent = new https.Agent({ rejectUnauthorized: false });
const baseURL = 'https://vhssnds4ci.hec.sonos.com:44300';
const auth = { username: 'AIDATABOT', password: '<REPLACE_WITH_SAP_PASSWORD>' };

// API configurations with their entities
const apisToTest = [
  { service: 'API_CUSTOMER_RETURNS_DELIVERY_SRV', entity: 'A_ReturnsDeliveryItem' },
  { service: 'API_GLACCOUNTLINEITEM', entity: 'GLAccountLineItem' },
  { service: 'API_MATERIAL_DOCUMENT_SRV', entity: 'A_MaterialDocumentItem' },
  { service: 'MMIM_MATERIAL_DATA_SRV', entity: 'I_InvtryMgmtMatlMstrVH' },
  { service: 'API_CUSTOMER_MATERIAL_SRV', entity: 'A_CustomerMaterial' },
  { service: 'API_PURCHASEORDER_PROCESS_SRV', entity: 'A_PurchaseOrder' },
  { service: 'API_INBOUND_DELIVERY_SRV', entity: 'A_InbDeliveryHeader' },
  { service: 'API_OUTBOUND_DELIVERY_SRV', entity: 'A_OutbDeliveryHeader' },
  { service: 'API_SALES_ORDER_SRV', entity: 'A_SalesOrder' },
  { service: 'API_BILLING_DOCUMENT_SRV', entity: 'A_BillingDocument' },
  { service: 'API_CREDIT_MEMO_REQUEST_SRV', entity: 'A_CreditMemoRequest' },
  { service: 'API_CUSTOMER_RETURN_SRV', entity: 'A_CustomerReturn' },
  { service: 'UI_MATERIALSERIALNUMBER', entity: 'MaterialSerialNumber' },
  { service: 'MM_SUPPLIER_INVOICE_MANAGE', entity: 'A_SupplierInvoice' }
];

async function testAPI(apiConfig) {
  const { service, entity } = apiConfig;
  const result = {
    service,
    entity,
    metadataStatus: null,
    entityStatus: null,
    gatewayServiceName: null,
    errorCode: null,
    errorMessage: null,
    accessible: false,
    accessNeeded: []
  };

  try {
    // Test 1: Metadata
    const metadataUrl = `${baseURL}/sap/opu/odata/sap/${service}/$metadata`;
    const metadataResponse = await axios.get(metadataUrl, {
      auth,
      httpsAgent: agent,
      params: { 'sap-client': '500' },
      timeout: 10000
    });
    result.metadataStatus = metadataResponse.status;
  } catch (error) {
    result.metadataStatus = error.response?.status || 'ERROR';
    result.errorMessage = error.response?.data?.error?.message?.value || error.message;
    result.errorCode = error.response?.data?.error?.code;
  }

  try {
    // Test 2: Entity data
    const entityUrl = `${baseURL}/sap/opu/odata/sap/${service}/${entity}`;
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
    result.entityStatus = entityResponse.status;
    result.accessible = true;
  } catch (error) {
    result.entityStatus = error.response?.status || 'ERROR';
    
    if (error.response?.data?.error) {
      const errorData = error.response.data.error;
      result.errorCode = errorData.code;
      result.errorMessage = errorData.message?.value || JSON.stringify(errorData.message);
      
      // Extract Gateway service name from error
      if (errorData.innererror?.application) {
        const app = errorData.innererror.application;
        result.gatewayServiceName = app.service_id ? `Z${app.service_id}_${app.service_version || '0001'}` : null;
      }
      
      // Determine what access is needed
      if (result.entityStatus === 403) {
        if (result.errorCode === '/IWFND/CM_CONSUMER/101') {
          result.accessNeeded.push('Gateway Service Authorization');
          result.accessNeeded.push(`Service: ${result.gatewayServiceName || service}`);
          result.accessNeeded.push('Authorization Object: /IWFND/CM_CONSUMER');
        } else {
          result.accessNeeded.push('SAP Authorization');
          result.accessNeeded.push(`Error: ${result.errorCode}`);
        }
      } else if (result.entityStatus === 404) {
        result.accessNeeded.push('Service Activation in Gateway');
        result.accessNeeded.push(`Check transaction /IWFND/MAINT_SERVICE`);
      }
    } else {
      result.errorMessage = error.message;
    }
  }

  return result;
}

async function runAllTests() {
  console.log('='.repeat(80));
  console.log('COMPREHENSIVE API ACCESS TEST');
  console.log('='.repeat(80));
  console.log(`User: ${auth.username}`);
  console.log(`Client: 500`);
  console.log(`Base URL: ${baseURL}\n`);

  const results = [];
  
  for (const apiConfig of apisToTest) {
    console.log(`Testing: ${apiConfig.service} / ${apiConfig.entity}...`);
    const result = await testAPI(apiConfig);
    results.push(result);
    
    // Brief status
    if (result.accessible) {
      console.log(`  ✅ ACCESSIBLE (Metadata: ${result.metadataStatus}, Entity: ${result.entityStatus})\n`);
    } else {
      console.log(`  ❌ NOT ACCESSIBLE (Metadata: ${result.metadataStatus}, Entity: ${result.entityStatus})`);
      if (result.errorMessage) {
        console.log(`     Error: ${result.errorMessage.substring(0, 80)}...\n`);
      } else {
        console.log(`\n`);
      }
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Generate summary table
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY TABLE');
  console.log('='.repeat(80));
  console.log('\n| Service | Entity | Metadata | Entity Data | Gateway Service | Status | Access Needed |');
  console.log('|'.padEnd(10, '-') + '|'.padEnd(20, '-') + '|'.padEnd(12, '-') + '|'.padEnd(15, '-') + '|'.padEnd(20, '-') + '|'.padEnd(10, '-') + '|'.padEnd(50, '-') + '|');
  
  results.forEach(r => {
    const service = r.service.substring(0, 30);
    const entity = r.entity.substring(0, 18);
    const metadata = r.metadataStatus || 'N/A';
    const entityData = r.entityStatus || 'N/A';
    const gateway = (r.gatewayServiceName || 'N/A').substring(0, 18);
    const status = r.accessible ? '✅ OK' : '❌ FAIL';
    const accessNeeded = r.accessNeeded.length > 0 ? r.accessNeeded.join('; ') : 'None';
    
    console.log(`| ${service.padEnd(28)} | ${entity.padEnd(18)} | ${String(metadata).padEnd(10)} | ${String(entityData).padEnd(13)} | ${gateway.padEnd(18)} | ${status.padEnd(8)} | ${accessNeeded.substring(0, 48).padEnd(48)} |`);
  });

  // Count summary
  const accessible = results.filter(r => r.accessible).length;
  const notAccessible = results.filter(r => !r.accessible).length;
  const metadataOnly = results.filter(r => r.metadataStatus === 200 && !r.accessible).length;

  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY STATISTICS');
  console.log('='.repeat(80));
  console.log(`Total APIs Tested: ${results.length}`);
  console.log(`✅ Fully Accessible: ${accessible}`);
  console.log(`⚠️  Metadata Only (Entity 403): ${metadataOnly}`);
  console.log(`❌ Not Accessible: ${notAccessible}`);

  // Detailed access requirements
  console.log('\n' + '='.repeat(80));
  console.log('DETAILED ACCESS REQUIREMENTS');
  console.log('='.repeat(80));
  
  const needsAccess = results.filter(r => !r.accessible && r.accessNeeded.length > 0);
  needsAccess.forEach(r => {
    console.log(`\n${r.service} / ${r.entity}:`);
    console.log(`  Status: ${r.entityStatus} ${r.errorCode || ''}`);
    console.log(`  Gateway Service: ${r.gatewayServiceName || 'N/A'}`);
    console.log(`  Access Needed:`);
    r.accessNeeded.forEach(need => console.log(`    - ${need}`));
  });

  return results;
}

runAllTests().catch(console.error);

