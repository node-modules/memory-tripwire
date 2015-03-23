var path = require('path');
var util = require('util');
var cfork = require('cfork');
var childprocess = require('child_process');
var workerPath = path.join(__dirname, 'worker.js');
var cluster = require('cluster');

clusterSetup();

function clusterSetup() {
  cfork({
    exec: workerPath,
    refork: false,
    count: 1
  })
  .on('fork', function (worker) {
    console.log('[%s] [worker:%d] new worker start',
      Date(), worker.process.pid);
  })

  .on('disconnect', function (worker) {
    console.log('[%s] [master:%s] wroker:%s disconnect, suicide: %s, state: %s.',
      Date(), process.pid, worker.process.pid, worker.suicide, worker.state);
    cluster.fork();
  })

  .on('exit', function (worker, code, signal) {
    var exitCode = worker.process.exitCode;
    if (exitCode === 99) {
      return console.log('worker %s exit by memory tripwire', worker.process.pid);
    }
    var err = new Error(util.format('worker %s died (code: %s, signal: %s, suicide: %s, state: %s)',
      worker.process.pid, exitCode, signal, worker.suicide, worker.state));
    err.name = 'WorkerDiedError';
    console.error(err.stack);
  })

  .on('unexpectedExit', function (worker, code, signal) {
    // fork a new worker
    cluster.fork();
    var exitCode = worker.process.exitCode;
    var err = new Error(util.format('worker %s died (code: %s, signal: %s, suicide: %s, state: %s)',
      worker.process.pid, exitCode, signal, worker.suicide, worker.state));
    err.name = 'WorkerDiedError';
    console.error(err.stack);
  });
}

function forkWorker() {
  for (var i = 0; i < config.workerNum; i++) {
    var worker = cluster.fork();
  }
}

// make sure master not die
process.on('uncaughtException', function (err) {
  console.error(err.stack);
});
