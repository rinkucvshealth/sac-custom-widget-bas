/**
 * Comprehensive App Test Suite
 * Tests the SAC Custom Widget application structure and functionality
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(80));
  log(title, 'cyan');
  console.log('='.repeat(80));
}

function logTest(name, passed, message = '') {
  const status = passed ? '✓' : '✗';
  const color = passed ? 'green' : 'red';
  log(`  ${status} ${name}`, color);
  if (message) {
    log(`    ${message}`, passed ? 'reset' : 'yellow');
  }
}

// Test results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function runTest(name, testFn) {
  try {
    const result = testFn();
    if (result === true) {
      logTest(name, true);
      results.passed++;
      return true;
    } else if (result === false) {
      logTest(name, false, 'Test returned false');
      results.failed++;
      return false;
    } else if (typeof result === 'object' && result.passed !== undefined) {
      logTest(name, result.passed, result.message || '');
      if (result.passed) {
        results.passed++;
      } else {
        results.failed++;
      }
      if (result.warning) {
        results.warnings++;
      }
      return result.passed;
    }
  } catch (error) {
    logTest(name, false, error.message);
    results.failed++;
    return false;
  }
}

// Test 1: Check if dist directory exists (build output)
function testBuildOutput() {
  logSection('1. Build Output Tests');
  
  const distExists = fs.existsSync(path.join(__dirname, 'dist'));
  runTest('dist directory exists', () => distExists);
  
  if (distExists) {
    const requiredFiles = [
      'dist/server.js',
      'dist/routes/chat.js',
      'dist/config.js',
      'dist/clients/openai-client.js',
      'dist/clients/sap-client.js'
    ];
    
    requiredFiles.forEach(file => {
      const exists = fs.existsSync(path.join(__dirname, file));
      runTest(`${file} exists`, () => exists);
    });
  }
}

// Test 2: Check source files
function testSourceFiles() {
  logSection('2. Source File Tests');
  
  const requiredSourceFiles = [
    'src/server.ts',
    'src/routes/chat.ts',
    'src/config.ts',
    'src/clients/openai-client.ts',
    'src/clients/sap-client.ts',
    'src/clients/destination-client.ts',
    'src/utils/logger.ts',
    'src/constants.ts',
    'src/types/index.ts'
  ];
  
  requiredSourceFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    runTest(`${file} exists`, () => exists);
  });
}

// Test 3: Check widget files
function testWidgetFiles() {
  logSection('3. Widget File Tests');
  
  const widgetFiles = [
    'widget/widget.js',
    'widget/widget.json'
  ];
  
  widgetFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    runTest(`${file} exists`, () => exists);
    
    if (exists) {
      try {
        const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
        runTest(`${file} is readable`, () => content.length > 0);
        
        if (file.endsWith('.json')) {
          try {
            JSON.parse(content);
            runTest(`${file} is valid JSON`, () => true);
          } catch (e) {
            runTest(`${file} is valid JSON`, () => false, e.message);
          }
        }
      } catch (e) {
        runTest(`${file} is readable`, () => false, e.message);
      }
    }
  });
}

// Test 4: Check package.json
function testPackageJson() {
  logSection('4. Package Configuration Tests');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    
    runTest('package.json is valid JSON', () => true);
    runTest('package.json has name', () => !!packageJson.name);
    runTest('package.json has version', () => !!packageJson.version);
    runTest('package.json has main entry', () => !!packageJson.main);
    runTest('package.json has scripts', () => !!packageJson.scripts);
    
    const requiredScripts = ['build', 'start', 'dev'];
    requiredScripts.forEach(script => {
      runTest(`package.json has ${script} script`, () => !!packageJson.scripts[script]);
    });
    
    const requiredDependencies = [
      'express',
      'openai',
      'axios',
      'cors',
      '@sap/xsenv',
      '@sap/xssec'
    ];
    
    requiredDependencies.forEach(dep => {
      runTest(`package.json has ${dep} dependency`, () => {
        return !!(packageJson.dependencies && packageJson.dependencies[dep]) ||
               !!(packageJson.devDependencies && packageJson.devDependencies[dep]);
      });
    });
    
  } catch (e) {
    runTest('package.json is valid JSON', () => false, e.message);
  }
}

// Test 5: Check TypeScript configuration
function testTypeScriptConfig() {
  logSection('5. TypeScript Configuration Tests');
  
  try {
    const tsConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'tsconfig.json'), 'utf8'));
    
    runTest('tsconfig.json is valid JSON', () => true);
    runTest('tsconfig.json has compilerOptions', () => !!tsConfig.compilerOptions);
    runTest('tsconfig.json has outDir', () => !!tsConfig.compilerOptions.outDir);
    runTest('tsconfig.json has rootDir', () => !!tsConfig.compilerOptions.rootDir);
    
  } catch (e) {
    runTest('tsconfig.json is valid JSON', () => false, e.message);
  }
}

// Test 6: Check for common code issues
function testCodeQuality() {
  logSection('6. Code Quality Tests');
  
  // Check for console.log in production code (should use logger)
  const srcFiles = [
    'src/server.ts',
    'src/routes/chat.ts',
    'src/config.ts'
  ];
  
  srcFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const hasConsoleLog = content.includes('console.log') && !content.includes('// console.log');
      runTest(`${file} doesn't use console.log`, () => !hasConsoleLog, 
        hasConsoleLog ? 'Found console.log - should use logger instead' : '');
    }
  });
  
  // Check if logger is imported in main files
  const serverContent = fs.readFileSync(path.join(__dirname, 'src/server.ts'), 'utf8');
  runTest('server.ts imports logger', () => serverContent.includes('logger'));
  
  const chatContent = fs.readFileSync(path.join(__dirname, 'src/routes/chat.ts'), 'utf8');
  runTest('chat.ts imports logger', () => chatContent.includes('logger'));
}

// Test 7: Check widget.json structure
function testWidgetJson() {
  logSection('7. Widget JSON Structure Tests');
  
  try {
    const widgetJsonPath = path.join(__dirname, 'widget/widget.json');
    if (fs.existsSync(widgetJsonPath)) {
      const widgetJson = JSON.parse(fs.readFileSync(widgetJsonPath, 'utf8'));
      
      runTest('widget.json has name', () => !!widgetJson.name);
      runTest('widget.json has version', () => !!widgetJson.version);
      runTest('widget.json has description', () => !!widgetJson.description);
      runTest('widget.json has newInstancePrefix', () => !!widgetJson.newInstancePrefix || !!widgetJson.newInstance);
      runTest('widget.json has properties', () => typeof widgetJson.properties === 'object' && widgetJson.properties !== null);
      
      // Check for required properties
      if (widgetJson.properties && typeof widgetJson.properties === 'object') {
        const hasApiEndpoint = widgetJson.properties.hasOwnProperty('apiEndpoint') || 
                               widgetJson.properties.hasOwnProperty('api_endpoint');
        runTest('widget.json has apiEndpoint property', () => hasApiEndpoint);
        
        const hasApiKey = widgetJson.properties.hasOwnProperty('apiKey');
        runTest('widget.json has apiKey property', () => hasApiKey);
      }
      
      // Check for webcomponents
      runTest('widget.json has webcomponents', () => Array.isArray(widgetJson.webcomponents) && widgetJson.webcomponents.length > 0);
      
      // Check for methods
      runTest('widget.json has methods', () => typeof widgetJson.methods === 'object' && widgetJson.methods !== null);
      
      // Check for events
      runTest('widget.json has events', () => typeof widgetJson.events === 'object' && widgetJson.events !== null);
    }
  } catch (e) {
    runTest('widget.json structure', () => false, e.message);
  }
}

// Test 8: Check environment configuration
function testEnvironmentConfig() {
  logSection('8. Environment Configuration Tests');
  
  const envExampleExists = fs.existsSync(path.join(__dirname, '.env.example'));
  runTest('.env.example exists', () => envExampleExists, 
    envExampleExists ? '' : 'Consider creating .env.example for documentation');
  
  const envExists = fs.existsSync(path.join(__dirname, '.env'));
  runTest('.env exists', () => ({
    passed: envExists,
    warning: !envExists,
    message: envExists ? '' : '⚠️  .env file not found - required for running the app'
  }));
  
  if (envExists) {
    try {
      // Try to read .env file, but it might be in .gitignore/.cursorignore
      const envPath = path.join(__dirname, '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const requiredVars = [
          'SAP_HOST',
          'SAP_PORT',
          'SAP_CLIENT',
          'SAP_USERNAME',
          'SAP_PASSWORD',
          'OPENAI_API_KEY',
          'API_KEY'
        ];
        
        requiredVars.forEach(varName => {
          // Check if variable exists (as key, may or may not have value)
          const hasVar = new RegExp(`^\\s*${varName}\\s*=`).test(envContent) || 
                        envContent.includes(`${varName}=`);
          runTest(`.env has ${varName}`, () => ({
            passed: hasVar,
            message: hasVar ? '' : `Missing ${varName} in .env (or file is protected)`
          }));
        });
      } else {
        runTest('.env file is accessible', () => ({
          passed: false,
          message: '.env file not accessible (may be in .gitignore/.cursorignore)'
        }));
      }
    } catch (e) {
      // .env might be protected/ignored, which is fine for security
      runTest('.env is readable', () => ({
        passed: true,
        warning: true,
        message: '.env file exists but cannot be read (this is normal if it\'s in .gitignore/.cursorignore)'
      }));
    }
  }
}

// Test 9: Check for test files
function testTestFiles() {
  logSection('9. Test Files Tests');
  
  const testFiles = [
    'test.html',
    'quick-test.js',
    'scripts/test-api-access.js'
  ];
  
  testFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    runTest(`${file} exists`, () => exists);
  });
}

// Test 10: Check documentation
function testDocumentation() {
  logSection('10. Documentation Tests');
  
  const docFiles = [
    'README.md',
    'QUICK_START.md'
  ];
  
  docFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    runTest(`${file} exists`, () => exists);
    
    if (exists) {
      const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
      runTest(`${file} has content`, () => content.length > 100);
    }
  });
}

// Main test runner
function runAllTests() {
  console.log('\n');
  log('╔══════════════════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                   SAC Custom Widget - App Test Suite                        ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════════════════════════╝', 'cyan');
  
  testBuildOutput();
  testSourceFiles();
  testWidgetFiles();
  testPackageJson();
  testTypeScriptConfig();
  testCodeQuality();
  testWidgetJson();
  testEnvironmentConfig();
  testTestFiles();
  testDocumentation();
  
  // Summary
  logSection('Test Summary');
  log(`Total Tests: ${results.passed + results.failed}`, 'cyan');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Warnings: ${results.warnings}`, results.warnings > 0 ? 'yellow' : 'reset');
  
  const successRate = ((results.passed / (results.passed + results.failed)) * 100).toFixed(1);
  log(`Success Rate: ${successRate}%`, successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red');
  
  console.log('\n');
  
  if (results.failed === 0) {
    log('✅ All tests passed!', 'green');
    return 0;
  } else {
    log('❌ Some tests failed. Please review the output above.', 'red');
    return 1;
  }
}

// Run tests
const exitCode = runAllTests();
process.exit(exitCode);

