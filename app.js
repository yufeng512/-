const user = require('./services/user.js')

App({
  onLaunch: function () {
    console.log('onlaunch');
    //获取用户的登录信息
    
    user.checkLogin().then(res => {
      if (res) {
        console.log('app login--------------', res)
        this.globalData.userInfo = wx.getStorageSync('userInfo');
        this.globalData.token = wx.getStorageSync('token');
        this.globalData.userId = wx.getStorageSync('userId');
        this.globalData.memberType = wx.getStorageSync('memberType');
      } else {
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              user.loginByWeixin().then(res => { //已经授权执行登陆
                console.log('app logining--------------', res)
              }).catch((err) => {
                console.log(err)
              });
            } else {
              var pages = getCurrentPages() //获取加载的页面
              var currentPage = pages[pages.length - 1] //获取当前页面的对象
              var url = currentPage.route //当前页面url
              wx.redirectTo({ //没有授权
                url: '/pages/auth/login/login?path=/' + url　　// 授权界面
              })
            }
          }
        });
      }
    }).catch((err) => {
      console.log('--------------' + err)
    })
  },
  onShow: function(opt) {
    console.log(opt.scene)
  },

  globalData: {
    emptyInfo: {
      nickName: 'Hi,游客',
      userName: '点击去登录',
      avatarUrl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
    userInfo: {
      nickName: 'Hi,游客',
      userName: '点击去登录',
      avatarUrl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
    token: '',
  }

})