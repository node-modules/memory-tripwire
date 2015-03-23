memory-tripwire
---------------

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![Gittip][gittip-image]][gittip-url]

[npm-image]: https://img.shields.io/npm/v/memory-tripwire.svg?style=flat-square
[npm-url]: https://npmjs.org/package/memory-tripwire
[travis-image]: https://img.shields.io/travis/node-modules/memory-tripwire.svg?style=flat-square
[travis-url]: https://travis-ci.org/node-modules/memory-tripwire
[coveralls-image]: https://img.shields.io/coveralls/node-modules/memory-tripwire.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/node-modules/memory-tripwire?branch=master
[david-image]: https://img.shields.io/david/node-modules/memory-tripwire.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/memory-tripwire
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[gittip-image]: https://img.shields.io/gittip/dead-horse.svg?style=flat-square
[gittip-url]: https://www.gittip.com/dead-horse/

suicide when memory over the limit

## Installation

```bash
$ npm install memory-tripwire
```

## Usage

```js
var tripwire = Tripwire({
  warning: '20mb',
  critical: '40mb',
  interval: '1s',
  cycle: 3,
  exitTime: '5s',
  disconnectTime: '3s'
});

tripwire.start();
tripwire.on('bomb', function () {
  console.log('oops');
});
```

### Options

- `warning` - warning memory limit, will be killed after observation
- `critical` - critical memory limit, will be killed at once if memory is critical
- `interval` - memory check interval
- `cycle` - max warning continuously cycle, or will be killed
- `disconnectTime` - will disconnect after `disconnctTime`
- `exitTime` - will exit after `exitTime`
- `exitCode` - will exit with `exitCode`

### [Examples](examples)

## License

MIT
