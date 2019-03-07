Page({
  data: {
    address: [],
    newAddress: {},
    isNew: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAddress();
  },
  getAddress: function() {
    const that = this;
    wx.cloud.callFunction({
        name: 'address',
      })
      .then(res => {
        that.setData({
          address: res.result.data
        })
      })
  },
  add() {
    this.setData({
      isNew: true
    })

  },
  _addmsg() {
    let newAddress = this.data.newAddress;
    const that = this;
    wx.chooseLocation({
      success(res) {
        newAddress.address = res.address + res.name;
        that.setData({
          newAddress,
        })
      }
    })
  },
  bindNumberInput(e) {
    let newAddress = this.data.newAddress;
    newAddress.number = e.detail.value;
    this.setData({
      newAddress,
    })
  },
  bindNameInput(e) {
    let newAddress = this.data.newAddress;
    newAddress.name = e.detail.value;
    this.setData({
      newAddress,
    })
  },
  determine() {
    //添加评价
    wx.cloud.callFunction({
        name: 'addaddress',
        data: this.data.newAddress,
      })
      .then(res => {
        this.getAddress();
        wx.showToast({
          title: '添加成功！',
        })
      })
    this.setData({
      isNew: false
    })
  },
  cancel() {
    let newAddress = {};
    this.setData({
      isNew: false,
      newAddress,
    })
  }
})