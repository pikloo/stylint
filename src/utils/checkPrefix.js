'use strict';

/**
 * @description used in conjunction with the valid check (for valid css)
 * @param {string} [prop] the property to prepend prefixes to
 * @param {string} [css] the css key we're checking against (from valid.json)
 * @param {Object} [valid] the valid.json object
 * @returns {boolean} True if at least one match found, false if not.
 */
// TODO: Merge with `checkPseudo`
const checkPrefix = function(prop, css, valid) {
  return valid.prefixes.some(prefix => prop === prefix + css);
};

module.exports = checkPrefix;
