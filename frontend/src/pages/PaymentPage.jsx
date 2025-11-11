import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentAPI } from '../api/services';
import { useBookingStore } from '../store/bookingStore';

// Initialize Stripe with your publishable key
// You'll need to set this in your frontend environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

const CheckoutForm = ({ paymentIntentData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setErrorMessage(null);

    try {
      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (stripeError) {
        setErrorMessage(stripeError.message);
        onError(stripeError);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment with backend to create booking
        const response = await paymentAPI.confirmPayment(paymentIntentData.paymentId);
        
        if (response.data.success) {
          onSuccess(response.data);
        } else {
          setErrorMessage('Failed to confirm booking. Please contact support.');
          onError(new Error('Booking confirmation failed'));
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error.response?.data?.message || 'Payment failed. Please try again.');
      onError(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : `Pay ₹${paymentIntentData.amount.toLocaleString()}`}
      </button>
      
      <p className="text-xs text-slate-500 text-center">
        Your payment is secured by Stripe. Your card details are never stored on our servers.
      </p>
    </form>
  );
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearSelectedSeats } = useBookingStore();
  
  const [paymentIntentData, setPaymentIntentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get booking details from location state
  const { showId, seats } = location.state || {};

  useEffect(() => {
    if (!showId || !seats || seats.length === 0) {
      navigate('/movies');
      return;
    }

    initializePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showId, seats]);

  const initializePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await paymentAPI.createPaymentIntent({
        showId,
        seats
      });

      if (response.data.success) {
        setPaymentIntentData(response.data);
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (err) {
      console.error('Error initializing payment:', err);
      
      // Check if it's an authentication error
      if (err.response?.status === 401) {
        setError('Your session has expired. Please login again.');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } else {
        setError(err.response?.data?.message || 'Failed to initialize payment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (bookingData) => {
    // Clear selected seats
    clearSelectedSeats();
    
    // Navigate to confirmation page
    navigate('/bookings/confirmation', {
      state: { booking: bookingData }
    });
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Payment Initialization Failed</h2>
              <p className="text-slate-600 mb-6">{error}</p>
              <button
                onClick={() => navigate(-1)}
                className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentIntentData) {
    return null;
  }

  const options = {
    clientSecret: paymentIntentData.clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#1e40af',
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Seat Selection
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Booking Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Booking Summary</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Movie</p>
                <p className="font-semibold text-slate-900">{paymentIntentData.show.movie.title}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-600">Cinema</p>
                <p className="font-medium text-slate-900">{paymentIntentData.show.cinema}</p>
                <p className="text-sm text-slate-600">{paymentIntentData.show.screen}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-600">Show Time</p>
                <p className="font-medium text-slate-900">
                  {new Date(paymentIntentData.show.startTime).toLocaleDateString()} at{' '}
                  {new Date(paymentIntentData.show.startTime).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-slate-600 mb-2">Selected Seats</p>
                <div className="flex flex-wrap gap-2">
                  {paymentIntentData.seats.map(seat => (
                    <span
                      key={seat}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Price per seat</span>
                  <span className="font-medium text-slate-900">₹{paymentIntentData.show.price}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Number of seats</span>
                  <span className="font-medium text-slate-900">{paymentIntentData.seats.length}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-slate-200">
                  <span className="text-slate-900">Total Amount</span>
                  <span className="text-blue-600">₹{paymentIntentData.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Details</h2>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secured by Stripe</span>
              </div>
              
              <p className="text-sm text-slate-600">
                Complete your payment to confirm your booking. Your seats are reserved for the next 10 minutes.
              </p>
            </div>
            
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm
                paymentIntentData={paymentIntentData}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
          </div>
        </div>

        {/* Test Card Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Test Mode - Use Test Card</h3>
          <p className="text-sm text-blue-800 mb-2">
            This is in test mode. Use the following test card:
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li><strong>Card Number:</strong> 4242 4242 4242 4242</li>
            <li><strong>Expiry:</strong> Any future date (e.g., 12/34)</li>
            <li><strong>CVC:</strong> Any 3 digits (e.g., 123)</li>
            <li><strong>ZIP:</strong> Any 5 digits (e.g., 12345)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
