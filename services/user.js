/**
 * 用户相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');


/**
 * 调用微信登录
 */
function loginByWeixin() {
  let code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      code = res.code;
      return util.getUserInfo();
    }).then((userInfo) => {
      //登录远程服务器
      util.request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo,sendMemberId: wx.getStorageSync('sendMemberId')}, 'POST').then(res => {
          console.log("api.AuthLoginByWeixin:",res)
        if (res.ret_code == 0) {
              console.log("user.js loginByWeiXin:",res.data)
              //存储用户信息
              wx.setStorageSync('userInfo', res.data.userInfo);
              wx.setStorageSync('token', res.data.token);
              wx.setStorageSync('userId', res.data.userId);
              var timestamp = Date.parse(new Date());
              var expiration = timestamp + 11 * 60 * 60 * 1000;
              wx.setStorageSync('token_expiration', expiration);
              // console.log("api.AuthLoginByWeixin:success,save data success")
              resolve(res);
          } else {
              if(res.code == 105){
                  //用户不存在，需要注册，保存openid
                  wx.setStorageSync('openId', res.data.openid);
              }
              reject(res);
          }
      }).catch((err) => {
          console.log('请求后台login出错了')
          reject(err);

      });
    }).catch((err) => {
      console.log('wx.lgoin 出错了')
      reject(err);
    })
  })
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    var timestamp =Date.parse(new Date());
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token') && (wx.getStorageSync('token_expiration') > timestamp)) {
      util.checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        console.log('出错了')
        resolve(false);
      });
    } else {
      resolve(false);
    }
  });
}
//判断是否授权
function isUserInfo(url) {
  wx.getSetting({
    success: res => {
      if (!res.authSetting['scope.userInfo']) {
        wx.reLaunch({
          url: '/pages/member/login/login?path=' + url　 // 授权界面
        })
      }
      else {
        checkLogin().then(res => {
          console.log("检测登录结果：", res);
          if (!res) {
            wx.reLaunch({
              url: '/pages/member/login/login?path=' + url　 // 授权界面
            })
          }
        })
      }
    }
  });
}


module.exports = {
  loginByWeixin,
  checkLogin,
  isUserInfo
};











