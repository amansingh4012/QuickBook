const { validationResult } = require('express-validator');
const prisma = require('../config/prismaClient');
const mockPayment = require('../config/mockPayment');
const { dbSeatsToLabels } = require('../utils/seats');

/**
 * Create a mock payment order for booking
 * POST /api/payments/create-order
 */
const createPaymentIntent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { showId, seats } = req.body;
    const userId = req.user.id;

    // Validate show exists and get price
    const show = await prisma.show.findUnique({
      where: { id: parseInt(showId) },
      include: {
        movie: {
          select: {
            id: true,
            title: true
          }
        },
        screen: {
          include: {
            cinema: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found'
      });
    }

    // Calculate total amount
    const totalAmount = show.price * seats.length;
    const amountInPaise = Math.round(totalAmount * 100); // Convert to smallest currency unit (paise for INR)

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: totalAmount,
        currency: 'INR',
        paymentMethod: 'mock',
        status: 'PENDING',
        metadata: {
          showId: parseInt(showId),
          seats,
          movieTitle: show.movie.title,
          cinemaName: show.screen.cinema.name,
          showTime: show.startTime.toISOString()
        }
      }
    });

    // Create mock payment order
    const mockOrder = await mockPayment.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `order_${payment.id}_${Date.now()}`,
      notes: {
        paymentId: payment.id.toString(),
        userId: userId.toString(),
        showId: showId.toString(),
        seats: JSON.stringify(seats),
        movieTitle: show.movie.title
      }
    });

    // Update payment with mock order ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        stripePaymentId: mockOrder.id,
        status: 'PROCESSING'
      }
    });

    res.json({
      success: true,
      paymentId: payment.id,
      orderId: mockOrder.id,
      amount: totalAmount,
      currency: 'INR',
      mockPaymentKey: 'mock_key_id',
      usingMockPayment: true,
      show: {
        id: show.id,
        movie: show.movie,
        cinema: show.screen.cinema.name,
        screen: show.screen.name,
        startTime: show.startTime,
        price: show.price
      },
      seats
    });

  } catch (error) {
    console.error('Error creating payment order:', error);
    next(error);
  }
};

/**
 * Verify mock payment and create booking
 * POST /api/payments/verify
 */
const confirmPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;
    const userId = req.user.id;

    // Get payment record
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(paymentId) }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Verify payment belongs to user
    if (payment.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to payment'
      });
    }

    // Check if payment is already processed
    if (payment.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Payment already processed'
      });
    }

    // Mock payment verification - just check signature format
    if (!razorpay_signature || !razorpay_signature.startsWith('mock_sig_')) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.'
      });
    }

    // Create booking with payment
    // Parse metadata if it's a string (PostgreSQL might return it differently)
    const metadata = typeof payment.metadata === 'string' 
      ? JSON.parse(payment.metadata) 
      : payment.metadata;
    
    const { showId, seats } = metadata;

    // Use transaction to create booking and update payment
    const result = await prisma.$transaction(async (tx) => {
      // Normalize seat labels
      const normalizedSeats = seats.map(seat => seat.toUpperCase());

      // Check for seat conflicts
      const existingBookings = await tx.booking.findMany({
        where: {
          showId: parseInt(showId),
          status: 'CONFIRMED'
        },
        select: {
          seats: true
        }
      });

      const allBookedSeats = [];
      existingBookings.forEach(booking => {
        const seatLabels = dbSeatsToLabels(booking.seats);
        allBookedSeats.push(...seatLabels);
      });

      // Check for conflicts
      const conflicts = normalizedSeats.filter(seat => allBookedSeats.includes(seat));
      if (conflicts.length > 0) {
        throw new Error(`SEAT_CONFLICT:${JSON.stringify(conflicts)}`);
      }

      // Convert seats to database format
      const { seatsToDbFormat } = require('../utils/seats');
      const dbSeats = seatsToDbFormat(normalizedSeats);

      // Generate ticket code
      const { generateTicketCode } = require('../utils/ticketGenerator');
      const ticketCode = generateTicketCode();

      // Create booking
      const booking = await tx.booking.create({
        data: {
          userId,
          showId: parseInt(showId),
          seats: dbSeats,
          totalPrice: payment.amount,
          status: 'CONFIRMED',
          paymentId: payment.id,
          paymentStatus: 'COMPLETED',
          ticketCode
        },
        include: {
          show: {
            include: {
              movie: {
                select: {
                  id: true,
                  title: true
                }
              },
              screen: {
                include: {
                  cinema: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      // Update payment status
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED'
        }
      });

      return { booking, seats: normalizedSeats };
    });

    // Release user's seat holds
    const seatHoldManager = require('../utils/seatHoldManager');
    await seatHoldManager.unblockSeats(userId, null, showId);

    // Broadcast booking confirmation
    const socketManager = require('../utils/socketManager');
    socketManager.broadcastBookingConfirmed(parseInt(showId), {
      showId: parseInt(showId),
      bookingId: result.booking.id,
      seats: result.seats,
      userId,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      },
      bookedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      bookingId: result.booking.id.toString(),
      showId: showId.toString(),
      seats: result.seats,
      totalPrice: payment.amount,
      ticketCode: result.booking.ticketCode,
      paymentStatus: 'COMPLETED',
      message: 'Payment successful and booking confirmed'
    });

  } catch (error) {
    if (error.message.startsWith('SEAT_CONFLICT:')) {
      const conflicts = JSON.parse(error.message.split(':')[1]);
      return res.status(409).json({
        success: false,
        message: 'Some seats are already booked. Payment will be refunded.',
        conflicts
      });
    }

    console.error('Error confirming payment:', error);
    next(error);
  }
};

/**
 * Get payment details
 * GET /api/payments/:paymentId
 */
const getPaymentDetails = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(paymentId) },
      include: {
        booking: {
          include: {
            show: {
              include: {
                movie: true,
                screen: {
                  include: {
                    cinema: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Verify payment belongs to user
    if (payment.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to payment'
      });
    }

    res.json({
      success: true,
      data: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        createdAt: payment.createdAt,
        booking: payment.booking,
        metadata: payment.metadata
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Webhook handler for mock payment events
 * POST /api/payments/webhook
 * Note: Mock payments don't use webhooks, but keeping endpoint for compatibility
 */
const handlePaymentWebhook = async (req, res, next) => {
  try {
    console.log('Mock payment webhook called (no-op)');
    res.json({ status: 'ok', message: 'Mock webhook received' });
  } catch (error) {
    console.error('Webhook error:', error);
    next(error);
  }
};

/**
 * Get user's payment history
 * GET /api/payments/history
 */
const getPaymentHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        booking: {
          include: {
            show: {
              include: {
                movie: {
                  select: {
                    id: true,
                    title: true,
                    posterUrl: true
                  }
                },
                screen: {
                  include: {
                    cinema: {
                      select: {
                        id: true,
                        name: true,
                        city: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      createdAt: payment.createdAt,
      booking: payment.booking ? {
        id: payment.booking.id,
        seats: dbSeatsToLabels(payment.booking.seats),
        show: payment.booking.show,
        status: payment.booking.status
      } : null,
      metadata: payment.metadata
    }));

    res.json({
      success: true,
      data: formattedPayments
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentDetails,
  handlePaymentWebhook,
  getPaymentHistory
};
