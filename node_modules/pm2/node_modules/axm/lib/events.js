

var debug = require('debug')('axm:events');

var Events = {};

Events.emit = function(type, data) {
  if (!type)
    return console.error('[AXM] emit.type is missing');
  if (!data)
    return console.error('[AXM] emit.data is mission');
  if (process.send) {
    process.send({
      type : 'human_event',
      name : type,
      msg  : data
    });
  }
  else {
    debug('[AXM] Message type %s with data %j will be sent once runned by PM2', type, data);
  }
  return false;
};

module.exports = Events;
