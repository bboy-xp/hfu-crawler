const axios = require('axios');

module.exports = async (params, ctx) => {
  const { cookie, getCourseData } = params;
  const { username, password, xn, xq } = getCourseData;

  const getCourseRes = await axios({
    url: 'http://weixin.hrbfu.edu.cn/WeiXinJR/mobile-app/mobileNewService!find_schedule_List.action',
    method: 'POST',
    data: `username=${username}&password=${password}&xn=${xn}&xq=${xq}`,
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

  //  STIMEZC   周次
  //  XQ        学期
  //  JCZ       星期和上课节次
  //  XH        学号
  //  XN        学年
  //  BJDM      这个编号都是一样的
  //  XM        姓名
  //  DSZ       单双周
  //  JSM       教室码
  //  ZWMC      中文名称
  //  ZCXX      周次信息
  //  KCID      课程ID
  //  JCXX      节次信息
  //  MC        教室名称

  const getCourseResArr = getCourseRes.data.data;
  const filterCoursesArr = [];
  // 筛选不必要的课
  getCourseResArr.map((e, i) => {
    // 先删除没有教室的课程
    if(e.JSM !== "                    ") {
      // console.log(e.JCZ);
      let isHaveCourse = false;
      let isHaveCourseIndex;
      for (let j = 0; j < filterCoursesArr.length; j++) {
        if(filterCoursesArr[j].JCZ === e.JCZ) {
          isHaveCourse = true;
          isHaveCourseIndex = j;
        }
      }
      // console.log(isHaveCourse, isHaveCourseIndex);
      if(isHaveCourse) {
        filterCoursesArr[isHaveCourseIndex] = e;
      }else {
        filterCoursesArr.push(e);
      }
    }
  })
  console.log(filterCoursesArr.length);
  return (getCourseRes.data.data);
};