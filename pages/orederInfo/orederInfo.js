const util = require('../../utils/util.js')
const api = require('../../config/api.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
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
    name: '',
    phone: '',
    region: '选择城市',
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
    // 城市选择弹框
    pickerInfo: {
      'state': false,
      'title': '选择城市',
      'value': [0, 0],
      'submits': ['取消', '确定'],
    },

    // 省列表
    provinceList: [
      {
        provinceName: '北京市',
        cityList: [{ cityID: 1, cityName: '北京市' }]
      },
      {
        provinceName: '天津市',
        cityList: [{ cityID: 1, cityName: '天津市' }]
      },
      {
        provinceName: '上海市',
        cityList: [{ cityID: 1, cityName: '上海市' }]
      },
      {
        provinceName: '重庆市',
        cityList: [{ cityID: 1, cityName: '重庆市' }]
      },
      {
        provinceName: '江苏',
        cityList: [{ cityID: 1, cityName: '苏州市' }, { cityID: 1, cityName: '无锡市' }, { cityID: 1, cityName: '泰州市' }, { cityID: 1, cityName: '常州市' }, { cityID: 1, cityName: '南京市' }, { cityID: 1, cityName: '南通市' }]
      },
      {
        provinceName: '安徽',
        cityList: [{ cityID: 1, cityName: '合肥市' }, { cityID: 1, cityName: '芜湖市' }]
      },
      {
        provinceName: '湖南',
        cityList: [{ cityID: 1, cityName: '长沙市' }, { cityID: 1, cityName: '株洲市' }]
      },
      {
        provinceName: '湖北',
        cityList: [{ cityID: 1, cityName: '武汉市' }]
      },
      {
        provinceName: '山西',
        cityList: [{ cityID: 1, cityName: '太原市' }]
      },
      {
        provinceName: '山东',
        cityList: [{ cityID: 1, cityName: '济南市' }, { cityID: 1, cityName: '青岛市' }, { cityID: 1, cityName: '潍坊市' }, { cityID: 1, cityName: '淄博市' }]
      },
      {
        provinceName: '广西',
        cityList: [{ cityID: 1, cityName: '南宁市' }]
      },
      {
        provinceName: '广东',
        cityList: [{ cityID: 1, cityName: '广州市' }, { cityID: 1, cityName: '东莞市' }, { cityID: 1, cityName: '深圳市' }, { cityID: 1, cityName: '佛山市' }, { cityID: 1, cityName: '珠海市' }]
      },
      {
        provinceName: '河北',
        cityList: [{ cityID: 1, cityName: '石家庄市' }, { cityID: 1, cityName: '保定市' }, { cityID: 1, cityName: '廊坊市' }, { cityID: 1, cityName: '唐山市' }, { cityID: 1, cityName: '珠海市' }]
      },
      {
        provinceName: '河南',
        cityList: [{ cityID: 1, cityName: '郑州市' }]
      },
      {
        provinceName: '宁夏',
        cityList: [{ cityID: 1, cityName: '银川市' }]
      },
      {
        provinceName: '新疆',
        cityList: [{ cityID: 1, cityName: '乌鲁木齐市' }]
      },
      {
        provinceName: '青海',
        cityList: [{ cityID: 1, cityName: '西宁市' }]
      },
      {
        provinceName: '辽宁',
        cityList: [{ cityID: 1, cityName: '大连市' }, { cityID: 1, cityName: '沈阳市' }]
      },
      {
        provinceName: '内蒙古',
        cityList: [{ cityID: 1, cityName: '呼和浩特' }]
      },
      {
        provinceName: '甘肃',
        cityList: [{ cityID: 1, cityName: '兰州市' }]
      },
      {
        provinceName: '浙江',
        cityList: [{ cityID: 1, cityName: '宁波市' }]
      },
      {
        provinceName: '陕西',
        cityList: [{ cityID: 1, cityName: '西安市' }]
      },
      {
        provinceName: '四川',
        cityList: [{ cityID: 1, cityName: '成都市' }, { cityID: 1, cityName: '泸州市' }, { cityID: 1, cityName: '绵阳市' }]
      },
      {
        provinceName: '黑龙江',
        cityList: [{ cityID: 1, cityName: '大庆市' }, { cityID: 1, cityName: '哈尔滨市' }]
      },
      {
        provinceName: '江西',
        cityList: [{ cityID: 1, cityName: '南昌市' }]
      },
      {
        provinceName: '云南',
        cityList: [{ cityID: 1, cityName: '昆明市' }]
      },
      {
        provinceName: '福建',
        cityList: [{ cityID: 1, cityName: '福州市' }, { cityID: 1, cityName: '泉州市' }]
      },
      {
        provinceName: '贵州',
        cityList: [{ cityID: 1, cityName: '贵阳市' }]
      }
    ],
    //市列表
    cityList: [
      [{ cityID: 1, cityName: '北京市' }],
      [{ cityID: 1, cityName: '天津市' }],
      [{ cityID: 1, cityName: '上海市' }],
      [{ cityID: 1, cityName: '重庆市' }],
      [{ cityID: 1, cityName: '苏州市' }, { cityID: 1, cityName: '无锡市' }, { cityID: 1, cityName: '泰州市' }, { cityID: 1, cityName: '常州市' }, { cityID: 1, cityName: '南京市' }, { cityID: 1, cityName: '南通市' }],
      [{ cityID: 1, cityName: '合肥市' }, { cityID: 1, cityName: '芜湖市' }],
      [{ cityID: 1, cityName: '长沙市' }, { cityID: 1, cityName: '株洲市' }],
      [{ cityID: 1, cityName: '武汉市' }],
      [{ cityID: 1, cityName: '太原市' }],
      [{ cityID: 1, cityName: '济南市' }, { cityID: 1, cityName: '青岛市' }, { cityID: 1, cityName: '潍坊市' }, { cityID: 1, cityName: '淄博市' }],
      [{ cityID: 1, cityName: '南宁市' }],
      [{ cityID: 1, cityName: '广州市' }, { cityID: 1, cityName: '东莞市' }, { cityID: 1, cityName: '深圳市' }, { cityID: 1, cityName: '佛山市' }, { cityID: 1, cityName: '珠海市' }],
      [{ cityID: 1, cityName: '石家庄市' }, { cityID: 1, cityName: '保定市' }, { cityID: 1, cityName: '廊坊市' }, { cityID: 1, cityName: '唐山市' }, { cityID: 1, cityName: '珠海市' }],
      [{ cityID: 1, cityName: '郑州市' }],
      [{ cityID: 1, cityName: '银川市' }],
      [{ cityID: 1, cityName: '乌鲁木齐市' }],
      [{ cityID: 1, cityName: '西宁市' }],
      [{ cityID: 1, cityName: '大连市' }, { cityID: 1, cityName: '沈阳市' }],
      [{ cityID: 1, cityName: '呼和浩特' }],
      [{ cityID: 1, cityName: '兰州市' }],
      [{ cityID: 1, cityName: '宁波市' }],
      [{ cityID: 1, cityName: '西安市' }],
      [{ cityID: 1, cityName: '成都市' }, { cityID: 1, cityName: '泸州市' }, { cityID: 1, cityName: '绵阳市' }],
      [{ cityID: 1, cityName: '大庆市' }, { cityID: 1, cityName: '哈尔滨市' }],
      [{ cityID: 1, cityName: '南昌市' }],
      [{ cityID: 1, cityName: '昆明市' }],
      [{ cityID: 1, cityName: '福州市' }, { cityID: 1, cityName: '泉州市' }],
      [{ cityID: 1, cityName: '贵阳市' }]
    ]
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
        this.setData({
          channelList: res.data.list
        })
      }
    })
  },
  getStoreList() {
    let index = this.data.severIndex,list = [];
    let params = {
      serviceCode: this.data.serverList[index].serviceCode,
      city: this.data.region,
      counterChannel: this.data.channelList[this.data.channelIndex].channelCode,
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
            storeAddress: item.counterName + ' 距离您' + item.distance +'KM',
            counterName: item.counterName,
            counterCode: item.counterCode
          })
        })
        this.setData({
          storeList: list
        })
      }
    }).catch(err => { 
      console.log(err) 
      wx.hideLoading()
    })
  },
  getStaffList(staffCode, serviceCode, counterCode) {
    let params = {
      serviceCode: this.data.serverList[this.data.severIndex].serviceCode,
      counterCode: this.data.storeList[this.data.storeIndex].counterCode
    }
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.StaffList, params, 'get').then(res => {
      console.log(res)
      wx.hideLoading()
      if (res.ret_code == 0) {
        this.setData({
          staffList: res.data.list
        })
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
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  getLastAddress () {
    let params = {
      latitude: this.data.latitude,
      longitude: this.data.longitude
    }
    util.request(api.CurrentCity, params, 'get').then(res=>{
      console.log(res)
      if (res.ret_code == 0) {
        this.setData({
          region: res.data.list.cityName
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    qqmapsdk = new QQMapWX({
      key: '24EBZ-MMPLU-7PBVE-4J3D7-CKQQ2-TOFTJ' //自己的key秘钥 http://lbs.qq.com/console/mykey.html 在这个网址申请
    });
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
        self.getLastAddress()
        // self.getLocal(latitude, longitude)
      }
    })
  },
  // 获取当前地理位置
  getLocal (latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        console.log('-------------------', JSON.stringify(res));
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        vm.setData({
          region: city
        })

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  bindServeChange (e) {
    if (this.data.severIndex != e.detail.value){
      this.setData({
        severIndex: e.detail.value,
        region: '选择城市',
        storeList: [],
        staffList: [],
        storeIndex: null,
        channelIndex: null,
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
    let index = this.data.staffIndex == 0 ? 1 : this.data.staffIndex,
    counterCode =  this.data.storeList[this.data.storeIndex].counterCode,
    serviceCode = this.data.serverList[this.data.severIndex].serviceCode,
    staffCode = this.data.staffList[index].staffCode
    console.log(e)
    this.setData({
      date: e.detail.value
    })
    wx.navigateTo({
      url: '/pages/selectDate/selectDate?date=' + e.detail.value + '&counterCode=' + counterCode + '&serviceCode=' + serviceCode + '&staffCode=' + staffCode,
    })
  },
  formSubmit(e) {
    if (this.data.smsCode == ''){
      this.showModal({ msg:'请输入验证码'})
      return false
    }
    if (this.data.storeIndex == null || this.data.severIndex == null || this.data.staffIndex == null || this.data.name=='' || this.data.phone=='' || this.data.region==''){
      wx.showToast({ title: '请填写完整预约信息',icon:'none'})
      return false
    }
    let index = this.data.staffIndex == 0 ? 1 : this.data.staffIndex
    let params = {
      memberId: wx.getStorageSync('userId'),
    　name: this.data.name,
      mobile: this.data.phone, 
      city: this.data.region,  
      counterCode: this.data.storeList[this.data.storeIndex].counterCode,
      channelCode: this.data.channelList[this.data.channelIndex].channelCode,
      serviceCode: this.data.serverList[this.data.severIndex].serviceCode,
      staffCode: this.data.staffList[index].staffCode,
      staffName: this.data.staffList[index].staffName,
      smsCode: this.data.smsCode,
      serviceDate: this.data.day,
      timeFrom: this.data.timeFrom + ':00', 
      timeTo: this.data.timeTo + ':00',
      formId: e.detail.formId,
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
      } else if (res.err_code == 5001){
        wx.showToast({ title: res.err_msg, icon: 'none' })
        this.setData({
          showCode:true
        })
      }
      else {
        wx.showToast({ title: '请选择其他可预约时间段', icon: 'none' })
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
        wx.showToast({ title: '请选择其他可预约时间段', icon: 'none' })
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
  updateLocationInfo(event) {
    console.log(event)
    var that = this
    var title = event.currentTarget.dataset.title
    var pickerInfo = that.data.pickerInfo


    // 判断是否是button
    if (title == 'state') {
      pickerInfo.state = true
      pickerInfo.value = [0, 0]
      pickerInfo.citys = this.data.cityList[0]
      that.setData({
        pickerInfo: pickerInfo
      });

      //此处应该请求网络数据，为了方便我写了一些数据进行测试，获取省列表
      var provinceList = that.data.provinceList;
      pickerInfo.provinces = provinceList;

      that.setData({
        pickerInfo: pickerInfo
      });

    } else if (title == 'cancel') {
      pickerInfo.state = false
      that.setData({
        pickerInfo: pickerInfo
      })
    } else {
      // 设置选择结果
      pickerInfo.state = false;

      var region = that.data.region

      var cityNum = pickerInfo.value[1]
      var cityInfo = pickerInfo.citys[cityNum]
      region = cityInfo.cityName
      if (this.data.region != region) {
        that.setData({
          storeList: [],
          staffList: [],
          channelIndex: null,
          storeIndex: null,
          staffIndex: null,
          date: ''
        })
      }
      that.setData({
        pickerInfo: pickerInfo,
        region: region,
      });

      // that.getCountyList();此处可以继续模仿选择区域

    }

  },
  //选择城市，通过bindchange和省ID获取城市列表
  updatePicker(event) {
    console.log(event)
    var that = this;
    var pickerInfo = that.data.pickerInfo;
    var num = event.detail.value[0];
    var cityNum = event.detail.value[1];

    // var requestInfo = {};
    // 此处根据省ID通过网络获取城市列表，这里我用本地数据代替
    // requestInfo.provinceID = pickerInfo.provinces[num].provinceID;
    var cityList = that.data.cityList;
    pickerInfo.citys = cityList[num];
    pickerInfo.value = [num, cityNum];

    that.setData({
      pickerInfo: pickerInfo
    });

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