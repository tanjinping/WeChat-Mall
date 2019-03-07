Page({
  data: {
    commodity: {}, //商品详情
    comment: [] //评价详情
  },
  onLoad: function(options) {
    const that = this;
    const db = wx.cloud.database();
    let files = []; //评价图片列表
    let comment; //临时评价列表
    let k, j;
    wx.showLoading({
      title: '评价加载中'
    })
    db.collection('commodity').doc(options._id).get().then(res => {
      this.setData({
        commodity: res.data
      })
    })
    db.collection('evaluate').where({
        commodity_id: options._id
      }).get()
      .then(res => {
        comment = res.data;
        for (k = 0; k < comment.length; k++) {
          if (comment[k].fileID.length) {
            //评价图片
            (function(k) {
              wx.cloud.getTempFileURL({
                  fileList: comment[k].fileID
                })
                .then((res) => {
                  wx.hideLoading();
                  comment[k].fileID = res.fileList;
                  if (comment.length - 1 === k) {
                    that.setData({
                      comment,
                    })
                  }
                })
            })(k);
          } else {
            wx.hideLoading();
            that.setData({
              comment,
            })
          }
        }
      })
    wx.getUserInfo({
      success: function(res) {
        that.setData({
          userInfo: res.userInfo,
        })
      }
    })
  }
})