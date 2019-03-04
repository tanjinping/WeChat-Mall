Page({
  data: {
    userInfo: {
      nickName: "",
      avatarUrl: ""
    },
    isLogin:true,
    trolleyList: [{
      name: '商品1',
      image: 'https://s3.cn-north-1.amazonaws.com.cn/u-img/product1.jpg',
      price: 45,
      source: '海外·瑞典',
      count: 1,
    }, {
      name: '商品2',
      image: 'https://s3.cn-north-1.amazonaws.com.cn/u-img/product2.jpg',
      price: 158,
      source: '海外·新西兰',
      count: 3,
    }], // 购物车商品列表
    trolleyCheckMap: [undefined, true, undefined], // 购物车中选中的id哈希表
    trolleyAccount: 45, // 购物车结算总价
    isTrolleyEdit: false, // 购物车是否处于编辑状态
    isTrolleyTotalCheck: true, // 购物车中商品是否全选
  },
  onLoad: function (options) {
    
  },
  onShow() {
    const that = this;
    if(this.data.isLogin){
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                that.setData({
                  userInfo: res.userInfo,
                  isLogin:false
                })
              }
            })
          }
        }
      })
    }
  },
  bindGetUserInfo: function (e) {
    const that = this;
    if (e.detail.userInfo) {
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
  }
})