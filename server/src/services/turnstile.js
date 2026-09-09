'use strict';

/**
 * Verifies a Cloudflare Turnstile token.
 * Returns { ok: true } or { ok: false, status, error } ready for the response.
 */
async function verifyTurnstile(token) {
  if (!token) {
    return { ok: false, status: 400, error: 'Please complete the CAPTCHA.' };
  }
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    });
    const data = await res.json();
    if (!data.success) {
      return { ok: false, status: 400, error: 'CAPTCHA verification failed. Please try again.' };
    }
    return { ok: true };
  } catch {
    return { ok: false, status: 500, error: 'Could not verify CAPTCHA. Please try again.' };
  }
}

module.exports = { verifyTurnstile };
