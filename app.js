const user = require('./services/user.js')
var gio = require("utils/gio-minp.js").default;
gio('init', '贝玲妃眉吧预约MP', 'wx5bf27c8f3a73c9b2', { version: '1.0' });

App({
  onLaunch: function () {
    console.log('onlaunch');
  },
  onShow: function(opt) {
    console.log(opt.scene)
  },

  // globalData: {
  //   emptyInfo: {
  //     nickName: 'Hi,游客',
  //     userName: '点击去登录',
  //     avatarUrl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
  //   },
  //   userInfo: {
  //     nickName: 'Hi,游客',
  //     userName: '点击去登录',
  //     avatarUrl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
  //   },
  //   token: '',
  // }

})