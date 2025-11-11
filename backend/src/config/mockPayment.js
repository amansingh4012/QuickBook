/**
 * Mock Payment Gateway - For Testing Only
 * No signup, no API keys, no PAN required!
 * Perfect for development and testing
 */

class MockPaymentGateway {
  constructor() {
    this.name = 'Mock Payment Gateway';
    this.enabled = true;
    
    // Mimic Razorpay's API structure
    this.orders = {
      create: this.createOrder.bind(this)
    };
  }

  /**
   * Create a mock order
   */
  async createOrder({ amount, currency, receipt, notes }) {
    // Simulate API delay
    await this.simulateDelay(500);

    const orderId = `order_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      id: orderId,
      entity: 'order',
      amount: amount,
      amount_paid: 0,
      amount_due: amount,
      currency: currency || 'INR',
      receipt: receipt,
      status: 'created',
      attempts: 0,
      notes: notes || {},
      created_at: Math.floor(Date.now() / 1000)
    };
  }

  /**
   * Verify payment signature
   * In mock mode, we always return true for test payments
   */
  verifySignature(orderId, paymentId, signature) {
    // In a real scenario, this would verify HMAC signature
    // For mock, we accept any signature that matches our pattern
    return signature && signature.startsWith('mock_sig_');
  }

  /**
   * Simulate payment success
   */
  async processPayment(orderId, paymentMethod = 'card') {
    await this.simulateDelay(1000);

    const paymentId = `pay_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const signature = `mock_sig_${orderId}_${paymentId}`;

    return {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature
    };
  }

  /**
   * Simulate API delay
   */
  simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get payment status (always successful in mock)
   */
  async getPaymentStatus(paymentId) {
    await this.simulateDelay(200);

    return {
      id: paymentId,
      entity: 'payment',
      status: 'captured',
      method: 'card',
      amount: 0,
      currency: 'INR',
      captured: true,
      created_at: Math.floor(Date.now() / 1000)
    };
  }
}

// Export singleton instance
const mockPayment = new MockPaymentGateway();

module.exports = mockPayment;
