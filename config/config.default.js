'use strict';

/**
 * egg-amqplib-plugin default config
 * @member Config#amqplib
 * @property {String} SOME_KEY - some description
 */
exports.amqplib = {
  client: {
    // url: 'amqp:localhost:5672'
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
  },
};
