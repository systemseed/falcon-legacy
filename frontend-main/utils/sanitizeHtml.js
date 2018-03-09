import sanitizeHtml from 'sanitize-html';

// Adds more html tags to allowed tags for samitize library.
export default (html) => sanitizeHtml(html, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['u', 's']) });
