Page({
  data: {
    product: {},
    comment: []
  },
  onLoad: function(options) {
    const that = this;
    const db = wx.cloud.database();
    wx.showLoading({
      title: '商品加载中',
    })
    db.collection('commodity').doc(options.id).get({
      success(res) {
        wx.hideLoading();
        that.setData({
          product: res.data
        })
      }
    })
    db.collection('evaluate').where({
        commodity_id: options.id
      }).get()
      .then(res => {
        this.setData({
          comment: res.data
        })
      })
  },
  buy() {
    const product = this.data.product;
    wx.cloud.callFunction({
        name: 'buy',
        data: {
          commodity: [product]
        },
      })
      .then(res => {
        wx.showToast({
          title: '购买成功！',
        })
      })
      .catch(console.error)
  },
  addTrolley() {
    const com = this.data.product;
    wx.cloud.callFunction({
        name: 'addTrolley',
        data: com
      })
      .then(res => {
        wx.showToast({
          title: '添加购物车成功！',
        })
      })
      .catch(console.error)
  },
  comment() {
    wx: wx.navigateTo({
      url: '/pages/comment/comment?_id=' + this.data.product._id,
    })
  }
})