import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { paymentAPI } from '../api/services';
import { useBookingStore } from '../store/bookingStore';

const MockPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearSelectedSeats } = useBookingStore();
  
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  // Get booking details from location state
  const { showId, seats } = location.state || {};

  useEffect(() => {
    if (!showId || !seats || seats.length === 0) {
      navigate('/movies');
      return;
    }

    // Create mock payment order
    const initOrder = async () => {
      try {
        setLoading(true);
        const response = await paymentAPI.createOrder(showId, seats);
        
        if (response.data.success) {
          setOrderData(response.data);
        } else {
          setError('Failed to initialize payment. Please try again.');
        }
      } catch (err) {
        console.error('Error creating order:', err);
        if (err.response?.status === 401) {
          localStorage.clear();
          setTimeout(() => navigate('/login'), 2000);
          setError('Session expired. Redirecting to login...');
        } else {
          setError(err.response?.data?.message || 'Failed to initialize payment');
        }
      } finally {
        setLoading(false);
      }
    };

    initOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Simulate mock payment process
      await simulateMockPayment();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const simulateMockPayment = async () => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockResponse = {
      razorpay_order_id: orderData.orderId,
      razorpay_payment_id: `pay_mock_${Date.now()}`,
      razorpay_signature: `mock_sig_${orderData.orderId}_${Date.now()}`
    };

    await verifyAndCompletePayment(mockResponse);
  };

  const verifyAndCompletePayment = async (response) => {
    const verifyResponse = await paymentAPI.verifyPayment({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      paymentId: orderData.paymentId
    });

    if (verifyResponse.data.success) {
      clearSelectedSeats();
      
      // Navigate with complete booking data including ticketCode
      navigate('/bookings/confirmation', {
        state: {
          booking: {
            id: verifyResponse.data.bookingId,
            showId: verifyResponse.data.showId,
            seats: verifyResponse.data.seats,
            totalPrice: verifyResponse.data.totalPrice || orderData.amount,
            ticketCode: verifyResponse.data.ticketCode,
            status: 'CONFIRMED',
            show: orderData.show
          }
        }
      });
    } else {
      alert('Payment verification failed. Please contact support.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Payment Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Complete Payment</h1>
          <p className="text-slate-600">Review your booking details and proceed with payment</p>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Booking Summary</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-600">Movie</span>
              <span className="font-semibold text-slate-800">{orderData.show.movie.title}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-600">Cinema</span>
              <span className="font-semibold text-slate-800">{orderData.show.cinema}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-600">Screen</span>
              <span className="font-semibold text-slate-800">{orderData.show.screen}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-600">Show Time</span>
              <span className="font-semibold text-slate-800">
                {new Date(orderData.show.startTime).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-600">Selected Seats</span>
              <span className="font-semibold text-slate-800">{seats.join(', ')}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-600">Number of Seats</span>
              <span className="font-semibold text-slate-800">{seats.length}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-600">Price per Seat</span>
              <span className="font-semibold text-slate-800">₹{orderData.show.price}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 bg-blue-50 px-4 rounded-lg mt-4">
              <span className="text-lg font-semibold text-slate-800">Total Amount</span>
              <span className="text-2xl font-bold text-blue-600">₹{orderData.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>Pay ₹{orderData.amount.toLocaleString()}</>
            )}
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600 mb-2">
              Powered by <span className="font-semibold">Mock Payment Gateway</span>
            </p>
            <p className="text-xs text-slate-500">
              Simulated payment - No real money involved
            </p>
          </div>

          {/* Test Mode Info */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">✅ Mock Payment Mode</h3>
            <p className="text-sm text-green-700 mb-2">
              <strong>No signup required!</strong> This is a simulated payment system for testing.
            </p>
            <ul className="text-sm text-green-700 space-y-1 ml-4 list-disc">
              <li>Click "Pay" button to simulate payment</li>
              <li>Payment will automatically succeed after 1.5 seconds</li>
              <li>Perfect for testing without any external service</li>
              <li>No credit card, no PAN, no KYC, no hassle!</li>
            </ul>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-slate-600 hover:text-slate-800 transition-colors"
        >
          ← Back to Seat Selection
        </button>
      </div>
    </div>
  );
};

export default MockPaymentPage;
