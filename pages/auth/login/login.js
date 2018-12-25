var api = require('../../../config/api.js');
const user = require('../../../services/user.js');
const util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    path: '',
    username: '',
    password: '',
    code: '',
    loginErrorCount: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    console.log(decodeURIComponent(options.path))
    this.setData({
      path: options.path,
    });
  },
  getUserInfo: function (res) {
    wx.getUserInfo({
      withCredentials: false,
      success: res => {
        console.log("getAutho", res)
        console.log("this.data.path:" + this.data.path)
        wx.switchTab({
          url: '/pages/index/index',
          success: function (res) { console.log("nav", res) },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      complete: function (data) {
        //执行登陆
      }
    })

  },
  formSubmit: function (e) {
    console.log(e.detail.formId);
    // util.request(api.RegisterForm, e.detail.formId, "POST");
    console.log(e.detail.formId + " formid get");
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})