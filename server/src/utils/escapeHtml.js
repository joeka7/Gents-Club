'use strict';

/** Escapes user-supplied text before interpolation into the email HTML. */
function escapeHtml(str) {
  return String(str)
    .replaceAll('&',  '&amp;')
    .replaceAll('<',  '&lt;')
    .replaceAll('>',  '&gt;')
    .replaceAll('"',  '&quot;')
    .replaceAll("'",  '&#x27;');
}

module.exports = { escapeHtml };
