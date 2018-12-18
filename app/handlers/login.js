const axios = require('axios');

module.exports = async (params, ctx) => {
  const { cookie, loginData } = params;
  const { username, password } = loginData;
  console.log(username, password);

  const loginRes = await axios({
    url: 'http://weixin.hrbfu.edu.cn/WeiXinJR/mobile-app/mobileNewService!find_chengjiWeChat_xn.action',
    method: 'POST',
    data: `username=${username}&password=${password}`,
    headers: {
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
      'Host': 'weixin.hrbfu.edu.cn',
      'Origin': 'http://weixin.hrbfu.edu.cn',
      'Referer': 'http://weixin.hrbfu.edu.cn/WeiXinJR/cjcx/index.html',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16B92 MicroMessenger/6.7.4(0x1607042c) NetType/4G Language/zh_CN'
    },
  });

  // console.log(loginRes.data);
};