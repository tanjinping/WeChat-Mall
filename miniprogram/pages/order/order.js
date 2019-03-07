Page({
  data: {
    userInfo: {
      nickName: "",
      avatarUrl: ""
    },
    isLogin: true,
    orderList: []
  },
  onLoad: function(options) {
    !this.data.isLogin && this.getOrder();
  },
  onShow() {
    this.getOrder();
    const that = this;
    if (this.data.isLogin) {
      wx.getSetting({
        success: function(res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function(res) {
                that.setData({
                  userInfo: res.userInfo,
                  isLogin: false
                })
                that.getOrder();
              }
            })
          }
        }
      })
    }
  },
  bindGetUserInfo: function(e) {
    const that = this;
    if (e.detail.userInfo) {
      wx.getUserInfo({
        success: function(res) {
          that.setData({
            userInfo: res.userInfo
          })
          that.getOrder();
        }
      })
    }
  },
  getOrder: function() {
    const that = this;
    wx.cloud.callFunction({
      name: 'order',
      success: function(res) {
        that.setData({
          orderList: res.result.data
        })
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  evaluate(event) {
    const value = event.currentTarget.dataset;
    if (value.order.isEvaluate != false) {
      wx: wx.navigateTo({
        url: `/pages/evaluate/evaluate?_id=${value.commodity._id}&order=${value.order._id}`,
      })
    }
  }
})