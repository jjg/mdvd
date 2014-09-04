
var Events  = require('./events.js');
var Actions = require('./actions.js');
var Notify = require('./notify.js');

var util   = require('util');

var Export  = {};

/**
 * Flatten API
 */

util._extend(Export, Events);
util._extend(Export, Actions);
util._extend(Export, Notify);

/**
 * Export
 */

module.exports = Export;
