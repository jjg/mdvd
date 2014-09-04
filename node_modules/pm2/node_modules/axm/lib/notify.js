
var debug = require('debug')('axm:notify');

var Notify = {};

var jsonize = function(err, filter, space) {
  var plainObject = {};
  Object.getOwnPropertyNames(err).forEach(function(key) {
    plainObject[key] = err[key];
  });
  return plainObject;
};

Notify.notify = function(err) {
  if (!(err instanceof Error))
    err = new Error(err);

  debug(err.stack || err);

  if (process.send) {
    process.send({
      type : 'process:exception',
      stack : err.stack,
      err  : jsonize(err)
    });
  } else {
    console.error(err.stack || err);
  }
};

Notify.expressErrorHandler = function() {
  var self = this;

  return function errorHandler(err, req, res, next) {
    if (res.statusCode < 400) res.statusCode = 500;

    debug(err.stack || err);

    err.url = req.url;
    err.component = req.url;
    err.action = req.method;
    err.params = req.body;
    err.session = req.session;

    if (process.send) {
      process.send({
        type  : 'process:exception',
        stack : err.stack,
        err   : jsonize(err)
      });
    }

    return next(err);
  };
};

module.exports = Notify;
