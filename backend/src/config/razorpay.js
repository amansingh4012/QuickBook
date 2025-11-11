// Using Mock Payment Gateway - No external service needed!
const mockPayment = require('./mockPayment');

console.log('🧪 Using MOCK Payment Gateway (No signup required!)');
console.log('💡 Perfect for testing without any external service');

module.exports = mockPayment;
