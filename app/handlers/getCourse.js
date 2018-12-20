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

  function formatDayOfWeek(dayOfWeekNum) {
    let dayOfWeek;
    switch (dayOfWeekNum) {
      case 1:
        dayOfWeek = '星期一';
        break;
      case 2:
        dayOfWeek = '星期二';
        break;
      case 3:
        dayOfWeek = '星期三';
        break;
      case 4:
        dayOfWeek = '星期四';
        break;
      case 5:
        dayOfWeek = '星期五';
        break;
      case 6:
        dayOfWeek = '星期六';
        break;
      case 7:
        dayOfWeek = '星期日';
        break;
    }
    return (dayOfWeek);
  };
  function getSmartWeeks(weekStr) {
    let smartWeeks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (weekStr.indexOf(',') === -1) {
      //周数中没有','的字符串
      const weekArr = weekStr.split('-');
      if (weekArr.length === 1) {
        //只有一个数字的周数
        const smartWeeksIndex = Number(weekArr[0]) - 1;
        smartWeeks[smartWeeksIndex] = 1;
      } else {
        //有范围的周数
        const smartWeeksStartIndex = Number(weekArr[0]) - 1;
        const smartWeeksEndIndex = Number(weekArr[1]) - 1;
        for (let i = smartWeeksStartIndex; i <= smartWeeksEndIndex; i++) {
          smartWeeks[i] = 1;
        }
      }
    } else {
      // 周数中有','的字符串
      const weekArr = weekStr.split(',');
      weekArr.map((e, i) => {
        const smartWeeksIndex = Number(e) - 1;
        smartWeeks[smartWeeksIndex] = 1;
      })
    }
    // console.log(smartWeeks);
    return (smartWeeks);
  }


  const getCourseResArr = getCourseRes.data.data;
  const filterCoursesArr = [];
  // 筛选不必要的课
  getCourseResArr.map((e, i) => {
    // 先删除没有教室的课程
    if (e.JSM !== "                    ") {
      // console.log(e.JCZ);
      let isHaveCourse = false;
      let isHaveCourseIndex;
      for (let j = 0; j < filterCoursesArr.length; j++) {
        if (filterCoursesArr[j].JCZ === e.JCZ) {
          isHaveCourse = true;
          isHaveCourseIndex = j;
        }
      }
      // console.log(isHaveCourse, isHaveCourseIndex);
      if (isHaveCourse) {
        filterCoursesArr[isHaveCourseIndex] = e;
      } else {
        filterCoursesArr.push(e);
      }
    }
  })
  // 格式化filterCoursesArr变成给好的格式
  const formatCoursesArr = [];
  filterCoursesArr.map((e, i) => {
    let course = {
      schoolId: 'hfu',
      stuId: e.XH,
      semesterId: '',
      teacher: '',
      name: e.XM,
      injectByUser: false,
      courseUnits: []
    }
    // 存学期id
    course['semesterId'] = e.XN + '-' + e.XQ;
    // 存courseUnits
    let courseUnitsItem = {
      weeks: e.STIMEZC + '(周)',
      dayOfWeek: '',
      timeStart: e.JCXX.substring(1, 2), // 节次
      count: '2', // 节数
      building: '',
      room: '',
      smartWeeks: [],
    }
    // const courseArea = e.MC.split('-');
    if (e.MC.indexOf('-') !== -1) {
      const courseArea = e.MC.split('-');
      courseUnitsItem['building'] = courseArea[0];
      courseUnitsItem['room'] = courseArea[1];
    } else {
      const building = e.MC.match(/^[a-z|A-Z]+/gi)[0];
      const room = e.MC.match(/\d+$/gi)[0];
      courseUnitsItem['building'] = building;
      courseUnitsItem['room'] = room;
    }
    const dayOfWeekNum = e.JCZ.substring(1, 2);
    courseUnitsItem['dayOfWeek'] = formatDayOfWeek(dayOfWeekNum);
    // 处理智能周
    courseUnitsItem['smartWeeks'] = getSmartWeeks(e.STIMEZC);

    const CourseUnits = course['courseUnits'];
    CourseUnits.push(courseUnitsItem);

    course['courseUnits'] = CourseUnits;

    formatCoursesArr.push(course);
  })

  return (formatCoursesArr);
};