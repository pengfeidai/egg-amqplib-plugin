'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, ' + this.app.plugins.amqplibPlugin.name;
  }
}

module.exports = HomeController;
