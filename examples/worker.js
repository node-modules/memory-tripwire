/*!
 * memory-tripwire - examples/worker.js
 * Copyright(c) 2015 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var bytes = require('humanize-bytes');
var Tripwire = require('..');

var tripwire = Tripwire({
  warning: '20mb',
  critical: '40mb',
  interval: '1s',
  cycle: 3,
  exitTime: '5s',
  disconnectTime: '3s'
});

tripwire.start();

var cache = [];

function push() {
  for (var i = 0; i < 1000; i++) {
    cache.push({foo: 'bar'});
  }
}

if (process.pid % 2 === 0) {
  while(process.memoryUsage().rss < bytes('20mb')) {
    push();
  }
  console.log('[%s] rss reach %s, warning!', process.pid, process.memoryUsage().rss);
} else {
  while(process.memoryUsage().rss < bytes('40mb')) {
    push();
  }
  console.log('[%s] rss reach %s, critical!', process.pid, process.memoryUsage().rss);
}
