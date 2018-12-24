import WxValidate from '../../utils/WxValidate.js'
const util = require('../../utils/util.js')
const api = require('../../config/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: api.ImgUrl,
    maskShow: false,
    date: '',
    sexList: ['男', '女'],
    sexIndex: 0,
    checked: {
      name: '我已阅读并接受benefit《隐私政策》',
      value: false
    },
    phone: '',
    code: '',
    perfectName: '',
    perfectPhone: ''
  },
  bindDateChange (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindSexChange (e) {
    this.setData({
      sexIndex: e.detail.value
    })
  },
  read(e) {
    wx.navigateTo({
      url: '/pages/privacy/privacy',
    })
  },
  inputPhone (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  inputCode () {
    this.setData({
      code: e.detail.value
    })
  },
  sendCode () {
    let params = {
      mobile: this.data.phone,
      channel: 'cn'
    }
    if (!this.data.phone) {
      this.showModal({msg: '请输入手机号码！'})
      return false
    }
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.SendCode, params,'post').then(res=>{
      wx.hideLoading()
      if(res.ret_code == 0) {
        this.showModal({ msg: '验证码发送成功！' })
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
  //验证函数
  initValidate() {
    const rules = {
      phone: {required: true,tel: true},
      code: {required: true,minlength: 6}
    }
    const messages = {
      phone: {required: '请填写手机号',tel: '请填写正确的手机号'},
      code: {required: '请填写验证码', minlength: '请输入6位验证码'},
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  formSubmit (e) {
    let form = e.detail.value,
        params = {
          mobile: form.phone,
          code: form.code
        }
    //校验表单
    if (!this.WxValidate.checkForm(form)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.CheckCode,params,'post').then(res=>{
      wx.hideLoading()
      if(res.ret_code == 0) {
        this.showModal({ msg: '注册成功'})
        this.setData({
          maskShow: true
        })
      }
    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
    })
  },
  perfectFormSubmit (e) {
    let params = {
        openid: wx.getStorageSync('userId'),
        name: this.data.perfectName,
        mobile: this.data.perfectPhone,
        birthday: this.data.date,
        gender: this.data.sexIndex == 0?1:2
    }
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.SaveInfo, params,'post').then(res=>{
      wx.hideLoading()
      if(res.ret_code == 0) {
        this.showModal({ msg: '提交成功'})
      }
    }).catch(err => { 
      console.log(err) 
      wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate()
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

  }
})