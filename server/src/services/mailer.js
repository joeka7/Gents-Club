'use strict';

const nodemailer = require('nodemailer');
const { escapeHtml } = require('../utils/escapeHtml');

const SITE_ORIGIN = process.env.CLIENT_ORIGIN || 'https://gentsfacialclub.com';
const LOGO_URL   = `${SITE_ORIGIN}/gents-logo.png`;

/* Brand palette, mirroring src/styles/tokens.css. */
const INK   = '#20334d'; // primary dark blue
const AZURE = '#75a2c7'; // primary light blue

/* Arabic, Arabic Supplement, Extended-A and the Presentation Forms blocks.
   Used to set dir/text-align per value so Arabic submissions read correctly. */
const RTL_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const isRtl  = (v) => RTL_RE.test(String(v || ''));

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

/** Renders one label/value row. Values carry their own dir so an Arabic
    submission reads right-to-left inside the otherwise LTR notification. */
function row(label, valueHtml, value, { last = false } = {}) {
  const rtl    = isRtl(value);
  const border = last ? '' : 'border-bottom:1px solid #e4ecf3;';
  return `
              <tr>
                <td style="padding:14px 0;${border}">
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:14px;letter-spacing:2px;text-transform:uppercase;color:${AZURE};padding-bottom:5px;">${label}</div>
                  <div dir="${rtl ? 'rtl' : 'ltr'}" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:${INK};text-align:${rtl ? 'right' : 'left'};">${valueHtml}</div>
                </td>
              </tr>`;
}

/** Sends the enquiry email. Transport, recipient and subject are unchanged. */
async function sendEnquiry({ name, phone, email, message }) {
  const recipient = process.env.EMAIL_TO || 'customer.service@everlastwellness.com';

  const msgRtl = isRtl(message);
  const year   = new Date().getFullYear();

const mailOptions = {
  from:    `"Gents Facial Club" <${process.env.EMAIL_USER}>`,
  to:      recipient,
  replyTo: email,
  subject: `New Enquiry — ${name}`,
  text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`,
  html: `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>New Enquiry</title>
<!--[if mso]><style>body,table,td{font-family:Arial,Helvetica,sans-serif !important;}</style><![endif]-->
<style>
  /* Sole media query: stacks padding on small screens. Clients that ignore
     it still get the fixed 600px table, which is the safe default. */
  @media only screen and (max-width:620px) {
    .gfc-shell  { width:100% !important; }
    .gfc-pad    { padding-left:24px !important; padding-right:24px !important; }
    .gfc-header { padding:28px 24px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#f2f6f9;">
  <div style="display:none;font-size:1px;color:#f2f6f9;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">New contact enquiry from ${escapeHtml(name)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f6f9;">
    <tr>
      <td align="center" style="padding:32px 12px;">

        <table role="presentation" class="gfc-shell" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid #e4ecf3;">

          <!-- Header -->
          <tr>
            <td class="gfc-header" align="center" bgcolor="${INK}" style="background-color:${INK};padding:36px 40px;">
              <img src="${LOGO_URL}" alt="Gents Facial Club" width="96" height="96" style="display:block;width:96px;height:96px;border:0;outline:none;text-decoration:none;margin:0 auto;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:16px;letter-spacing:3px;text-transform:uppercase;color:${AZURE};padding-top:18px;">New Contact Enquiry</div>
            </td>
          </tr>

          <!-- Accent rule -->
          <tr><td bgcolor="${AZURE}" style="background-color:${AZURE};font-size:0;line-height:0;height:3px;">&nbsp;</td></tr>

          <!-- Content -->
          <tr>
            <td class="gfc-pad" style="padding:36px 40px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${row('Name', escapeHtml(name), name)}
${row('Phone', `<a href="tel:${escapeHtml(String(phone).replace(/[^\d+]/g, ''))}" style="color:${INK};text-decoration:none;">${escapeHtml(phone)}</a>`, phone)}
${row('Email', `<a href="mailto:${escapeHtml(email)}" style="color:${INK};text-decoration:underline;">${escapeHtml(email)}</a>`, email, { last: true })}
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td class="gfc-pad" style="padding:8px 40px 36px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:14px;letter-spacing:2px;text-transform:uppercase;color:${AZURE};padding-bottom:8px;">Message</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f6f9;">
                <tr>
                  <td style="padding:20px 24px;border-${msgRtl ? 'right' : 'left'}:3px solid ${AZURE};">
                    <div dir="${msgRtl ? 'rtl' : 'ltr'}" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:26px;color:${INK};text-align:${msgRtl ? 'right' : 'left'};white-space:pre-wrap;">${escapeHtml(message)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="gfc-pad" align="center" bgcolor="${INK}" style="background-color:${INK};padding:26px 40px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">Gents Facial Club</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:20px;color:${AZURE};padding-top:4px;">By Everlast Wellness Medical Center</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:20px;color:#a3b6cb;padding-top:10px;">
                446 Al Khaleej Al Arabi St &middot; Al Bateen &middot; Abu Dhabi &middot; UAE
              </div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:20px;color:#a3b6cb;">
                <a href="tel:+971600551615" style="color:#a3b6cb;text-decoration:none;">+971 600 551 615</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:customer.service@everlastwellness.com" style="color:#a3b6cb;text-decoration:none;">customer.service@everlastwellness.com</a>
              </div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:18px;color:#6b7f99;padding-top:12px;">&copy; ${year} Gents Facial Club &middot; All rights reserved</div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`,
};

  await transporter.sendMail(mailOptions);
}

module.exports = { sendEnquiry, verifyTransport, missing };
