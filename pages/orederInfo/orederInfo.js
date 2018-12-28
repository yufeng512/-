const util = require('../../utils/util.js')
const api = require('../../config/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: api.ImgUrl,
    serverList: [],
    severIndex: null,
    channelList: [],
    channelIndex: null,
    storeList: [],
    storeIndex: null,
    staffList: [],
    staffIndex: null,
    timeList: [], //预约时间列表
    weekList: ['一', '二', '三', '四', '五', '六', '日'],
    dayList: [], //预约日期列表
    initDaylist:[], //选中月份多少天
    currentIndex: null, //当前选中的时间
    currentDay: null, //当前选中的天
    name: '',
    phone: '',
    region: '',
    date: '',
    day: '',
    timeFrom:'',
    timeTo:'',
    maskShow: false,
    smsCode: '',
    showCode: false,
    showCodeBtn: true,
    bookId: '',
    latitude: 0,
    longitude: 0,
  },
  goIndex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  getServiceList(serviceCode) {
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.ServiceList, {}, 'get').then(res => {
      wx.hideLoading()
      if (res.ret_code == 0) {
        let list = res.data.list
        list.forEach((item, i) => {
          if (item.serviceCode == serviceCode) {
            this.setData({
              severIndex: i,
              serverList: res.data.list
            })
          }
        })
      }
    }).catch(err => { 
      console.log(err) 
      wx.hideLoading()
    })
  },
  getChannelList(channelCode) {
    util.request(api.ChannelList, {}, 'get').then(res=>{
      if(res.ret_code==0){
        if (channelCode){
          res.data.list.forEach((item,i)=>{
            if (item.channelCode == channelCode){
              this.setData({
                channelIndex: i,
                channelList: res.data.list
              })
            }
          })
        }else{
          this.setData({
            channelList: res.data.list
          })
        }
      }
    })
  },
  getStoreList(counterCode, serviceCode,channelCode) {
    let index = this.data.severIndex,list = [];
    let params = {
      serviceCode: serviceCode ? serviceCode : this.data.serverList[index].serviceCode,
      city: this.data.region,
      counterChannel: channelCode ? channelCode : this.data.channelList[this.data.channelIndex].channelCode,
      longitude: this.data.longitude,
      latitude: this.data.latitude
    }
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.StoreList, params, 'get').then(res => {
      console.log(res)
      wx.hideLoading()
      if (res.ret_code == 0) {
        res.data.list.forEach(item=>{
          list.push({
            storeAddress: item.counterName + ' ' + item.distance +'KM',
            counterName: item.counterName,
            counterCode: item.counterCode
          })
        })
        if(counterCode) {
          res.data.list.forEach((item, i) => {
            if (item.counterCode == counterCode) {
              this.setData({
                storeIndex: i,
                storeList: list
              })
            }
          })
        }else{
          this.setData({ storeList: list })
        }
      }
    }).catch(err => { 
      console.log(err) 
      wx.hideLoading()
    })
  },
  getStaffList(staffCode, serviceCode, counterCode) {
    let params = {
      serviceCode: serviceCode ? serviceCode:this.data.serverList[this.data.severIndex].serviceCode,
      counterCode: counterCode ? counterCode:this.data.storeList[this.data.storeIndex].counterCode
    }
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.StaffList, params, 'get').then(res => {
      console.log(res)
      wx.hideLoading()
      if (res.ret_code == 0) {
        if (staffCode) {
          res.data.list.forEach((item, i) => {
            if (item.staffCode == staffCode) {
              this.setData({
                staffIndex: i,
                staffList: res.data.list
              })
            }
          })
        } else {
          this.setData({ staffList: res.data.list })
        }
      }
    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
    })
  },
  getBookList (options) {
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.SearchBook + options.bookId,{},'get').then(res=>{
      console.log(res)
      wx.hideLoading()
      if(res.ret_code == 0){
        let serviceCode = res.data.serviceCode,
            counterCode = res.data.counterCode,
            channelCode = res.data.channelCode,
            staffCode = res.data.staffCode;
        this.setData({
          date: res.data.bookTime,
          region: res.data.city,
          name: res.data.name,
          phone: res.data.mobie,
          timeFrom: res.data.timeFrom,
          timeTo: res.data.timeTo
        })
        this.getServiceList(serviceCode)
        this.getChannelList(channelCode)
        this.getStoreList(counterCode, serviceCode, channelCode) 
        this.getStaffList(staffCode, serviceCode, counterCode) 
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  getLastAddress () {
    util.request(api.LastBook, {}, 'get').then(res=>{
      console.log(res)
      if (res.ret_code == 0) {
        this.setData({
          region: res.data.city
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.serviceCode) {
      this.getServiceList(options.serviceCode)
    }
    if (options.bookId){
      this.setData({
        bookId: options.bookId
      })
      this.getBookList(options)
    }
    this.getLocation()
    this.getLastAddress()
    this.getChannelList()
  },
  getLocation() {
    let self = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        self.setData({
          latitude: latitude,
          longitude: longitude
        })
      }
    })
  },
  bindServeChange (e) {
    if (this.data.severIndex != e.detail.value){
      this.setData({
        severIndex: e.detail.value,
        region: '',
        storeList: [],
        staffList: [],
        storeIndex: null,
        channelIndex: null,
        staffIndex: null,
        date: ''
      })
    }
  },
  bindRegionChange (e) {
    if (this.data.region != e.detail.value[1]){
      this.setData({
        region: e.detail.value[1],
        storeList: [],
        staffList: [],
        channelIndex: null,
        storeIndex: null,
        staffIndex: null,
        date: ''
      })
    }
  },
  bindChannelChange (e) {
    this.setData({
      channelIndex: e.detail.value,
      storeIndex: null,
      staffIndex: null,
      date: ''
    })
    this.getStoreList()
  },
  bindStoreChange (e) {
    console.log(e)
    this.setData({
      storeIndex: e.detail.value,
      staffIndex: null,
      date: ''
    })
    this.getStaffList()
  },
  bindStaffChange (e) {
    this.setData({
      staffIndex: e.detail.value,
      date: ''
    })
  },
  read (e) {
    console.log(e)
  },
  inputPhone (e) {
    this.setData({
      phone: e.detail.value
    })
    wx.setStorageSync('defaultPhone', e.detail.value)
  },
  inputName (e) {
    let val = e.detail.value, 
        isZH = /^[\u4e00-\u9fa5]+$/i.test(val),
        pattern3 = new RegExp("[0-9]+");
    if (pattern3.test(val)) {
      wx.showToast({ title: '姓名不能输入数字！', icon: 'none' })
      this.setData({ name: '' })
      return false
    }
    if (isZH) {
      if (val.length>10){
        wx.showToast({title: '中文名字不能超过10个字符',icon: 'none'})
        this.setData({name: ''})
        return false
      }else{
        this.setData({
          name: e.detail.value
        })
        wx.setStorageSync('defaultName', e.detail.value)
      }
    }else{
      if (val.length > 20) {
        wx.showToast({ title: '英文名字不能超过20个字符', icon: 'none' })
        this.setData({ name: '' })
        return false
      }else{
        this.setData({
          name: e.detail.value
        })
        wx.setStorageSync('defaultName', e.detail.value)
      }
    }
    
  },
  inputCode (e) {
    this.setData({
      smsCode: e.detail.value
    })
  },
  //手机验证
  checkPhone(val) {
    return /^1[34578]\d{9}$/.test(val)
  },
  sendCode() {
    let self = this
    console.log(self.checkPhone(self.data.phone))
    if (!self.data.phone || !self.checkPhone(self.data.phone)) {
      self.showModal({ msg: '请输入正确的手机号码！' })
      return false
    }
    let params = {
      mobile: self.data.phone
    }
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.SendCode, params, 'post').then(res => {
      wx.hideLoading()
      if (res.ret_code == 0) {
        wx.showModal({
          content: '验证码发送成功！',
          showCancel: false,
          confirmColor: '#eea0ae',
          success(res) {
            if (res.confirm) {
              self.setData({
                showCode: true
              })
            }
          }
        })  
      } else {
        wx.showToast({ title: res.err_msg, icon: 'none' })
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  codeSubmit() {
    console.log(this.data)
    if (this.data.smsCode == '') {
      this.showModal({ msg: '请输入验证码！' })
      return false
    }
    this.showModal({ msg: '验证码已保存' })
    this.setData({
      showCode: false,
      showCodeBtn: false
    })
  },
  bindDateChange(e) {
    if (this.data.storeIndex==null||this.data.staffIndex==null){
      wx.showToast({
        title: '请选择门店或修眉师！',
        icon: 'none'
      })
      return false
    }
    this.selectDate(e, 1)
  },
  bindMaskDateChange(e) {
    this.selectDate(e, 0)
  },
  //选择日期
  selectDate(e, i) {
    let now = new Date(), dayList=[]
    let val = e.detail.value.split('-')
    if (Number(val[0]) == now.getFullYear()) {
      if (Number(val[1]) > (now.getMonth() + 1)) {
        this.setData({date: e.detail.value})
        dayList = this.getDates(1, e).slice(0, 7)
      } else if (Number(val[1]) == (now.getMonth() + 1)) {
        this.setData({date: e.detail.value})
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
      this.setData({date: e.detail.value})
      dayList = this.getDates(1, e).slice(0, 7)
    } else{
      wx.showToast({
        title: '请选择当前往后的时间！',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    this.getStaffListTime(dayList)
    if(i==1){
      this.setData({
        maskShow: true
      })
    }
  },
  //选择日
  selectDay(e) {
    let item = e.currentTarget.dataset.item
    if(!item.available){
      wx.showToast({title:'今日不可约！',icon: 'none'})
      return false
    }
    let val = this.data.date.split('-')
    let params = {
      day: val[0] + val[1] + item.day,
      counterCode: this.data.storeList[this.data.storeIndex].counterCode,
      serviceCode: this.data.serverList[this.data.severIndex].serviceCode,
      staffCode: this.data.staffList[this.data.staffIndex].staffCode
    }
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.OrderStaffList, params,'get').then(res=>{
      wx.hideLoading()
      let list = []
      if (res.ret_code == 0){
        res.data.list.forEach(item=>{
          list.push({
            timeFrom: item.timeFrom,
            timeTo: item.timeTo
          })
        })
        this.setData({
          day: val[0] + val[1] + item.day,
          date: val[0] + '-' + val[1] + '-' + item.day,
          timeList: list
        })
      }else{
        wx.showToast({title: res.err_msg,icon: 'none'})
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
    currentList = list.slice(n-7,n)
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
    list.forEach((item,i)=>{
      if (item.day == lastDay){ n = i}
    })
    currentList = list.slice(n + 1, n + 8)
    console.log(currentList)
    for (var i = currentList.length; i < 7; i++) {
      currentList.push({ day: '-', available: false})
    }
    this.getStaffListTime(currentList)
  },
  getDates(val,e) {//获取当月天数列表
    let selectDate = e.detail.value.split('-'),
        curDate = new Date(),
        curDay = curDate.getDate(),
        n = new Date(selectDate[0], selectDate[1], 0).getDate(),
        curMonth = curDate.getMonth(),
        dayList = [];
    console.log(n, curDay)
    if (val==0){
      for (var i = curDay; i <= n; i++) {
        if(i<10){i = '0'+i}
        dayList.push({ day: i, available: false})
      }
      if (dayList.length<7){
        for (var j = 0; j <= (7 - dayList.length); i++) {
          dayList.push({ day: '-', available: false })
        }
      }
    }else{
      for (var i = 1; i <= n; i++) {
        if (i < 10) {i = '0' + i}
        dayList.push({ day: i, available: false })
      }
    }
    this.setData({initDaylist: dayList})
    return dayList
  },
  getStaffListTime (daylist) {
    let val = this.data.date.split('-'),
        list = daylist.filter(item => item.day != '-')
    let params = {
      startDay: val[0] + val[1] + list[0].day,
      endDay: val[0] + val[1] + list[list.length-1].day,
      counterCode: this.data.storeList[this.data.storeIndex].counterCode,
      serviceCode: this.data.serverList[this.data.severIndex].serviceCode,
      staffCode: this.data.staffList[this.data.staffIndex].staffCode
    }
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.IsServiceTImeList, params,'get').then(res=>{
      if (res.ret_code == 0){
        daylist.forEach(item=>{
          res.data.list.forEach(_item=>{
            if (item.day == Number(_item.day.substring(6, 8))){
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
  formSubmit(e) {
    if (this.data.storeIndex == null || this.data.severIndex == null || this.data.staffIndex == null || this.data.name=='' || this.data.phone=='' || this.data.region==''){
      wx.showToast({title: '请填写所有表单数据！',icon:'none'})
      return false
    }
    let params = {
      memberId: wx.getStorageSync('userId'),
    　name: this.data.name,
      mobile: this.data.phone, 
      city: this.data.region,  
      counterCode: this.data.storeList[this.data.storeIndex].counterCode,
      channelCode: this.data.channelList[this.data.channelIndex].channelCode,
      serviceCode: this.data.serverList[this.data.severIndex].serviceCode,
      staffCode: this.data.staffList[this.data.staffIndex].staffCode,
      staffName: this.data.staffList[this.data.staffIndex].staffName,
      smsCode: this.data.smsCode,
      serviceDate: this.data.day,
      timeFrom: this.data.timeFrom + ':00', 
      timeTo: this.data.timeTo + ':00',
    }
    if (this.data.bookId) {
      this.updata(params)
    } else {
      this.save(params)
    }
  },
  save(params) {
    let memberType = wx.getStorageSync('memberType')
    wx.showLoading({ title: '保存中', mask: true })
    util.request(api.ServiceSave, params, 'post').then(res => {
      wx.hideLoading()
      if (res.ret_code == 0) {
        wx.showModal({
          content: '预约服务保存成功！',
          showCancel: false,
          confirmColor: '#eea0ae',
          success(res) {
            if (res.confirm) {
              if (memberType == 0){
                wx.navigateTo({ url: '/pages/register/register' })
              } else if (memberType == 1){
                wx.switchTab({ url: '/pages/myOrdered/myOrdered' })
              }
            }
          }
        })
      } else {
        wx.showToast({ title: res.err_msg, icon: 'none' })
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  updata(params) {
    params.bookId = this.data.bookId
    wx.showLoading({ title: '更新中', mask: true })
    util.request(api.ServiceUpdate, params, 'post').then(res => {
      wx.hideLoading()
      if (res.ret_code == 0) {
        wx.showModal({
          content: '预约服务更新成功！',
          showCancel: false,
          confirmColor: '#eea0ae',
          success(res) {
            if (res.confirm) {
              wx.switchTab({ url: '/pages/myOrdered/myOrdered' })
            }
          }
        })
      } else {
        wx.showToast({ title: res.err_msg, icon: 'none' })
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  //报错 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
      confirmColor: '#eea0ae',
    })
  },
  submit(e) {
    console.log(this.data.day)
    if (this.data.day == '' || this.data.currentIndex == null) {
      this.showModal({msg:'请选择预约日期或时间！'})
    } else {
      this.setData({
        maskShow: false,
        date: this.data.date + ' ' + this.data.timeFrom + '-' + this.data.timeTo
      })
    }
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
      title: '眉吧服务预约',
      path: 'pages/index/index',
      imageUrl: '/static/images/share.jpg'
    }
  }
})