/*!
 * memory-tripwire - index.js
 * Copyright(c) 2015 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;
var bytes = require('humanize-bytes');
var cluster = require('cluster');
var ms = require('humanize-ms');
var copy = require('copy-to');
var util = require('util');

module.exports = Tripwire;

var defaultOpts = {
  warning: '500mb',
  critical: '700mb',
  cycle: 10,
  interval: '1m',
  disconnectTime: '10s',
  exitTime: '30s',
  exitCode: 99
};

/**
 *
 * @param {Object} opts
 *   - {String|Number} warning warning memory limit, will be killed after observation
 *   - {String|Number} critical critical memory limit, will be killed at once if memory is critical
 *   - {String|Number} interval memory check interval
 *   - {Number} cycle max warning continuously cycle, or will be killed
 *   - {String|Number} disconnectTime will disconnect
 *   - {String|Number} exitTime
 *   - {Number} exitCode
 */
function Tripwire(opts) {
  if (!(this instanceof Tripwire)) return new Tripwire(opts);
  this.options = {};
  copy(opts).and(defaultOpts).to(this.options);
  EventEmitter.call(this);

  this.options.warning = bytes(this.options.warning);
  this.options.critical = bytes(this.options.critical);
  this.options.interval = ms(this.options.interval);
  this.options.disconnectTime = ms(this.options.disconnectTime);
  this.options.exitTime = ms(this.options.exitTime);

  this.count = 0;
  this.timer = null;
};

util.inherits(Tripwire, EventEmitter);

/**
 * start the timer
 */

Tripwire.prototype.start = function() {
  this.timer = setInterval(this.tick.bind(this), this.options.interval);
};

/**
 * stop the timer
 */

Tripwire.prototype.stop = function () {
  this.count = 0;
  if (this.timer) clearInterval(this.timer);
  this.timer = null;
};

/**
 * call in every circle, check the memory usage
 */

Tripwire.prototype.tick = function () {
  var rss = process.memoryUsage().rss;
  if (rss > this.options.critical) return this.trigger();
  if (rss < this.options.warning) return this.count = 0;
  this.count++;
  if (this.count >= this.options.cycle) return this.trigger();
};

/**
 * trigger disconnect and exit
 */

Tripwire.prototype.trigger = function () {
  this.emit('bomb');
  this.count = 0;
  this.stop();
  setTimeout(this.disconnect.bind(this), this.options.disconnectTime);
  setTimeout(this.exit.bind(this), this.options.exitTime);
};

/**
 * disconnect with the master
 */

Tripwire.prototype.disconnect = function () {
  this.emit('disconnect');
  if (cluster.worker && !cluster.worker.suicide) {
    cluster.worker.disconnect();
  }
};

/**
 * exit the
 * @return {[type]} [description]
 */
Tripwire.prototype.exit = function () {
  this.emit('exit');
  process.exit(this.options.exitCode);
};
