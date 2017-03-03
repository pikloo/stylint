/* eslint-disable consistent-return */

'use strict';

// super simple.
// if there's anything on the line besides whitespace, it ain't empty
const emptyLineRe = /\S/;

/**
 * @description Sets values like context, determine whether we even run tests, etc.
 * @param {string} [line] - Current line being linted.
 * @returns {Function | undefined} Undefined if we catch something, else lint().
 */
const setState = function(line) {
  this.state.context = this.setContext(this.cache.line);

  // ignore the current line if @stylint ignore
  if (this.cache.source.indexOf('@stylint ignore') !== -1) {
    return;
  }

  // if @stylint on / off commands found in the code
  if (this.stylintOn(this.cache.source) || this.stylintOff(this.cache.source) === false) {
    return;
  }

  // if hash starting / ending, set state and return early
  if (this.hashOrCSSStart(line) || this.hashOrCSSEnd(line) === false) {
    return;
  }

  // if starting / ending keyframes
  if (this.keyframesStart(line) || this.keyframesEnd(line) === false) {
    return;
  }

  // if starting / ending css4 :root
  // we'll need to capture custom properties
  if (this.rootStart(line) || this.rootEnd(line) === false) {
    return;
  }

  // if entire line is comment, just check comment spacing and that's it
  if (this.startsWithComment(line)) {
    if (typeof this.config.commentSpace !== 'undefined') {
      this.state.conf = this.config.commentSpace.expect || this.config.commentSpace;
      this.state.severity = this.config.commentSpace.error ? 'error' : 'warning';
      this.lintMethods.commentSpace.call(this, this.cache.line, this.cache.source);
    }
    return;
  }

  // if empty line
  if (emptyLineRe.test(line) === false) {
    this.cache.sortOrderCache = [];
    return;
  }

  // actually run tests if we made it this far
  if (this.state.testsEnabled === true) {
    return this.lint();
  }
};

module.exports = setState;
