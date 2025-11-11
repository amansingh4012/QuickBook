import { useState } from 'react';
import API_BASE_URL from '../api';

const TicketVerification = () => {
  const [ticketCode, setTicketCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerifyTicket = async (e) => {
    e.preventDefault();
    
    if (!ticketCode.trim()) {
      setError('Please enter a ticket code');
      return;
    }

    setLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/verify-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ticketCode: ticketCode.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationResult(data);
      } else {
        setError(data.message || 'Invalid ticket code');
      }
    } catch (err) {
      console.error('Error verifying ticket:', err);
      setError('Failed to verify ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const resetForm = () => {
    setTicketCode('');
    setVerificationResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Ticket Verification</h1>
          <p className="text-slate-600">Scan or enter the ticket code to verify cinema entry</p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <form onSubmit={handleVerifyTicket}>
            <label htmlFor="ticketCode" className="block text-sm font-medium text-slate-700 mb-2">
              Ticket Code
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="ticketCode"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
                placeholder="QB-20251110-XXXXX"
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !ticketCode.trim()}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </>
                ) : (
                  'Verify'
                )}
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Enter the ticket code from the QR code or PDF ticket
            </p>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-red-900 font-medium">Verification Failed</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Verification Result */}
        {verificationResult && (
          <div className={`rounded-xl shadow-sm border p-6 ${
            verificationResult.valid 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            {/* Status Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  verificationResult.valid ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {verificationResult.valid ? (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  )}
                </div>
                <div className="ml-4">
                  <h2 className={`text-2xl font-bold ${
                    verificationResult.valid ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {verificationResult.valid ? 'Valid Ticket' : 'Invalid Ticket'}
                  </h2>
                  <p className={`text-sm ${
                    verificationResult.valid ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {verificationResult.data?.message}
                  </p>
                </div>
              </div>
              <button
                onClick={resetForm}
                className="text-slate-600 hover:text-slate-900 transition-colors"
                title="Clear results"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Ticket Details */}
            {verificationResult.data && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Ticket Code</p>
                    <p className="font-mono font-bold text-slate-900">{verificationResult.data.ticketCode}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Booking ID</p>
                    <p className="font-semibold text-slate-900">#{verificationResult.data.bookingId}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Customer Name</p>
                    <p className="font-semibold text-slate-900">{verificationResult.data.customer?.name}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Customer Email</p>
                    <p className="font-semibold text-slate-900 text-sm break-all">{verificationResult.data.customer?.email}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Movie</p>
                    <p className="font-semibold text-slate-900">{verificationResult.data.movie}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Cinema</p>
                    <p className="font-semibold text-slate-900">{verificationResult.data.cinema}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Screen</p>
                    <p className="font-semibold text-slate-900">{verificationResult.data.screen}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Show Time</p>
                    <p className="font-semibold text-slate-900">{formatDateTime(verificationResult.data.showTime)}</p>
                  </div>
                </div>

                {/* Seats */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-sm text-slate-600 mb-3">Seats ({verificationResult.data.totalSeats})</p>
                  <div className="flex flex-wrap gap-2">
                    {verificationResult.data.seats?.map((seat, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-md font-semibold"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-sm text-slate-600 mb-2">Booking Status</p>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full font-semibold ${
                    verificationResult.data.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-800'
                      : verificationResult.data.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {verificationResult.data.status}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How to Use</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Scan the QR code on customer's ticket using a QR scanner</li>
            <li>• Copy the ticket code from the QR data or ask customer for the code</li>
            <li>• Enter the code in the field above and click Verify</li>
            <li>• Green result = Valid ticket, allow entry</li>
            <li>• Red result = Invalid ticket, deny entry</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TicketVerification;
