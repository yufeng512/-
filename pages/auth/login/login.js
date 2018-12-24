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
        if (getCurrentPages().length > 2) {
          //获取页面栈
          let pages = getCurrentPages()
          //给上一个页面设置状态
          let curPage = pages[pages.length - 2];
          let data = curPage.data;
          curPage.setData({ 'isBack': true });
        }else{
        wx.switchTab({
                url: '/pages/index/index',
                success: function (res) { console.log("nav", res) },
                fail: function (res) { },
                complete: function (res) { },
              })
        }
        var that = this;
        console.log(String(decodeURIComponent(that.data.path)))

        wx.switchTab({
          url: decodeURIComponent(this.data.path),
          success: function (res) { console.log("nav", res) },
          fail: function (res) {
            console.log(res)
          },
          complete: function (res) { },
        })
      },
      complete: function (data) {
        // 执行登陆
        user.loginByWeixin().then(res => {
          console.log(res.data)
          app.globalData.helpo = res.data.helpo;
          app.globalData.userInfo = res.data.userInfo;
          app.globalData.token = res.data.token;
        }
        ).catch((err) => {
          console.log(err)
        });

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