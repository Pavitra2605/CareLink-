require('dotenv').config();

try {
  const app = require('./dist/app').default;
  console.log('✓ App loaded successfully');
} catch (error) {
  console.error('✗ Error loading app:');
  console.error(error);
}
