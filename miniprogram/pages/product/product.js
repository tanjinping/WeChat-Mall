Page({
  data: {
    product: {}
  },
  onLoad: function (options) {
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
  },
  buy(){
    const product = this.data.product;
    wx.cloud.callFunction({
      name: 'buy',
      data: {
        commodity:[{
          "count":1,
          "image":product.image,
          "name":product.name,
          "price":product.price
          }
        ]
      },
    })
      .then(res => {
        console.log(res) // 3
      })
      .catch(console.error)
  }
})