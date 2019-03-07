// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();

//云函数入口函数
exports.main = async(event, context) => {
  const {
    OPENID,
    APPID,
    UNIONID
  } = cloud.getWXContext()
  try {
    return await db.collection('evaluate').add({
      data: {
        fileID: event.fileID,
        commodity_id: event.commodity_id,
        msg: event.msg,
        user_openid: OPENID
      }
    })
  } catch (e) {
    console.log(e)
  }
}