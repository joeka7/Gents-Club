'use strict';

const nodemailer = require('nodemailer');
const { escapeHtml } = require('../utils/escapeHtml');

const LOGO_URL = `${process.env.CLIENT_ORIGIN || 'https://aljameelaclub.com'}/aljameelaclub-dark-logo.png`;

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* Placeholder-aware config check, evaluated once at startup. The contact route
   reads this to fail fast with a descriptive message instead of an SMTP error. */
const REQUIRED = ['EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_TO'];
const missing  = REQUIRED.filter(k => !process.env[k] || process.env[k].startsWith('your-'));

/** Logs SMTP reachability at startup, mirroring the original behaviour. */
function verifyTransport() {
  if (missing.length) {
    console.warn('\n  \u26a0  Missing or placeholder .env values:', missing.join(', '));
    console.warn('     Email sending will fail until these are filled in.\n');
    return;
  }
  transporter.verify((err) => {
    if (err) console.error('  \u2717  SMTP error:', err.message);
    else     console.log('  \u2713  SMTP connected and ready');
  });
}

/** Sends the enquiry email. Template kept byte-for-byte from the original. */
async function sendEnquiry({ name, phone, email, message }) {
  const recipient = process.env.EMAIL_TO || 'customer.service@everlastwellness.com';

const mailOptions = {
  from:    `"Aljameela Club" <${process.env.EMAIL_USER}>`,
  to:      recipient,
  replyTo: email,
  subject: `New Enquiry — ${name}`,
  text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`,
  html: `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#f5f0e8;border:1px solid rgba(28,22,20,0.1);">
      <div style="padding:32px 40px;text-align:center;border-bottom:1px solid rgba(28,22,20,0.08);">
        <img src="${LOGO_URL}" alt="Aljameela Club" style="height:72px;width:auto;display:block;margin:0 auto;" />
        <div style="margin-top:12px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#c4a875;">New Contact Form Enquiry</div>
      </div>

      <div style="padding:36px 40px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid rgba(28,22,20,0.08);">
              <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8a7a6b;margin-bottom:4px;">Name</div>
              <div style="font-size:15px;color:#1c1614;font-weight:500;">${escapeHtml(name)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid rgba(28,22,20,0.08);">
              <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8a7a6b;margin-bottom:4px;">Phone</div>
              <div style="font-size:15px;color:#1c1614;">${escapeHtml(phone)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid rgba(28,22,20,0.08);">
              <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8a7a6b;margin-bottom:4px;">Email</div>
              <div style="font-size:15px;"><a href="mailto:${escapeHtml(email)}" style="color:#c42127;text-decoration:none;">${escapeHtml(email)}</a></div>
            </td>
          </tr>
        </table>

        <div style="margin-top:24px;padding:20px 24px;background:#ede5d8;border-left:3px solid #c4a875;">
          <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8a7a6b;margin-bottom:10px;">Message</div>
          <div style="font-size:14px;color:#3a312c;line-height:1.8;white-space:pre-wrap;">${escapeHtml(message)}</div>
        </div>
      </div>

      <div style="padding:20px 40px;text-align:center;border-top:1px solid rgba(28,22,20,0.08);">
        <div style="font-size:10px;color:#8a7a6b;letter-spacing:1px;">
          &copy; ${new Date().getFullYear()} Aljameela Club &middot; Al Bateen, Abu Dhabi, UAE
        </div>
      </div>
    </div>
  `,
};

  await transporter.sendMail(mailOptions);
}

module.exports = { sendEnquiry, verifyTransport, missing };
