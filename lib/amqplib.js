'use strict';

const amqp = require('amqplib');
const Promise = require('bluebird');
const EventEmitter = require('events').EventEmitter;

class Amqplib extends EventEmitter {
  constructor(config) {
    super();
    this._conn = null;
    this._ch = null;
    this._url = config.url || null;
    this._connectOptions = config.options || null;
    this._exchange = config.exchange || null;
    this.reConnectInterval = 5000; // ms
  }

  async init() {
    try {
      await this.connect();
      await this.createChannel();
      if (this._exchange) {
        await this.assertExchange(
          this._exchange.name,
          this._exchange.type,
          this._exchange.options
        );
      }
    } catch (err) {
      this.emit('error', err);
    }
  }

  async connect() {
    const connectOptions = this._url || this._connectOptions;
    this._conn = await amqp.connect(connectOptions);

    this._conn.on('error', err => {
      this.emit('error', err);
    });

    this._conn.on('close', async err => {
      this.emit('close', err);
      this._conn = null;
      await this.retryConnect();
    });

    this.emit('connect', this._conn);
  }

  async retryConnect() {
    try {
      if (!this._conn) {
        await this.connect();
      }

      if (!this._ch) {
        await this.createChannel();
      }
    } catch (err) {
      this.emit('error', err);
      setTimeout(async () => {
        await this.retryConnect();
      }, this.reConnectInterval);
    }
  }

  async createChannel() {
    this._ch = await this._conn.createChannel();
    this._ch.on('error', err => {
      this.emit('error', err);
    });

    this._ch.on('close', () => {
      this.emit('close', null);
      this._ch = null;
    });

    this.emit('ch_open', this._ch);
  }

  assertExchange(exchange, type, options = {}) {
    return this._ch.assertExchange(exchange, type, options);
  }

  publish(exchange, routingKey, msg, options = {}) {
    return new Promise((resolve, reject) => {
      this._ch.publish(exchange, routingKey, msg, options, (err, ok) => {
        if (err) {
          reject(err);
        } else {
          resolve(ok);
        }
      });
    });
  }

  sendToQueue(queue, msg, options = {}) {
    return new Promise((resolve, reject) => {
      this._ch.sendToQueue(queue, msg, options, (err, ok) => {
        if (err) {
          reject(err);
        } else {
          resolve(ok);
        }
      });
    });
  }
}

module.exports = Amqplib;
