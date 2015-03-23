/*!
 * memory-tripwire - test/index.test.js
 * Copyright(c) 2015 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var bytes = require('humanize-bytes');
var pedding = require('pedding');
var cluster = require('cluster');
var Tripwire = require('..');
var mm = require('mm');

describe('memory-tripwire', function () {
  afterEach(mm.restore);
  beforeEach(function () {
    mm(cluster, 'worker', {
      suicide: false,
      disconnect: function () {}
    });
    mm(process, 'exit', function (code) {
      code.should.equal(99);
    });
  });

  it('should trigger when warning too many cycles', function (done) {
    done = pedding(3, done);
    mm(process, 'memoryUsage', function () {
      return {rss: bytes('150kb')};
    });
    var tripwire = createTripwire();
    tripwire.start();
    tripwire.once('bomb', done);
    tripwire.once('disconnect', done);
    tripwire.once('exit', done);
  });

  it('should trigger when critical once', function (done) {
    done = pedding(3, done);
    var times = 0;
    mm(process, 'memoryUsage', function () {
      times++;
      return times === 5 ? {rss: bytes('300kb')} : {rss: bytes('50kb')};
    });
    var tripwire = createTripwire();
    tripwire.start();
    tripwire.once('bomb', done);
    tripwire.once('disconnect', done);
    tripwire.once('exit', done);
  });
});

function createTripwire() {
  return Tripwire({
    interval: 10,
    warning: '100kb',
    critical: '200kb',
    cycle: 5,
    disconnectTime: '100ms',
    exitTime: '200ms'
  });
}
