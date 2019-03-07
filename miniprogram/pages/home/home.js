Page({
  data: {
    productList: [] // 商品列表
  },
  onLoad: function(options) {
    const that = this;
    //获取默认环境的数据库的引用
    const db = wx.cloud.database();
    //获取一个集合的数据
    wx.showLoading({
      title: '商品加载中'
    })
    db.collection('commodity').get({
      success(res) {
        wx.hideLoading();
        that.setData({
          productList: res.data
        })
      }
    })
  },
  commodityClick(event) {
    wx.navigateTo({
      url: `/pages/product/product?id=${event.currentTarget.dataset.commodity._id}`
    });
  },
  addTrolley(event) {
    const com = event.currentTarget.dataset.commodity;
    console.log(com)
    wx.cloud.callFunction({
        name: 'addTrolley',
        data: com,
      })
      .then(res => {
        wx.showToast({
          title: '添加购物车成功！',
        })
      })
      .catch(console.error)
  }
})