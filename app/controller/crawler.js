'use strict';

const Controller = require('egg').Controller;
const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');

const login = require('../handlers/login');

class CrawlerController extends Controller {
  async login() {
    const ctx = this.ctx;
    const axios = require('axios');
    const params = {
      loginData: {
        username: '16105160119',
        password: 'hyn534629'
      },

    }
    await login(params);
    
    ctx.body = 'ok';
  }
}
module.exports = CrawlerController;
