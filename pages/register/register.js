const util = require('../../utils/util.js')
const api = require('../../config/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: api.ImgUrl,
    phone: '',
    code: ''
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  inputPhone (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  inputCode (e) {
    this.setData({
      code: e.detail.value
    })
  },
  sendCode () {
    if (!this.data.phone) {
      this.showModal({msg: '请输入手机号码！'})
      return false
    }
    let params = {
      mobile: this.data.phone
    }
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.SendCode, params,'post').then(res=>{
      wx.hideLoading()
      if(res.ret_code == 0) {
        this.showModal({ msg: '验证码发送成功！' })
      } else {
        wx.showToast({ title: res.err_msg, icon: 'none' })
      }
    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
    })
  },
  //报错 
  showModal(error) {
    wx.showToast({
      title: error.msg,
      icon: 'none'
    })
  },
  formSubmit () {
    console.log(this.data)
    if (this.data.phone=='') {
      this.showModal({ msg: '请输入手机号码！' })
      return false
    } else if (this.data.code==''){
      this.showModal({ msg: '请输入验证码！' })
      return false
    }
    let params = {
      mobile: this.data.phone,
      code: this.data.code
    }
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.CheckCode,params,'post').then(res=>{
      wx.hideLoading()
      if (res.data == '0') {
        this.showModal({ msg: '注册成功'})
        wx.navigateTo({
          url: '/pages/infoChange/infoChange',
        })
      } else {
        wx.showToast({ title: '验证码错误', icon: 'none' })
      }
    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
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