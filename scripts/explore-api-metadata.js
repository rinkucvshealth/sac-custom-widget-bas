/**
 * API Metadata Explorer
 * 
 * Run this script to discover field names for a new API:
 * node scripts/explore-api-metadata.js API_SERVICE_NAME ENTITY_NAME
 * 
 * Example:
 * node scripts/explore-api-metadata.js API_GLACCOUNTLINEITEM GLAccountLineItem
 */

const axios = require('axios');
const { config } = require('../dist/config');
const { DestinationService } = require('../dist/clients/destination-client');

async function exploreAPI(serviceName, entityName) {
  console.log(`\n=== Exploring API: ${serviceName}/${entityName} ===\n`);
  
  try {
    // Get destination
    const destinationService = new DestinationService();
    const destination = await destinationService.getDestination('AI_DS4500');
    
    if (!destination) {
      throw new Error('Could not get destination configuration');
    }

    const client = await destinationService.createAxiosClient(destination);
    const baseUrl = `/sap/opu/odata/sap/${serviceName}/${entityName}`;
    
    // 1. Get Metadata
    console.log('1. Fetching OData metadata...');
    try {
      const metadataResponse = await client.get(`${baseUrl}?$metadata`, {
        headers: { 'Accept': 'application/xml' }
      });
      console.log('✓ Metadata retrieved');
      console.log('  (Check metadata XML for field definitions)\n');
    } catch (error) {
      console.log('✗ Metadata not available or error:', error.message);
    }
    
    // 2. Get Sample Data
    console.log('2. Fetching sample record...');
    try {
      const sampleResponse = await client.get(`${baseUrl}?$top=1`, {
        headers: { 'Accept': 'application/json' }
      });
      
      const records = sampleResponse.data.value || sampleResponse.data.d?.results || [];
      
      if (records.length > 0) {
        const sample = records[0];
        const fields = Object.keys(sample);
        
        console.log(`✓ Found ${fields.length} fields in entity:\n`);
        console.log('Field Names:');
        fields.forEach((field, index) => {
          const value = sample[field];
          const type = typeof value;
          const preview = value !== null && value !== undefined 
            ? String(value).substring(0, 30)
            : 'null';
          console.log(`  ${index + 1}. ${field} (${type}): ${preview}`);
        });
        
        console.log('\n3. Sample Record (first 5 fields):');
        const sampleFields = fields.slice(0, 5);
        sampleFields.forEach(field => {
          console.log(`   ${field}: ${JSON.stringify(sample[field])}`);
        });
        
        console.log('\n=== Mapping Template ===\n');
        console.log('Copy this template to src/config/field-mappings.ts:\n');
        console.log(`{`);
        console.log(`  apiName: '${serviceName}',`);
        console.log(`  entityName: '${entityName}',`);
        console.log(`  description: 'Your description here',`);
        console.log(`  mappings: [`);
        
        // Generate template for common fields
        fields.slice(0, 10).forEach(field => {
          console.log(`    {`);
          console.log(`      userFriendly: ['${field}'],`);
          console.log(`      apiFieldName: '${field}',`);
          console.log(`      description: '${field}'`);
          console.log(`    },`);
        });
        
        console.log(`  ]`);
        console.log(`}`);
        
      } else {
        console.log('✗ No records found');
      }
    } catch (error) {
      console.log('✗ Error fetching sample:', error.message);
      if (error.response) {
        console.log('  Status:', error.response.status);
        console.log('  Data:', JSON.stringify(error.response.data).substring(0, 200));
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Get command line arguments
const serviceName = process.argv[2];
const entityName = process.argv[3];

if (!serviceName || !entityName) {
  console.log('Usage: node scripts/explore-api-metadata.js SERVICE_NAME ENTITY_NAME');
  console.log('\nExample:');
  console.log('  node scripts/explore-api-metadata.js API_GLACCOUNTLINEITEM GLAccountLineItem');
  process.exit(1);
}

exploreAPI(serviceName, entityName).catch(console.error);





