'use strict';

const express = require('express');
const { verifyTurnstile } = require('../services/turnstile');
const { sendEnquiry, missing } = require('../services/mailer');
const { validate } = require('../utils/validate');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, phone, email, message, turnstileToken } = req.body;

  // CAPTCHA first, before any other work.
  const captcha = await verifyTurnstile(turnstileToken);
  if (!captcha.ok) {
    return res.status(captcha.status).json({ success: false, error: captcha.error });
  }

  const errors = validate({ name, phone, email, message });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, error: errors[0] });
  }

  // Fail with a descriptive message rather than an opaque SMTP error.
  if (missing.length) {
    return res.status(500).json({
      success: false,
      error: `Server not configured. Missing: ${missing.join(', ')}. Update your .env file.`,
    });
  }

  try {
    await sendEnquiry({ name, phone, email, message });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Nodemailer error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
