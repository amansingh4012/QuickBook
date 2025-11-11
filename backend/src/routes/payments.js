const express = require('express');
const { body, param } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentDetails,
  handlePaymentWebhook,
  getPaymentHistory
} = require('../controllers/paymentController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentIntent:
 *       type: object
 *       required:
 *         - showId
 *         - seats
 *       properties:
 *         showId:
 *           type: string
 *           description: ID of the show to book
 *           example: "123"
 *         seats:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of seat identifiers (max 6)
 *           example: ["A1", "A2", "B1"]
 *           maxItems: 6
 *           minItems: 1
 *     
 *     PaymentIntentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         paymentId:
 *           type: integer
 *           example: 1
 *         clientSecret:
 *           type: string
 *           example: "pi_xxx_secret_yyy"
 *         amount:
 *           type: number
 *           example: 300.00
 *         show:
 *           type: object
 *         seats:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/payments/create-order:
 *   post:
 *     summary: Create a mock payment order for booking
 *     description: Initialize a mock payment process for the selected seats (no external service)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentIntent'
 *     responses:
 *       200:
 *         description: Razorpay order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentIntentResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Show not found
 *       503:
 *         description: Payment service not configured
 */
router.post('/create-order',
  authMiddleware,
  [
    body('showId')
      .notEmpty()
      .withMessage('Show ID is required')
      .isNumeric()
      .withMessage('Show ID must be a valid number'),
    body('seats')
      .isArray({ min: 1, max: 6 })
      .withMessage('Seats must be an array with 1-6 elements')
      .custom((seats) => {
        if (!Array.isArray(seats)) return false;
        const seatPattern = /^[A-Ja-j]([1-9]|10)$/;
        return seats.every(seat => 
          typeof seat === 'string' && seatPattern.test(seat.trim())
        );
      })
      .withMessage('Each seat must be in format A1-J10 (e.g., A1, B5, J10)')
  ],
  createPaymentIntent
);

/**
 * @swagger
 * /api/payments/verify:
 *   post:
 *     summary: Verify mock payment and create booking
 *     description: Verify mock payment signature and create the booking if payment is successful
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razorpay_order_id
 *               - razorpay_payment_id
 *               - razorpay_signature
 *               - paymentId
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *               razorpay_payment_id:
 *                 type: string
 *               razorpay_signature:
 *                 type: string
 *               paymentId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Payment verified and booking created
 *       400:
 *         description: Payment verification failed
 *       403:
 *         description: Unauthorized access to payment
 *       404:
 *         description: Payment not found
 *       409:
 *         description: Seat booking conflict
 */
router.post('/verify',
  authMiddleware,
  [
    body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
    body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
    body('razorpay_signature').notEmpty().withMessage('Signature is required'),
    body('paymentId').isNumeric().withMessage('Payment ID must be a valid number')
  ],
  confirmPayment
);

/**
 * @swagger
 * /api/payments/history:
 *   get:
 *     summary: Get user's payment history
 *     description: Retrieve all payments made by the authenticated user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/history',
  authMiddleware,
  getPaymentHistory
);

/**
 * @swagger
 * /api/payments/{paymentId}:
 *   get:
 *     summary: Get payment details
 *     description: Retrieve details of a specific payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The payment ID
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
 *       403:
 *         description: Unauthorized access to payment
 *       404:
 *         description: Payment not found
 */
router.get('/:paymentId',
  authMiddleware,
  [
    param('paymentId')
      .isNumeric()
      .withMessage('Payment ID must be a valid number')
  ],
  getPaymentDetails
);

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Mock payment webhook endpoint
 *     description: Handle mock payment webhook events (no-op for mock payments)
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook signature
 *       500:
 *         description: Webhook processing error
 */
router.post('/webhook',
  handlePaymentWebhook
);

module.exports = router;
