Page({
  data: {
    userInfo: {
      nickName: "",
      avatarUrl: ""
    },
    isLogin: true,
    trolleyList: [], // 购物车商品列表
    trolleyCheckMap: [], // 购物车中选中的id哈希表
    trolleyAccount: 0, // 购物车结算总价
    isTrolleyEdit: false, // 购物车是否处于编辑状态
    isTrolleyTotalCheck: false, // 购物车中商品是否全选
  },
  onLoad: function(options) {

  },
  onShow() {
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
                that.getTrolley();
              }
            })
          }
        }
      })
    } else {
      this.getTrolley();
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
          that.getTrolley();
        }
      })
    }
  },
  select(evevt) {
    let newTrolleyCheckMap = [];
    let isnum = true; //单独选项跳转到全选
    let price = 0;
    const num = evevt.currentTarget.dataset.num;
    let trolleyCheckMap = this.data.trolleyCheckMap;
    if (num == -1) { //全选按钮
      if (this.data.isTrolleyTotalCheck) {
        price = 0;
        this.data.trolleyCheckMap.map(() => {
          newTrolleyCheckMap.push(
            false
          )
        })
      } else {
        for (let i = 0; i < this.data.trolleyCheckMap.length; i++) {
          price = price + this.data.trolleyList[i].price * this.data.trolleyList[i].count;
          newTrolleyCheckMap.push(
            true
          )
        }
      }
      this.setData({
        trolleyAccount: price,
        trolleyCheckMap: newTrolleyCheckMap,
        isTrolleyTotalCheck: !this.data.isTrolleyTotalCheck
      })
    } else { //单独选项
      price = this.data.trolleyAccount;
      if (this.data.trolleyCheckMap[num]) {
        price -= this.data.trolleyList[num].price * this.data.trolleyList[num].count
        trolleyCheckMap[num] = !this.data.trolleyCheckMap[num];
        this.setData({
          trolleyAccount: price,
          isTrolleyTotalCheck: false,
          trolleyCheckMap: trolleyCheckMap,
        })
      } else { //调试分割线
        price = this.data.trolleyAccount;
        price += this.data.trolleyList[num].price * this.data.trolleyList[num].count
        trolleyCheckMap[num] = !this.data.trolleyCheckMap[num];
        this.setData({
          trolleyAccount: price,
          trolleyCheckMap: trolleyCheckMap,
        })
        this.data.trolleyCheckMap.map((number) => {
          if (!number) {
            isnum = false
          }
        })
        if (isnum) {
          this.setData({
            isTrolleyTotalCheck: true
          })
        }
      }
    }
  },
  getTrolley: function() {
    const that = this;
    let trolleyCheckMap = [];
    wx.cloud.callFunction({
      name: 'trolley',
      success: function(res) {
        res.result.data.map(() => {
          trolleyCheckMap.push(
            false
          )
        })
        that.setData({
          trolleyList: res.result.data,
          trolleyCheckMap,
        })
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  number(event) {
    const that = this;
    let price = this.data.trolleyAccount;
    let number = event.currentTarget.dataset.number;
    let index = event.currentTarget.dataset.index;
    let trolleyList = this.data.trolleyList;
    trolleyList[index].count += parseInt(number);
    if (this.data.trolleyCheckMap[index]) {
      price += (trolleyList[index].price * parseInt(number))
    }
    if (!trolleyList[index].count) {
      wx.cloud.callFunction({
        name: 'removeTrolley',
        data: {
          _id: trolleyList[index]._id
        },
        success: function(res) {
          that.getTrolley();
        },
        fail: function(res) {
          console.log(res)
        }
      })
    }
    this.setData({
      trolleyList,
      trolleyAccount: price,
    })

    wx.cloud.callFunction({
      name: 'updateTrolley',
      data: {
        _id: trolleyList[index]._id,
        count: trolleyList[index].count
      },
      success: function(res) {
      },
      fail: function(res) {
        console.log(res)
      }
    })


  },
  edit() {
    this.setData({
      isTrolleyEdit: !this.data.isTrolleyEdit,
    })
  },
  buy() {
    const that = this;
    let trolleyList = this.data.trolleyList;
    let newTrolley = []; //结算并且需要删除的商品记录
    let trolleyCheckMap = this.data.trolleyCheckMap;
    for (let k = 0; k < trolleyList.length; k++) {
      if (trolleyCheckMap[k]) {
        newTrolley.push(trolleyList[k])
      }
    }
    const product = this.data.product;
    wx.cloud.callFunction({
        name: 'buy',
        data: {
          commodity: newTrolley
        },
      })
      .then(res => {
        wx.showToast({
          title: '购买成功！',
        })
        newTrolley.map((commodity) => {
          wx.cloud.callFunction({
            name: 'removeTrolley',
            data: {
              _id: commodity._id
            },
            success: function(res) {
              that.getTrolley();
            },
            fail: function(res) {
              console.log(res)
            }
          })
        })
      })
      .catch(console.error)
  }
})