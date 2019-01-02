var api = require('../config/api.js');

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//获取页面路径及参数
function getRoute(page) {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1]
  const url = currentPage.route
  const options = currentPage.options
  let urlWithArgs = `/${url}?`
  for (let key in options) {
    const value = options[key]
    urlWithArgs += `${key}=${value}&`
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1).split("?");
  var routeObj = {};
  routeObj.$url_path = urlWithArgs[0].substring(1, urlWithArgs[0].length);
  if (urlWithArgs[1]) {
    routeObj.$url_query = urlWithArgs[1]
  }
  return routeObj
}
/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET",header , callback) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': header ? header:'application/json',
        'X-Nideshop-Token': wx.getStorageSync('token'),
        'LOGIN_USER_KEY': wx.getStorageSync('userId')
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 401) {
            //需要登录后才可以操作
            let code = null;
            return login().then((res) => {
              code = res.code;
              return getUserInfo();
            }).then((userInfo) => {
              //登录远程服务器
              request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'POST').then(res => {
                if (res.errno === 0) {

                  //存储用户信息
                  console.log("-------------");
                  console.log(res.data);
                  wx.setStorageSync('userInfo', res.data.userInfo);
                  wx.setStorageSync('token', res.data.token);
                  wx.setStorageSync('userId', res.data.userId);
                  request(url, data, method, callback).then(function (res0) {
                    resolve(res0);
                  });

                } else {
                  reject(res);
                }
              }).catch((err) => {
                reject(err);
              });
            }).catch((err) => {
              reject(err);
            })
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function (err) {
        reject(err)
      },
      complete: () => {
        callback && callback()
      }
    })
  });
}

/**
 * 同步请求数据
 */
function requestSync(url, data = {}, method = "GET", callback) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      async: false,
      header: {
        'Content-Type': 'application/json',
        'X-Nideshop-Token': wx.getStorageSync('token'),
        'LOGIN_USER_KEY': wx.getStorageSync('userId')
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 401) {
            //需要登录后才可以操作

            let code = null;
            return login().then((res) => {
              code = res.code;
              return getUserInfo();
            }).then((userInfo) => {
              //登录远程服务器
              request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'POST').then(res => {
                if (res.errno === 0) {
                  //存储用户信息
                  console.log("-------------");
                  console.log(res.data);
                  wx.setStorageSync('userInfo', res.data.userInfo);
                  wx.setStorageSync('token', res.data.token);
                  wx.setStorageSync('userId', res.data.userId);
                  resolve(res);
                } else {
                  reject(res);
                }
              }).catch((err) => {
                reject(err);
              });
            }).catch((err) => {
              reject(err);
            })
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function (err) {
        reject(err)
      },
      complete: () => {
        callback && callback()
      }
    })
  });
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}

/**
 * 调用微信登录
 */
function login() {
  var that = this;
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          //登录远程服务器
          console.log(res)
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

function redirect(url) {
  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}
function showErrorToast(msg, iconUrl) {
  let params = {
    title: msg
  }

  if (iconUrl !== 'withoutIcon') {
    params.image = iconUrl || '/static/images/icon_error.png'
  }

  wx.showToast(params)
}
function showYslLoading(that) {
  that.setData({
    loading: true
  })
}
function hideYslLoading() {
  wx.setStorageSync("loading", false);
  this.setData({
    loading: false
  })
}
const countdown = (that, item, index) => {
  if (item.limitTime !== undefined) {
    let countDownDay = item.limitTime.countDownDay;
    let countDownHour = item.limitTime.countDownHour;
    let countDownMinute = item.limitTime.countDownMinute;
    let countDownSecond = item.limitTime.countDownSecond; let totalSecond = countDownDay * 24 * 60 * 60 + countDownHour * 60 * 60 + countDownMinute * 60 + parseInt(countDownSecond);
    let interval = setInterval(function () {
      // 秒数  
      let second = totalSecond;
      // 天数位  
      // let day = Math.floor(second / 3600 / 24);
      // let dayStr = day.toString();
      // if (dayStr.length == 1) dayStr = '0' + dayStr;
      let day = 0;
      let dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;
      // 小时位  
      let hr = Math.floor((second - day * 3600 * 24) / 3600);
      let hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位  
      let min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      let minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位  
      let sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      let secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      let limitTimeChange = "info.productInfo[" + index + "].limitTime";
      let style = "info.productInfo[" + index + "].style";
      // console.log(secStr)
      that.setData({
        [limitTimeChange]: {
          countDownDay: dayStr,
          countDownHour: hrStr,
          countDownMinute: minStr,
          countDownSecond: secStr,
        }
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        wx.showToast({
          title: '活动已结束',
        });
        that.setData({
          [limitTimeChange]: {
            countDownDay: '00',
            countDownHour: '00',
            countDownMinute: '00',
            countDownSecond: '00',
          }
        });
        that.setData({
          [style]: 'grey'
        });
      }
    }.bind(that), 1000);
  }
}

const refresh = () => {
  wx.stopPullDownRefresh()
  wx.showToast({
    title: '更新成功',
    icon: 'success',
    duration: 1000
  })
}
//向服务请求支付参数
const pay = (orderId) => {
  return new Promise(function (resolve, reject) {
    request(api.PayPrepayId, { orderId: orderId }, 'POST').then(function (res) {
      if (res.errno === 0) {
        let payParam = res.data;
        let result = new Object();
        result.orderId = orderId;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            console.log(res)
            wx.showToast({
              title: '支付成功',
            })
            // console.log(res);
            // wx.redirectTo({
            //   url: '/pages/ucenter/orderDetail/orderDetail?id=' + orderId,
            // })
            result.code = true;
            resolve(result);
          },
          'fail': function (res) {
            console.log(res)
            wx.showToast({
              title: '支付失败',
            })
            result.code = false;
            resolve(result);
            // wx.redirectTo({
            //   url: '/pages/ucenter/orderDetail/orderDetail?id=' + orderId,
            // })
          }
        })
      }
    })
  })
}

let getQueryString = function (url, name) {
  console.log("url = " + url)
  console.log("name = " + name)
  var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
  var r = url.substr(1).match(reg)
  if (r != null) {
    console.log("r = " + r)
    console.log("r[2] = " + r[2])
    return r[2]
  }
  return null;
}
module.exports = {
  getQueryString: getQueryString,
}

module.exports = {
  formatTime,
  request,
  requestSync,
  redirect,
  showErrorToast,
  checkSession,
  login,
  getUserInfo,
  countdown,
  pay,
  getQueryString: getQueryString,
  refresh,
  getRoute
}


