'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const str1 = "K12          ";
    const str2 = "          ";
    // console.log(str1.indexOf("K") !== -1);
    // console.log(str2.indexOf("K") !== -1);
    this.ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
