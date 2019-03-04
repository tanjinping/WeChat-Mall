App({
  onLaunch: function () {
    //云能力初始化
    wx.cloud.init({
      env: 'market-cd7fa8',
      traceUser: true
    })
  }
})