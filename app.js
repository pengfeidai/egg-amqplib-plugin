'use strict';

const Amqplib = require('./lib/amqplib');
const assert = require('assert');

module.exports = app => {
  app.addSingleton('amqplib', createClient);
};

function createClient(config, app) {
  assert(
    config.url || config.options,
    '[egg-amqplib-plugin] url or options configuration is required'
  );
  const client = new Amqplib(config);

  client.on('connect', () => {
    app.coreLogger.info('[egg-amqplib-plugin] client connect success');
  });

  client.on('close', err => {
    app.coreLogger.info('[egg-amqplib-plugin] client error: %s', err);
    app.coreLogger.error(err);
  });

  client.on('ch_open', () => {
    app.coreLogger.info('[egg-amqplib-plugin] channel opened.');
  });

  app.beforeStart(async () => {
    app.coreLogger.info('[egg-amqplib-plugin] status OK, client ready');
    await client.init();
  });

  return client;
}
