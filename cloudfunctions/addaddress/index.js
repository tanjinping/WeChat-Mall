// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const {
    OPENID,
    APPID,
    UNIONID
  } = cloud.getWXContext()
  try {
    return await db.collection('address').add({
      data: {
        address: event.address,
        name: event.name,
        number: event.number,
        user_openid: OPENID
      }
    })
  } catch (e) {
    console.log(e)
  }
}