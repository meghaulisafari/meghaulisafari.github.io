/**
 * Hotel Meghauli Safari - Google Apps Script
 *
 * This script handles booking form submissions and sends confirmation emails
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Replace the default code with this script
 * 4. Update the SHEET_NAME if needed
 * 5. Deploy as Web App:
 *    - Click Deploy > New deployment
 *    - Select "Web app" as deployment type
 *    - Description: "Booking Form Handler"
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click Deploy
 * 6. Copy the deployment URL and replace GOOGLE_SHEET_URL in main.js
 * 7. Grant necessary permissions when prompted
 */

// Configuration
const SHEET_NAME = 'Bookings';
const ADMIN_EMAIL = 'meghaulisafari@gmail.com';
const HOTEL_NAME = 'Hotel Meghauli Safari';

/**
 * Handle POST requests from booking form
 */
function doPost(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // Save to Google Sheet
    saveToSheet(data);

    // Send confirmation email to guest
    sendGuestConfirmation(data);

    // Send notification to admin
    sendAdminNotification(data);

    lock.releaseLock();

    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'success',
        bookingId: data.bookingId
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'error',
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput('Booking API is running. Use POST to submit bookings.')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Save booking data to Google Sheet
 */
function saveToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);

    // Add headers
    const headers = [
      'Timestamp',
      'Booking ID',
      'Status',
      'Guest Name',
      'Email',
      'Phone',
      'Room Type',
      'Guests',
      'Check-in',
      'Check-out',
      'Nights',
      'Special Requests',
      'Arrival Time',
      'Airport Pickup',
      'Source Page',
      'User Agent'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);

    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }

  // Add the booking data
  const row = [
    data.timestamp,
    data.bookingId,
    data.status,
    data.guestName,
    data.email,
    data.phone,
    data.roomType,
    data.guests,
    data.checkIn,
    data.checkOut,
    data.nights,
    data.specialRequests || '',
    data.arrivalTime || '',
    data.airportPickup,
    data.sourcePage,
    data.userAgent
  ];

  sheet.appendRow(row);
}

/**
 * Send confirmation email to guest
 */
function sendGuestConfirmation(data) {
  const subject = `Booking Request Received - ${HOTEL_NAME}`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2C5F2D; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #2C5F2D; }
        .button { display: inline-block; background: #D4A574; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🦏 ${HOTEL_NAME}</h1>
          <p>Where Wilderness Meets Comfort</p>
        </div>

        <div class="content">
          <h2>Dear ${data.guestName},</h2>

          <p>Thank you for choosing ${HOTEL_NAME}! We have received your booking request and are excited to host you.</p>

          <div class="booking-details">
            <h3 style="color: #2C5F2D; margin-top: 0;">Booking Details</h3>

            <div class="detail-row">
              <span class="detail-label">Booking ID:</span>
              <span>${data.bookingId}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Room Type:</span>
              <span>${data.roomType}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Check-in:</span>
              <span>${formatDate(data.checkIn)}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Check-out:</span>
              <span>${formatDate(data.checkOut)}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Number of Nights:</span>
              <span>${data.nights}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Number of Guests:</span>
              <span>${data.guests}</span>
            </div>

            ${data.arrivalTime ? `
            <div class="detail-row">
              <span class="detail-label">Expected Arrival:</span>
              <span>${data.arrivalTime}</span>
            </div>
            ` : ''}

            ${data.airportPickup === 'Yes' ? `
            <div class="detail-row">
              <span class="detail-label">Airport Pickup:</span>
              <span>✅ Requested</span>
            </div>
            ` : ''}

            ${data.specialRequests ? `
            <div class="detail-row">
              <span class="detail-label">Special Requests:</span>
              <span>${data.specialRequests}</span>
            </div>
            ` : ''}
          </div>

          <h3>What Happens Next?</h3>
          <ul>
            <li>Our team will review your booking request</li>
            <li>We'll confirm availability within 24 hours</li>
            <li>You'll receive a confirmation email with payment details</li>
            <li>For urgent requests, call us at +977-9855014882</li>
          </ul>

          <h3>Important Information</h3>
          <ul>
            <li><strong>Check-in Time:</strong> 2:00 PM</li>
            <li><strong>Check-out Time:</strong> 11:00 AM</li>
            <li><strong>Cancellation Policy:</strong> Free cancellation up to 48 hours before check-in</li>
            <li><strong>Location:</strong> Rapti River Side, Meghauli, Chitwan</li>
          </ul>

          <div style="text-align: center;">
            <a href="https://meghaulisafari.com" class="button">Visit Our Website</a>
          </div>

          <p>If you have any questions or need to modify your booking, please reply to this email or contact us:</p>
          <ul>
            <li>Email: ${ADMIN_EMAIL}</li>
            <li>Phone: +977-9855014882 (Available 24/7)</li>
            <li>WhatsApp: +977-9855014882</li>
          </ul>

          <p>We look forward to welcoming you to the wild beauty of Chitwan National Park!</p>

          <p style="margin-top: 30px;">
            Warm regards,<br>
            <strong>The Team at ${HOTEL_NAME}</strong>
          </p>
        </div>

        <div class="footer">
          <p>${HOTEL_NAME} | Rapti River Side, Meghauli, Chitwan, Nepal</p>
          <p>${ADMIN_EMAIL} | +977-9855014882</p>
          <p>&copy; 2025 ${HOTEL_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const plainBody = `
Dear ${data.guestName},

Thank you for choosing ${HOTEL_NAME}! We have received your booking request.

BOOKING DETAILS
-----------------
Booking ID: ${data.bookingId}
Room Type: ${data.roomType}
Check-in: ${formatDate(data.checkIn)}
Check-out: ${formatDate(data.checkOut)}
Number of Nights: ${data.nights}
Number of Guests: ${data.guests}
${data.arrivalTime ? 'Expected Arrival: ' + data.arrivalTime : ''}
${data.airportPickup === 'Yes' ? 'Airport Pickup: Requested' : ''}
${data.specialRequests ? 'Special Requests: ' + data.specialRequests : ''}

WHAT HAPPENS NEXT?
- Our team will review your booking request
- We'll confirm availability within 24 hours
- You'll receive a confirmation email with payment details

IMPORTANT INFORMATION
- Check-in Time: 2:00 PM
- Check-out Time: 11:00 AM
- Cancellation Policy: Free cancellation up to 48 hours before check-in
- Location: Rapti River Side, Meghauli, Chitwan

CONTACT US
Email: ${ADMIN_EMAIL}
Phone: +977-9855014882 (Available 24/7)

We look forward to welcoming you to the wild beauty of Chitwan National Park!

Warm regards,
The Team at ${HOTEL_NAME}
  `;

  try {
    MailApp.sendEmail({
      to: data.email,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody,
      name: HOTEL_NAME
    });
  } catch (error) {
    Logger.log('Error sending guest confirmation: ' + error.toString());
  }
}

/**
 * Send notification email to admin
 */
function sendAdminNotification(data) {
  const subject = `🔔 New Booking Request - ${data.bookingId}`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2C5F2D; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .booking-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #2C5F2D; }
        .urgent { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🦏 New Booking Request Received</h2>
        </div>

        <div class="content">
          <div class="urgent">
            <strong>⏰ Action Required:</strong> Please review and confirm this booking within 24 hours.
          </div>

          <div class="booking-details">
            <h3>Guest Information</h3>
            <div class="detail-row">
              <span class="label">Name:</span> ${data.guestName}
            </div>
            <div class="detail-row">
              <span class="label">Email:</span> <a href="mailto:${data.email}">${data.email}</a>
            </div>
            <div class="detail-row">
              <span class="label">Phone:</span> <a href="tel:${data.phone}">${data.phone}</a>
            </div>
          </div>

          <div class="booking-details">
            <h3>Booking Details</h3>
            <div class="detail-row">
              <span class="label">Booking ID:</span> ${data.bookingId}
            </div>
            <div class="detail-row">
              <span class="label">Status:</span> ${data.status}
            </div>
            <div class="detail-row">
              <span class="label">Room Type:</span> ${data.roomType}
            </div>
            <div class="detail-row">
              <span class="label">Check-in:</span> ${formatDate(data.checkIn)}
            </div>
            <div class="detail-row">
              <span class="label">Check-out:</span> ${formatDate(data.checkOut)}
            </div>
            <div class="detail-row">
              <span class="label">Nights:</span> ${data.nights}
            </div>
            <div class="detail-row">
              <span class="label">Guests:</span> ${data.guests}
            </div>
            ${data.arrivalTime ? `
            <div class="detail-row">
              <span class="label">Expected Arrival:</span> ${data.arrivalTime}
            </div>
            ` : ''}
            ${data.airportPickup === 'Yes' ? `
            <div class="detail-row">
              <span class="label">Airport Pickup:</span> ✅ Requested
            </div>
            ` : ''}
            ${data.specialRequests ? `
            <div class="detail-row">
              <span class="label">Special Requests:</span> ${data.specialRequests}
            </div>
            ` : ''}
          </div>

          <div class="booking-details">
            <h3>Technical Details</h3>
            <div class="detail-row">
              <span class="label">Submitted:</span> ${formatDateTime(data.timestamp)}
            </div>
            <div class="detail-row">
              <span class="label">Source:</span> ${data.sourcePage}
            </div>
          </div>

          <p style="margin-top: 20px;">
            <strong>Next Steps:</strong>
          </p>
          <ol>
            <li>Open the Google Sheet to review full details</li>
            <li>Check room availability for the requested dates</li>
            <li>Reply to guest at ${data.email} with confirmation or alternatives</li>
            <li>Update the booking status in the sheet</li>
          </ol>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: subject,
      htmlBody: htmlBody,
      name: 'Booking System'
    });
  } catch (error) {
    Logger.log('Error sending admin notification: ' + error.toString());
  }
}

/**
 * Format date to readable format
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format datetime to readable format
 */
function formatDateTime(isoString) {
  const date = new Date(isoString);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Test function - uncomment and run to test email sending
 */
function testEmails() {
  const testData = {
    timestamp: new Date().toISOString(),
    bookingId: 'TEST-12345',
    status: 'New',
    guestName: 'Test User',
    email: 'test@example.com', // Change to your email for testing
    phone: '+977-XXX-XXXXXXX',
    roomType: 'Deluxe River View - $90/night',
    guests: '2',
    checkIn: '2025-11-15',
    checkOut: '2025-11-18',
    nights: 3,
    specialRequests: 'Early check-in if possible',
    arrivalTime: '2:00 PM',
    airportPickup: 'Yes',
    sourcePage: 'https://meghaulisafari.com',
    userAgent: 'Test Browser'
  };

  sendGuestConfirmation(testData);
  sendAdminNotification(testData);
  Logger.log('Test emails sent!');
}