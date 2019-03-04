Page({
  data: {
    userInfo: {
      nickName: "",
      avatarUrl: ""
    },
    isLogin: true
  },
  onLoad: function (options) {
    
  },
  onShow() {
    const that = this;
    if (this.data.isLogin) {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                that.setData({
                  userInfo: res.userInfo,
                  isLogin: false
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