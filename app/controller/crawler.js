'use strict';

const Controller = require('egg').Controller;
const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');

const login = require('../handlers/login');
const getScore = require('../handlers/getScore');
const getCourse = require('../handlers/getCourse');

class CrawlerController extends Controller {
  async login() {
    const ctx = this.ctx;
    const axios = require('axios');
    const loginParams = {
      loginData: {
        username: '16105160119',
        password: 'hyn534629.'
      },

    }
    await login(loginParams);
    // const getScoreParams = {
    //   getScoreData: {
    //     username: '16105160119',
    //     password: 'hyn534629.',
    //     xn: '2016',
    //     xq: '0'
    //   }
    // }
    // await getScore(getScoreParams);
    const getCourseParams = {
      getCourseData: {
        username: '16105160119',
        password: 'hyn534629.',
        xn: '2018',
        xq: '0'
      }
    }
    await getCourse(getCourseParams);

    ctx.body = 'ok';
  }
}
module.exports = CrawlerController;
