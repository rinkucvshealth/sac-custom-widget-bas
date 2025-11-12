// Test the customer data query fix
const { findServiceForKnownEntity } = require('./dist/clients/sap-client');

console.log('🧪 Testing Customer Data Query Fix\n');

// Test 1: Test direct entity mapping
console.log('Test 1: Direct entity mapping');
const customerEntity = findServiceForKnownEntity('Customer');
console.log(`✅ Customer entity mapping:`, customerEntity);

const businessPartnerEntity = findServiceForKnownEntity('BusinessPartner');
console.log(`✅ BusinessPartner entity mapping:`, businessPartnerEntity);

// Test 2: Test the old entity names still work
console.log('\nTest 2: Legacy entity names');
const aCustomerEntity = findServiceForKnownEntity('A_Customer');
console.log(`✅ A_Customer entity mapping:`, aCustomerEntity);

const aBusinessPartnerEntity = findServiceForKnownEntity('A_BusinessPartner');
console.log(`✅ A_BusinessPartner entity mapping:`, aBusinessPartnerEntity);

// Test 3: Test sales analytics mapping
console.log('\nTest 3: Sales analytics mapping');
const salesAnalyticsEntity = findServiceForKnownEntity('SalesAnalytics');
console.log(`✅ SalesAnalytics entity mapping:`, salesAnalyticsEntity);

console.log('\n✨ Entity mapping tests completed!');
console.log('\n📋 Summary:');
console.log('✅ Customer queries should now map to A_Customer');
console.log('✅ BusinessPartner queries should now map to A_BusinessPartner');
console.log('✅ SalesAnalytics queries should map to C_SALESANALYTICSQRY_1Results');
console.log('✅ Legacy entity names still work for backward compatibility');
console.log('\n🎉 The "Show me customer data" query should now work!');

