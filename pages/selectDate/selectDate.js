const util = require('../../utils/util.js')
const api = require('../../config/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: api.ImgUrl,
    serviceCode: '',
    counterCode: '',
    staffCode: '',
    timeList: [], //预约时间列表
    weekList: ['一', '二', '三', '四', '五', '六', '日'],
    date: '',
    date: '',
    day: '',
    timeFrom: '',
    timeTo: '',
    dayList: [], //预约日期列表
    initDaylist: [], //选中月份多少天
    currentIndex: null, //当前选中的时间
    currentDay: null, //当前选中的天
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let  val = options.date
    this.setData({
      date: val,
      serviceCode: options.serviceCode,
      counterCode: options.counterCode,
      staffCode: options.staffCode
    })
    this.selectDate(val)
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  submit(e) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    let date = this.data.date + ' ' + this.data.timeFrom + '-' + this.data.timeTo
    prevPage.setData({
      date: date,
      timeFrom: this.data.timeFrom,
      timeTo: this.data.timeTo,
      day: this.data.day
    })
    if (this.data.day == '' || this.data.currentIndex == null) {
      this.showModal({ msg: '请选择预约日期或时间！' })
    } else {
      wx.navigateBack({
        url: '/pages/orederInfo/orederInfo?date=' + date,
      })
    }
  },
  bindMaskDateChange(e) {
    let val = e.detail.value
    this.setData({
      date: val
    })
    this.selectDate(val)
  },
  //选择日期
  selectDate(e) {
    let now = new Date(),
        dayList = [],
        val = e.split('-');
    if (Number(val[0]) == now.getFullYear()) {
      if (Number(val[1]) > (now.getMonth() + 1)) {
        dayList = this.getDates(1, e).slice(0, 7)
      } else if (Number(val[1]) == (now.getMonth() + 1)) {
        dayList = this.getDates(0, e).slice(0, 7)
      } else {
        wx.showToast({
          title: '请选择当前往后的时间！',
          icon: 'none',
          duration: 2000
        })
        return false
      }
    } else if (Number(val[0]) > now.getFullYear()) {
      dayList = this.getDates(1, e).slice(0, 7)
    } else {
      wx.showToast({
        title: '请选择当前往后的时间！',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    this.getStaffListTime(dayList)
  },
  //选择日
  selectDay(e) {
    let item = e.currentTarget.dataset.item
    if (!item.available) {
      wx.showToast({ title: '今日不可约！', icon: 'none' })
      return false
    }
    let val = this.data.date.split('-')
    let params = {
      day: val[0] + val[1] + item.day,
      counterCode: this.data.counterCode,
      serviceCode: this.data.serviceCode,
      staffCode: this.data.staffCode,
    }
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.OrderStaffList, params, 'get').then(res => {
      wx.hideLoading()
      if (res.ret_code == 0) {
        this.setData({
          day: val[0] + val[1] + item.day,
          date: val[0] + '-' + val[1] + '-' + item.day,
          timeList: res.data.list,
          currentIndex: null
        })
      } else {
        wx.showToast({ title: res.err_msg, icon: 'none' })
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  //选择时间
  selectTime(e) {
    let index = e.currentTarget.dataset.index,
      item = e.currentTarget.dataset.item
    this.setData({
      currentIndex: index,
      timeFrom: item.timeFrom,
      timeTo: item.timeTo
    })
  },
  preWeek() {//上一周
    let list = this.data.initDaylist,
      firstDay = this.data.dayList[0].day,
      now = new Date().getDate(),
      currentList = [],
      n;
    if (firstDay == list[0].day) {
      wx.showToast({ title: '当前是第一周!', icon: 'none' })
      return false
    }
    list.forEach((item, i) => {
      if (item.day == firstDay) { n = i }
    })
    currentList = list.slice(n - 7, n)
    this.getStaffListTime(currentList)
  },
  nextWeek() {//下一周
    if (this.data.dayList[0].day >= 25) {
      wx.showToast({ title: '当前是最后一周!', icon: 'none' })
      return false
    }
    let list = this.data.initDaylist,
      lastDay = this.data.dayList[6].day,
      currentList = [],
      n;
    list.forEach((item, i) => {
      if (item.day == lastDay) { n = i }
    })
    currentList = list.slice(n + 1, n + 8)
    console.log(currentList)
    for (var i = currentList.length; i < 7; i++) {
      currentList.push({ day: '-', available: false })
    }
    this.getStaffListTime(currentList)
  },
  getDates(val, e) {//获取当月天数列表
    let selectDate = e.split('-'),
      curDate = new Date(),
      curDay = curDate.getDate(),
      n = new Date(selectDate[0], selectDate[1], 0).getDate(),
      curMonth = curDate.getMonth(),
      dayList = [];
    console.log(n, curDay)
    if (val == 0) {
      for (var i = curDay; i <= n; i++) {
        if (i < 10) { i = '0' + i }
        dayList.push({ day: i, available: false })
      }
      if (dayList.length < 7) {
        for (var j = 0; j <= (7 - dayList.length); i++) {
          dayList.push({ day: '-', available: false })
        }
      }
    } else {
      for (var i = 1; i <= n; i++) {
        if (i < 10) { i = '0' + i }
        dayList.push({ day: i, available: false })
      }
    }
    this.setData({ initDaylist: dayList })
    return dayList
  },
  getStaffListTime(daylist) {
    let val = this.data.date.split('-'),
      list = daylist.filter(item => item.day != '-')
      console.log(list)
    let params = {
      startDay: val[0] + val[1] + list[0].day,
      endDay: val[0] + val[1] + list[list.length - 1].day,
      counterCode: this.data.counterCode,
      serviceCode: this.data.serviceCode,
      staffCode: this.data.staffCode,
    }
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.IsServiceTImeList, params, 'get').then(res => {
      if (res.ret_code == 0) {
        daylist.forEach(item => {
          res.data.list.forEach(_item => {
            if (item.day == Number(_item.day.substring(6, 8))) {
              item.available = true
            }
          })
        })
        this.setData({
          dayList: daylist,
          timeList: []
        })
      } else {
        wx.showToast({ title: res.err_msg, icon: 'none' })
      }
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
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