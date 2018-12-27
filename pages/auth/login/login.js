var api = require('../../../config/api.js');
const user = require('../../../services/user.js');
const util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    isShow: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    let self = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          //从数据库获取用户信息
          wx.showLoading({title: '加载中',mask: true})
          user.loginByWeixin().then(res=>{
            wx.hideLoading()
            console.log('已经授权过', res)
            //用户已经授权过
            wx.switchTab({
              url: '/pages/index/index'
            }) 
          })
        }else{
          self.setData({
            isShow: true
          })
        }
      }
    });
  },
  getUserInfo: function (res) {
    wx.getUserInfo({
      withCredentials: false,
      success: res => {
        wx.showLoading({title: '加载中',mask: true})
        user.loginByWeixin().then(data => {
          wx.hideLoading()
          console.log('data++++++', data)
          wx.switchTab({
            url: '/pages/index/index'
          })
        }).catch(err => {
          wx.hideLoading()
          wx.showToast({ title: '登录 catch', icon: 'none' })
        })
      },
      complete: function (data) {
      }
    })

  },
  formSubmit: function (e) {
    console.log(e.detail.formId);
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