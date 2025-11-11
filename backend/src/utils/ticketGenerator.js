const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const { dbSeatsToLabels } = require('./seats');

/**
 * Generate a unique ticket code
 * Format: QB-YYYYMMDD-XXXXX
 */
const generateTicketCode = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `QB-${dateStr}-${random}`;
};

/**
 * Generate QR code as data URL
 * @param {string} ticketCode - The unique ticket code
 * @param {object} bookingData - Booking information
 * @returns {Promise<Buffer>} QR code image buffer
 */
const generateQRCode = async (ticketCode, bookingData) => {
  const qrData = JSON.stringify({
    ticketCode,
    bookingId: bookingData.id,
    showId: bookingData.showId,
    userId: bookingData.userId,
    seats: bookingData.seats,
    timestamp: new Date().toISOString()
  });

  try {
    const qrBuffer = await QRCode.toBuffer(qrData, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrBuffer;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Format date for display
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format time for display
 */
const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Generate E-Ticket PDF
 * @param {object} booking - Complete booking object with relations
 * @returns {Promise<Buffer>} PDF buffer
 */
const generateTicketPDF = async (booking) => {
  console.log('🎫 Starting PDF generation for booking:', booking.id);
  
  // Extract data
  const seatLabels = dbSeatsToLabels(booking.seats);
  const movieTitle = booking.show.movie.title;
  const cinemaName = booking.show.screen.cinema.name;
  const screenName = booking.show.screen.name;
  const showDate = formatDate(booking.show.startTime);
  const showTime = formatTime(booking.show.startTime);
  const ticketCode = booking.ticketCode;

  console.log('📝 Ticket data:', { movieTitle, cinemaName, ticketCode, seats: seatLabels.length });

  // Generate QR code first
  const qrCodeBuffer = await generateQRCode(ticketCode, {
    id: booking.id,
    showId: booking.showId,
    userId: booking.userId,
    seats: seatLabels
  });

  console.log('✅ QR code generated, buffer size:', qrCodeBuffer.length);

  // Return a promise that resolves with the complete PDF buffer
  return new Promise((resolve, reject) => {
    try {
      // Create PDF document with proper configuration
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true,
        autoFirstPage: true,
        info: {
          Title: `QuickBook E-Ticket - ${ticketCode}`,
          Author: 'QuickBook Cinema',
          Subject: 'Movie Ticket',
          Keywords: 'ticket, cinema, movie, booking'
        }
      });

      // Collect PDF data into chunks
      const chunks = [];
      
      doc.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      doc.on('end', () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);
          console.log('✅ PDF buffer created successfully, size:', pdfBuffer.length, 'bytes');
          
          // Verify buffer is not empty
          if (!pdfBuffer || pdfBuffer.length === 0) {
            reject(new Error('Generated PDF buffer is empty'));
            return;
          }
          
          // Verify it starts with PDF header
          const header = pdfBuffer.toString('utf8', 0, 4);
          if (header !== '%PDF') {
            console.error('❌ Invalid PDF header:', header);
            reject(new Error('Generated PDF has invalid header'));
            return;
          }
          
          resolve(pdfBuffer);
        } catch (concatError) {
          console.error('❌ Error concatenating PDF chunks:', concatError);
          reject(concatError);
        }
      });
      
      doc.on('error', (err) => {
        console.error('❌ PDFDocument error:', err);
        reject(err);
      });

      // ========== HEADER ==========
      doc.fontSize(28)
         .fillColor('#1e293b')
         .text('QuickBook Cinema', 50, 50, { width: 495 });

      doc.fontSize(11)
         .fillColor('#64748b')
         .text('E-Ticket', 50, 85);

      // Ticket Code (top right)
      doc.fontSize(10)
         .fillColor('#1e293b')
         .text(`Ticket: ${ticketCode}`, 400, 50, { align: 'right' });

      doc.fontSize(9)
         .fillColor('#64748b')
         .text(`Booking: #${booking.id}`, 400, 68, { align: 'right' });

      // Draw horizontal line
      doc.moveTo(50, 110)
         .lineTo(545, 110)
         .strokeColor('#e2e8f0')
         .stroke();

      // ========== MOVIE SECTION ==========
      let yPos = 130;

      doc.fontSize(22)
         .fillColor('#1e293b')
         .text(movieTitle, 50, yPos, { width: 495 });

      yPos += 35;

      // Cinema & Screen Info
      doc.fontSize(10)
         .fillColor('#64748b')
         .text('Cinema', 50, yPos);

      doc.fontSize(13)
         .fillColor('#1e293b')
         .text(cinemaName, 50, yPos + 16);

      doc.fontSize(10)
         .fillColor('#64748b')
         .text('Screen', 300, yPos);

      doc.fontSize(13)
         .fillColor('#1e293b')
         .text(screenName, 300, yPos + 16);

      yPos += 50;

      // Date & Time
      doc.fontSize(10)
         .fillColor('#64748b')
         .text('Date', 50, yPos);

      doc.fontSize(13)
         .fillColor('#1e293b')
         .text(showDate, 50, yPos + 16, { width: 220 });

      doc.fontSize(10)
         .fillColor('#64748b')
         .text('Show Time', 300, yPos);

      doc.fontSize(13)
         .fillColor('#1e293b')
         .text(showTime, 300, yPos + 16);

      yPos += 50;

      // ========== SEATS SECTION ==========
      doc.fontSize(10)
         .fillColor('#64748b')
         .text('Seats', 50, yPos);

      yPos += 18;

      // Display seats
      doc.fontSize(14)
         .fillColor('#1e293b');

      const seatsPerRow = 6;
      let xSeatPos = 50;
      let ySeatPos = yPos;

      seatLabels.forEach((seat, index) => {
        if (index > 0 && index % seatsPerRow === 0) {
          xSeatPos = 50;
          ySeatPos += 28;
        }

        // Draw seat box
        doc.rect(xSeatPos, ySeatPos, 60, 24)
           .fillAndStroke('#f1f5f9', '#cbd5e1');

        doc.fillColor('#1e293b')
           .text(seat, xSeatPos, ySeatPos + 5, { width: 60, align: 'center' });

        xSeatPos += 65;
      });

      yPos = ySeatPos + 40;

      // ========== PAYMENT SECTION ==========
      doc.fontSize(10)
         .fillColor('#64748b')
         .text('Total Amount Paid', 50, yPos);

      doc.fontSize(18)
         .fillColor('#059669')
         .text(`₹${booking.totalPrice.toLocaleString('en-IN')}`, 50, yPos + 16);

      doc.fontSize(9)
         .fillColor('#64748b')
         .text(`${seatLabels.length} seat(s) × ₹${booking.show.price}/seat`, 50, yPos + 40);

      // ========== QR CODE SECTION ==========
      const qrYPos = yPos - 40;
      
      // QR Code Border
      doc.rect(380, qrYPos, 150, 150)
         .fillAndStroke('#ffffff', '#cbd5e1');

      // Add QR code image
      doc.image(qrCodeBuffer, 385, qrYPos + 5, {
        width: 140,
        height: 140
      });

      doc.fontSize(8)
         .fillColor('#64748b')
         .text('Scan at Cinema', 380, qrYPos + 155, { width: 150, align: 'center' });

      // ========== FOOTER SECTION ==========
      yPos = yPos + 100;

      // Divider line
      doc.moveTo(50, yPos)
         .lineTo(545, yPos)
         .strokeColor('#e2e8f0')
         .stroke();

      yPos += 15;

      // Important Information
      doc.fontSize(10)
         .fillColor('#1e293b')
         .text('Important Information', 50, yPos);

      yPos += 18;

      const instructions = [
        '• Arrive 15 minutes before show time',
        '• Carry valid ID for verification',
        '• Outside food and beverages not allowed',
        '• Valid only for date and time mentioned',
        '• Present QR code at entrance for scanning',
        '• No refunds after show time'
      ];

      doc.fontSize(8)
         .fillColor('#64748b');

      instructions.forEach(instruction => {
        doc.text(instruction, 50, yPos, { width: 495 });
        yPos += 12;
      });

      yPos += 10;

      // Contact Info
      doc.fontSize(7)
         .fillColor('#94a3b8')
         .text('For queries: support@quickbook.com | +91 1800-XXX-XXXX', 50, yPos, {
           width: 495,
           align: 'center'
         });

      yPos += 12;

      doc.fontSize(7)
         .fillColor('#cbd5e1')
         .text(`Generated: ${new Date().toLocaleString('en-IN')}`, 50, yPos, {
           width: 495,
           align: 'center'
         });

      console.log('✅ PDF content added, finalizing document...');
      
      // Important: Finalize the PDF properly
      // This triggers the 'end' event which resolves our promise
      doc.end();

    } catch (error) {
      console.error('❌ Error in PDF generation:', error);
      reject(error);
    }
  });
};

/**
 * Verify ticket code format
 * @param {string} ticketCode - The ticket code to verify
 * @returns {boolean} True if valid format
 */
const isValidTicketCode = (ticketCode) => {
  const pattern = /^QB-\d{8}-[A-Z0-9]{5}$/;
  return pattern.test(ticketCode);
};

module.exports = {
  generateTicketCode,
  generateTicketPDF,
  generateQRCode,
  isValidTicketCode
};
