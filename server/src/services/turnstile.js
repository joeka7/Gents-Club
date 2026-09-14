'use strict';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/* The project originally used TURNSTILE_SECRET_KEY; CLOUDFLARE_TURNSTILE_SECRET_KEY
   is the current name. Read the new name first and fall back, so an existing
   deployment keeps working without an env rename. The value is never logged. */
const SECRET = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY;

/**
 * Verifies a Cloudflare Turnstile token server-side.
 * Returns { ok: true } or { ok: false, status, error } ready for the response.
 * Fails closed: any missing secret, missing token, network failure or
 * unsuccessful Cloudflare result rejects the submission.
 */
async function verifyTurnstile(token, remoteIp) {
  // No secret configured is a server misconfiguration, not a reason to let the
  // request through. Log the condition without revealing any key material.
  if (!SECRET) {
    console.error('[turnstile] Secret key is not configured — rejecting submission.');
    return { ok: false, status: 500, error: 'CAPTCHA is not configured. Please try again later.' };
  }

  if (!token) {
    return { ok: false, status: 400, error: 'Please complete the CAPTCHA.' };
  }

  try {
    // Cloudflare's documented endpoint expects form-encoded parameters.
    const body = new URLSearchParams({ secret: SECRET, response: token });
    if (remoteIp) body.append('remoteip', remoteIp);

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!res.ok) {
      console.error('[turnstile] Verification endpoint returned HTTP', res.status);
      return { ok: false, status: 502, error: 'Could not verify CAPTCHA. Please try again.' };
    }

    const data = await res.json();
    if (!data.success) {
      // Cloudflare's error codes are useful server-side but must not reach the client.
      console.warn('[turnstile] Verification failed:', (data['error-codes'] || []).join(', '));
      return { ok: false, status: 400, error: 'CAPTCHA verification failed. Please try again.' };
    }

    return { ok: true };
  } catch (err) {
    console.error('[turnstile] Verification request error:', err.message);
    return { ok: false, status: 502, error: 'Could not verify CAPTCHA. Please try again.' };
  }
}

module.exports = { verifyTurnstile };
