export interface BookingEmailData {
  orderId: string;
  orderNumber?: string;
  name?: string;
  email?: string;
  phone?: string;
  tourName?: string;
  date?: string;
  guests?: number;
  hotel?: string;
  message?: string;
  totalAmount?: number;
}

export function generateGoogleCalendarUrl(data: BookingEmailData, refNumber: string): string {
  const tourTitle = data.tourName || "Wilder Belize Adventure";
  const title = encodeURIComponent(`Wilder Belize Tour: ${tourTitle}`);
  const location = encodeURIComponent(data.hotel || "Placencia, Belize");
  const details = encodeURIComponent(
    `Order Reference: ${refNumber}\nTour: ${tourTitle}\nGuests: ${data.guests || 1}\nPickup Location: ${data.hotel || "Placencia, Belize"}\nSpecial Notes: ${data.message || "None"}\nContact WhatsApp: +501 650-1003\nEmail: wilderbelizeadventures@gmail.com`
  );

  let startDateIso = "";
  let endDateIso = "";

  const dateStr = (data.date || "").trim();
  const dateMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);

  if (dateMatch) {
    const [_, y, m, d] = dateMatch;
    startDateIso = `${y}${m}${d}T140000Z`; // 8:00 AM CST
    endDateIso = `${y}${m}${d}T220000Z`;   // 4:00 PM CST
  } else {
    const nextDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const y = nextDay.getUTCFullYear();
    const m = String(nextDay.getUTCMonth() + 1).padStart(2, "0");
    const d = String(nextDay.getUTCDate()).padStart(2, "0");
    startDateIso = `${y}${m}${d}T140000Z`;
    endDateIso = `${y}${m}${d}T220000Z`;
  }

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateIso}/${endDateIso}&details=${details}&location=${location}`;
}

export function generateCustomerReceiptHtml(data: BookingEmailData, refNumber: string): string {
  const formattedAmount = Number(data.totalAmount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const gcalUrl = generateGoogleCalendarUrl(data, refNumber);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Completed & Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c2b26;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f4; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8e5;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0b3c26; padding: 32px 24px; text-align: center; border-bottom: 4px solid #e5a93c;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                Wilder Belize Adventures
              </h1>
              <p style="color: #e5a93c; margin: 6px 0 0 0; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">
                Placencia, Belize &bull; Official Payment Receipt
              </p>
            </td>
          </tr>

          <!-- Confirmation Badge -->
          <tr>
            <td style="padding: 24px 24px 12px 24px; text-align: center;">
              <div style="display: inline-block; background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; padding: 8px 18px; border-radius: 50px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                ✓ Payment Completed & Reservation Confirmed
              </div>
              <h2 style="margin: 16px 0 6px 0; color: #0b3c26; font-size: 22px; font-weight: 800;">
                Thank You For Your Payment! 🎉
              </h2>
              <p style="margin: 0; color: #4a5d55; font-size: 14px; line-height: 1.5;">
                Your payment of <strong>$${formattedAmount} USD</strong> has been successfully completed and processed. Your adventure in Belize is officially booked!
              </p>

              <!-- Google Calendar Action Button -->
              <div style="margin-top: 18px;">
                <a href="${gcalUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #0b3c26; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-size: 13px; font-weight: 700; box-shadow: 0 4px 12px rgba(11,60,38,0.25);">
                  📅 Add Tour to Google Calendar
                </a>
              </div>
            </td>
          </tr>

          <!-- Order Reference Ribbon -->
          <tr>
            <td style="padding: 0 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8faf9; border: 1px dashed #0b3c26; border-radius: 10px; padding: 14px 18px; margin-top: 12px;">
                <tr>
                  <td style="font-size: 13px; color: #4a5d55; font-weight: 600;">Order Reference Number:</td>
                  <td align="right" style="font-size: 15px; color: #0b3c26; font-weight: 800; font-family: monospace;">${refNumber}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reservation Breakdown Table -->
          <tr>
            <td style="padding: 24px;">
              <h3 style="margin: 0 0 14px 0; color: #0b3c26; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8e5; padding-bottom: 8px;">
                Reservation Breakdown
              </h3>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 14px; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #edf2f0;">
                  <td style="padding: 10px 0; color: #6b7c75; font-weight: 500;">Tour / Adventure</td>
                  <td align="right" style="padding: 10px 0; color: #0b3c26; font-weight: 700;">${data.tourName || "Wilder Belize Adventure"}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f0;">
                  <td style="padding: 10px 0; color: #6b7c75; font-weight: 500;">Scheduled Date</td>
                  <td align="right" style="padding: 10px 0; color: #1c2b26; font-weight: 600;">${data.date || "To be scheduled"}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f0;">
                  <td style="padding: 10px 0; color: #6b7c75; font-weight: 500;">Number of Guests</td>
                  <td align="right" style="padding: 10px 0; color: #1c2b26; font-weight: 600;">${data.guests || 1} Person(s)</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f0;">
                  <td style="padding: 10px 0; color: #6b7c75; font-weight: 500;">Pickup Location / Hotel</td>
                  <td align="right" style="padding: 10px 0; color: #1c2b26; font-weight: 600;">${data.hotel || "Not specified"}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f0;">
                  <td style="padding: 10px 0; color: #6b7c75; font-weight: 500;">Payment Status</td>
                  <td align="right" style="padding: 10px 0; color: #047857; font-weight: 700;">PAID IN FULL (Belize Bank E-Commerce)</td>
                </tr>
                <tr>
                  <td style="padding: 14px 0 4px 0; color: #0b3c26; font-size: 16px; font-weight: 800;">Total Amount Paid</td>
                  <td align="right" style="padding: 14px 0 4px 0; color: #0b3c26; font-size: 20px; font-weight: 900;">$${formattedAmount} USD</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Guest Details Card -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <div style="background-color: #f8faf9; border-radius: 12px; padding: 18px; border: 1px solid #e2e8e5;">
                <h4 style="margin: 0 0 10px 0; color: #0b3c26; font-size: 13px; font-weight: 700; text-transform: uppercase;">Guest Details</h4>
                <p style="margin: 4px 0; font-size: 13px; color: #2c3e35;"><strong>Guest Name:</strong> ${data.name || "Valued Guest"}</p>
                <p style="margin: 4px 0; font-size: 13px; color: #2c3e35;"><strong>Email:</strong> ${data.email || "Not provided"}</p>
                <p style="margin: 4px 0; font-size: 13px; color: #2c3e35;"><strong>Phone / WhatsApp:</strong> ${data.phone || "Not provided"}</p>
                ${data.message ? `<p style="margin: 4px 0; font-size: 13px; color: #2c3e35;"><strong>Special Notes:</strong> ${data.message}</p>` : ""}
              </div>
            </td>
          </tr>

          <!-- Footer Contact Banner -->
          <tr>
            <td style="background-color: #f0f4f2; padding: 24px; text-align: center; border-top: 1px solid #e2e8e5;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #4a5d55; font-weight: 600;">
                Questions about your trip or pickup schedule?
              </p>
              <a href="https://wa.me/5016501003" style="display: inline-block; background-color: #0b3c26; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 50px; font-size: 13px; font-weight: 700;">
                Contact Us on WhatsApp (+501 650-1003)
              </a>
              <p style="margin: 16px 0 0 0; font-size: 11px; color: #8a9c94;">
                Wilder Belize Adventures &bull; Placencia Village, Stann Creek District, Belize &bull; wilderbelizeadventures@gmail.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function generateOwnerOrderAlertHtml(data: BookingEmailData, refNumber: string): string {
  const formattedAmount = Number(data.totalAmount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payment Completed & Credited to Bank</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c2b26;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f6f4; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8e5;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0b3c26; padding: 28px 24px; text-align: center; border-bottom: 4px solid #10b981;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">
                💰 PAYMENT COMPLETED & CREDITED TO YOUR BANK
              </h1>
              <p style="color: #a7f3d0; margin: 6px 0 0 0; font-size: 13px; font-weight: 600;">
                Belize Bank E-Commerce Deposit Confirmed
              </p>
            </td>
          </tr>

          <!-- Amount Banner -->
          <tr>
            <td style="padding: 24px; text-align: center; background-color: #ecfdf5; border-bottom: 1px solid #d1fae5;">
              <div style="display: inline-block; background-color: #059669; color: #ffffff; padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                ✓ Funds Credited to Merchant Account
              </div>
              <p style="margin: 4px 0 0 0; color: #047857; font-size: 13px; font-weight: 700; text-transform: uppercase;">Total Amount Credited</p>
              <h2 style="margin: 4px 0 0 0; color: #065f46; font-size: 34px; font-weight: 900;">$${formattedAmount} USD</h2>
              <p style="margin: 6px 0 0 0; color: #047857; font-size: 13px; font-family: monospace;">Order Ref: <strong>${refNumber}</strong></p>
            </td>
          </tr>

          <!-- Tour & Guest Breakdown -->
          <tr>
            <td style="padding: 24px;">
              <h3 style="margin: 0 0 14px 0; color: #0b3c26; font-size: 14px; font-weight: 800; text-transform: uppercase; border-bottom: 2px solid #e2e8e5; padding-bottom: 8px;">
                Booking & Customer Details
              </h3>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 14px; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #edf2f0;">
                  <td style="padding: 10px 0; color: #6b7c75; font-weight: 500;">Tour Name</td>
                  <td align="right" style="padding: 10px 0; color: #0b3c26; font-weight: 700;">${data.tourName || "Wilder Belize Adventure"}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f0;">
                  <td style="padding: 10px 0; color: #6b7c75; font-weight: 500;">Date of Tour</td>
                  <td align="right" style="padding: 10px 0; color: #1c2b26; font-weight: 600;">${data.date || "To be scheduled"}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f0;">
                  <td style="padding: 10px 0; color: #6b7c75; font-weight: 500;">Number of Guests</td>
                  <td align="right" style="padding: 10px 0; color: #1c2b26; font-weight: 600;">${data.guests || 1} Person(s)</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f0;">
                  <td style="padding: 10px 0; color: #6b7c75; font-weight: 500;">Hotel / Pickup Location</td>
                  <td align="right" style="padding: 10px 0; color: #1c2b26; font-weight: 600;">${data.hotel || "Not specified"}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f0;">
                  <td style="padding: 10px 0; color: #6b7c75; font-weight: 500;">Payment Gateway Status</td>
                  <td align="right" style="padding: 10px 0; color: #059669; font-weight: 700;">COMPLETED & CREDITED (Belize Bank)</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f0;">
                  <td style="padding: 10px 0; color: #6b7c75; font-weight: 500;">Guest Name</td>
                  <td align="right" style="padding: 10px 0; color: #0b3c26; font-weight: 700;">${data.name || "Valued Guest"}</td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f0;">
                  <td style="padding: 10px 0; color: #6b7c75; font-weight: 500;">Guest Email</td>
                  <td align="right" style="padding: 10px 0; color: #0056b3; font-weight: 600;"><a href="mailto:${data.email}" style="color: #0056b3;">${data.email || "Not provided"}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #edf2f0;">
                  <td style="padding: 10px 0; color: #6b7c75; font-weight: 500;">Guest Phone / WhatsApp</td>
                  <td align="right" style="padding: 10px 0; color: #1c2b26; font-weight: 600;"><a href="https://wa.me/${(data.phone || "").replace(/[^0-9]/g, "")}" style="color: #047857;">${data.phone || "Not provided"}</a></td>
                </tr>
                ${data.message ? `
                <tr>
                  <td style="padding: 10px 0; color: #6b7c75; font-weight: 500;">Special Notes</td>
                  <td align="right" style="padding: 10px 0; color: #1c2b26;">${data.message}</td>
                </tr>
                ` : ""}
              </table>
            </td>
          </tr>

          <!-- Footer Prompt -->
          <tr>
            <td style="background-color: #f8faf9; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8e5;">
              <p style="margin: 0; font-size: 13px; color: #4a5d55; font-weight: 600;">
                Payment has been credited to your Belize Bank account. Please assign guide & prepare equipment.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

