const util = require('../../utils/util.js')
const api = require('../../config/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: api.ImgUrl,
    maskShow: false,
    birthday: '',
    sexList: ['男', '女'],
    sexIndex: 0,
    checked: {
      name: '我已阅读并接受benefit《隐私政策》',
      value: false
    },
    name: wx.getStorageSync('defaultName'),
    phone: wx.getStorageSync('defaultPhone')
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  bindDateChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  bindSexChange(e) {
    this.setData({
      sexIndex: e.detail.value
    })
  },
  read(e) {
    this.setData({
      maskShow: true
    })
  },
  inputPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  inputName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  //报错 
  showModal(error) {
    wx.showToast({
      title: error.msg,
      icon: 'none'
    })
  },
  submit() {
    let params = {
      userId: wx.getStorageSync('userId'),
      name: this.data.name,
      mobile: this.data.phone,
      birthday: this.data.birthday,
      gender: this.data.sexIndex == 0 ? 1 : 2
    }
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.SaveInfo, params, 'post').then(res => {
      wx.hideLoading()
      if (res.ret_code == 0) {
        wx.showModal({
          content: '提交成功',
          showCancel: false,
          confirmColor: '#fe697f',
          success(res) {
            if (res.confirm) {
              wx.switchTab({ url: '/pages/myOrdered/myOrdered' })
            }
          }
        })
      } else {
        wx.showToast({ title: res.err_msg, icon: 'none' })
      }
    }).catch(err => {
      wx.showToast({ title: 'err', icon: 'none' })
      wx.hideLoading()
    })
  },
  close() {
    this.setData({
      maskShow: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '现在就去型眉定制！',
      path: 'pages/index/index',
      imageUrl: '/static/images/share.jpg'
    }
  }
})