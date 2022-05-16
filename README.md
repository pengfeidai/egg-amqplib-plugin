# egg-amqplib-plugin

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-amqplib-plugin.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-amqplib-plugin
[travis-image]: https://img.shields.io/travis/eggjs/egg-amqplib-plugin.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-amqplib-plugin
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-amqplib-plugin.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-amqplib-plugin?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-amqplib-plugin.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-amqplib-plugin
[snyk-image]: https://snyk.io/test/npm/egg-amqplib-plugin/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-amqplib-plugin
[download-image]: https://img.shields.io/npm/dm/egg-amqplib-plugin.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-amqplib-plugin

<!--
Description here.
-->

## Install

```bash
$ npm i egg-amqplib-plugin --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.amqplib = {
  enable: true,
  package: 'egg-amqplib-plugin',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
'use strict';

/**
 * egg-amqplib-plugin default config
 * @member Config#amqplib
 * @property {String} SOME_KEY - some description
 */
exports.amqplib = {
  app: true,
  agent: false,
  // url: 'amqp:localhost'
  options: {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
    locale: 'en_US',
    frameMax: 0,
    heartbeat: 0,
    vhost: '/',
  },
  // socketOptions: {
  //   cert: certificateAsBuffer, // client cert
  //   key: privateKeyAsBuffer, // client key
  //   passphrase: 'MySecretPassword', // passphrase for key
  //   ca: [caCertAsBuffer], // array of trusted CA certs
  // },
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

```javascript
const Service = require('egg').Service;

class AmqpService extends Service {
  /**
   * send message to rabbitMq
   * @param {{ [key: string]: any; }} msg msg
   * @param {'mining' | 'crowdfund'} type mining or crowdfund
   * @return {Promise<boolean>} res
   */
  async send(msg, type) {
    const { ctx, app, config } = this;
    try {
      msg = JSON.stringify(msg);

      const {
        source,
        client: {
          exchange: { name },
        },
      } = config.amqplib;
      const routingKey = source[type];

      if (!routingKey) {
        ctx.logger.warn('unknown rabbitMq source type.');
        return;
      }
      // 向交换机指定路由发送信息
      app.amqplib.publish(name, routingKey, Buffer.from(msg));
      ctx.logger.info(" [x] Sent %s:'%s' ", routingKey, msg);
      return true;
    } catch (err) {
      ctx.logger.error('send rabbitMQ error:', err);
      throw err;
    }
  }
}

module.exports = AmqpService;
```

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
