'use strict';

// the alphabet, uppers
const upperRe = /[A-Z]+/m;
// BEM (http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
const bemRe = /^([$.#{:][${a-z]([-]?[${}a-z0-9]+)*(_{2}[${}a-z0-9]([-]?[${}a-z0-9]+)*)?((_[${}a-z0-9]([-]?[a-z0-9}]+)*){2})*)\b/m;
// camelCase or CamelCase
const camelRe = /^[$#.{:]+([a-zA-Z]|[${}])+([a-z]|[${}])+(([.A-Z0-9])+[a-z ]+)+\b/m;

/**
 * @description Check for names-like-this vs namesLikeThis
 * or NamesLikeThis vs names_like_this or names-like__this-that
 * @param {string} [line] - Current line being linted.
 * @returns {boolean} True if convention wrong, false if not.
 */
const namingConvention = function(line) {
  const arr = this.splitAndStrip(' ', line);
  // determine if line should be tested at all
  let doWeTestRe = /^[${:]+/m;
  let badConvention = false;

  // test a wider range if strict is true
  if (this.config.namingConventionStrict === true) {
    doWeTestRe = /^[$#.{:]+/m;
  }

  // only run checks if on a class, id, or variable
  if (doWeTestRe.test(arr[0]) && arr[0].indexOf('::') === -1) {
    // if all lowercase we do nothing, if -, _ or uppercase found we check convention
    if (upperRe.test(arr[0]) || arr[0].indexOf('-') !== -1 || arr[0].indexOf('_') !== -1) {
      // check conventions
      // $varName
      if (this.state.conf === 'camelCase') {
        // if no A-Z present, or - present, or _ present
        if (arr[0].indexOf('-') !== -1 || arr[0].indexOf('_') !== -1 || !camelRe.test(arr[0])) {
          badConvention = true;
        }
      } else if (this.state.conf === 'lowercase_underscore') {
        // $var_name
        // if no _ present, or - present, or A-Z present
        if (arr[0].indexOf('-') !== -1 || arr[0].indexOf('_') === -1 || upperRe.test(arr[0])) {
          badConvention = true;
        }
      } else if (this.state.conf === 'lowercase-dash') {
        // $var-name
        // if no - present, or _ present, or A-Z present
        if (arr[0].indexOf('-') === -1 || arr[0].indexOf('_') !== -1 || upperRe.test(arr[0])) {
          badConvention = true;
        }
      } else if (this.state.conf === 'BEM') {
        // $var__element
        // if A-Z or not following BEM specification
        if (upperRe.test(arr[0]) || !bemRe.test(arr[0])) {
          badConvention = true;
        }
      } else if (typeof this.state.conf === 'string') {
        // if not one of the defaults, assume custom regExp
        const conventionRe = new RegExp(this.state.conf, 'm');

        if (!conventionRe.test(arr[0])) {
          badConvention = true;
        }
      }
    }
  }

  if (badConvention === true) {
    const index = line.indexOf(arr[0]);
    this.msg(`preferred naming convention is ${this.state.conf}`, index);
  }

  return badConvention;
};

module.exports = namingConvention;
