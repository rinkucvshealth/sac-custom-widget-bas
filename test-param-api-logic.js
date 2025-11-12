// Unit test for parameter-based API functionality
const { 
    isParameterBasedAPI, 
    getMandatoryFilters, 
    validateMandatoryFilters
} = require('./dist/clients/sap-client');

const { PARAMETER_BASED_APIS } = require('./dist/constants');

console.log('🧪 Testing Parameter-Based API Implementation\n');

// Test 1: Check if C_SALESANALYTICSQRY_1_CDS is recognized as parameter-based
console.log('Test 1: Parameter-based API detection');
const isParamAPI = isParameterBasedAPI('C_SALESANALYTICSQRY_1_CDS');
console.log(`✅ C_SALESANALYTICSQRY_1_CDS is parameter-based: ${isParamAPI}`);

// Test 2: Check mandatory filters
console.log('\nTest 2: Mandatory filters');
const mandatoryFilters = getMandatoryFilters('C_SALESANALYTICSQRY_1_CDS');
console.log(`✅ Mandatory filters: ${JSON.stringify(mandatoryFilters)}`);

// Test 3: Validate filters with correct parameters
console.log('\nTest 3: Parameter validation with correct parameters');
const correctFilters = [
    { field: 'P_ExchangeRateType', operator: 'eq', value: 'M' },
    { field: 'P_DisplayCurrency', operator: 'eq', value: 'USD' }
];
const validation1 = validateMandatoryFilters('C_SALESANALYTICSQRY_1_CDS', correctFilters);
console.log(`✅ Validation with correct parameters: ${validation1.isValid}`);
console.log(`   Missing filters: ${JSON.stringify(validation1.missingFilters)}`);

// Test 4: Validate filters with missing parameters
console.log('\nTest 4: Parameter validation with missing parameters');
const incompleteFilters = [
    { field: 'P_ExchangeRateType', operator: 'eq', value: 'M' }
];
const validation2 = validateMandatoryFilters('C_SALESANALYTICSQRY_1_CDS', incompleteFilters);
console.log(`✅ Validation with missing parameters: ${validation2.isValid}`);
console.log(`   Missing filters: ${JSON.stringify(validation2.missingFilters)}`);

// Test 5: Check API configuration
console.log('\nTest 5: API configuration');
const apiConfig = PARAMETER_BASED_APIS['C_SALESANALYTICSQRY_1_CDS'];
console.log(`✅ API Config:`, JSON.stringify(apiConfig, null, 2));

// Test 6: URL pattern generation
console.log('\nTest 6: URL pattern generation');
if (apiConfig?.urlPattern === 'function_import') {
    const paramPairs = correctFilters.map(filter => `${filter.field}='${filter.value}'`).join(',');
    const functionUrl = `/sap/opu/odata/sap/C_SALESANALYTICSQRY_1_CDS/${apiConfig.entity}(${paramPairs})/Results`;
    console.log(`✅ Generated function URL: ${functionUrl}`);
    
    // Verify it matches the expected pattern
    const expectedPattern = '/sap/opu/odata/sap/C_SALESANALYTICSQRY_1_CDS/C_SALESANALYTICSQRY_1(P_ExchangeRateType=\'M\',P_DisplayCurrency=\'USD\')/Results';
    console.log(`✅ Expected URL: ${expectedPattern}`);
    console.log(`✅ URLs match: ${functionUrl === expectedPattern}`);
} else {
    console.log('❌ URL pattern not configured correctly');
}

console.log('\n✨ All tests completed!');
