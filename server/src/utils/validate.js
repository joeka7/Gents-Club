'use strict';

/** Returns an array of human-readable errors; empty means the payload is valid. */
function validate({ name, phone, email, message }) {
  const errors = [];
  if (!name    || name.trim().length < 2)                     errors.push('Name is required.');
  if (!phone   || phone.trim().length < 5)                    errors.push('Phone number is required.');
  if (!email   || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))  errors.push('Valid email is required.');
  if (!message || message.trim().length < 3)                  errors.push('Message is required.');
  return errors;
}

module.exports = { validate };
