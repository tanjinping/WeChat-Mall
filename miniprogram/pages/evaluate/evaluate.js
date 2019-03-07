Page({
  data: {
    commodity: {},
    msg: '',
    order_id: '',
    path: []
  },
  onLoad: function(options) {
    this.setData({
      order_id: options.order
    })
    const db = wx.cloud.database();
    wx.showLoading({
      title: '商品加载中'
    })
    db.collection('commodity').doc(options._id).get().then(res => {
      wx.hideLoading();
      this.setData({
        commodity: res.data
      })
    })
  },
  input(event) {
    this.setData({
      msg: event.detail.value
    })
  },
  submit() {
    //上传评价图片
    let files = [];
    if (this.data.path.length) {




      this.data.path.map((src) => {
        wx.cloud.uploadFile({
            cloudPath: `${Math.random() * 10000000000000000}.png`,
            filePath: src,
          })
          .then(res => {
            files.push(
              res.fileID
            )
            if (files.length === this.data.path.length) {
              wx.cloud.callFunction({
                  name: 'addEvaluate',
                  data: {
                    fileID: files,
                    commodity_id: this.data.commodity._id,
                    msg: this.data.msg,
                  },
                })
                .then(res => {
                  wx.showToast({
                    title: '评价成功！',
                  })
                })
            }
          }).catch(error => {
            console.log(error)
          })
      })
    } else {
      wx.cloud.callFunction({
          name: 'addEvaluate',
          data: {
            fileID: '',
            commodity_id: this.data.commodity._id,
            msg: this.data.msg,
          },
        })
        .then(res => {
          wx.showToast({
            title: '评价成功！',
          })
        })
    }
    wx.cloud.callFunction({
      name: 'updataOrder',
      data: {
        _id: this.data.order_id
      },
      success: function(res) {
        wx: wx.navigateBack({
          delta: 1,
        })
      },
      fail: function(res) {
        console.log(res)
      }
    })

  },
  select() {
    const that = this;
    let path = this.data.path;
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        path = path.concat(res.tempFilePaths);
        if (path.length > 3) {
          path = path.slice(-3);
        }
        that.setData({
          path
        })
      }
    })
  }
})