'use strict';

const mock = require('egg-mock');

describe('test/amqplib-plugin.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/amqplib-plugin-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest().get('/').expect('hi, amqplibPlugin').expect(200);
  });
});