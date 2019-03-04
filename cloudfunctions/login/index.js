const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event, context) => {
  console.log(event)
  console.log(context)
  // console.log 的内容可以在云开发云函数调用日志查看

  const { OPENID, APPID, UNIONID } = cloud.getWXContext()
  return {
    OPENID,
    APPID,
    UNIONID,
  }
}
