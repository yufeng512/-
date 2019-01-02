const util = require('../../utils/util.js')
const api = require('../../config/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    counterName: '',
    counterPhone: '',
    counterAddress: '',
    time: '',
    bookId: '',
    imgUrl: '',
    markers: [],
    latitude: '',
    longitude: '',
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  submit () {
    
  },
  getStoreList() {
    let params = {
      serviceCode: this.data.serviceCode,
      city: this.data.city
    }
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.StoreList, params, 'get').then(res => {
      console.log(res)
      wx.hideLoading()
      if (res.ret_code == 0) {
        res.data.list.forEach((item, i) => {
          if (item.counterCode == this.data.counterCode) {
            console.log(item)
            this.setData({
              counterName: item.counterName,
              counterAddress: item.address1,
              counterPhone: item.phone,
              latitude: item.latitude,
              longitude: item.longitude,
              markers: [{
                latitude: item.latitude,
                longitude: item.longitude,
                callout: {
                  content: item.counterName,
                  color: '#333333',
                  fontSize: 12,
                  borderRadius: 2,
                  padding: 5,
                  display: 'ALWAYS',
                }
              }]
            })
          }
        })
      }
      console.log(this.data)
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  getBookList(options) {
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.SearchBook + options.bookId, {}, 'get').then(res => {
      console.log(res)
      wx.hideLoading()
      if (res.ret_code == 0) {
        this.setData({
          serviceCode: res.data.serviceCode,
          counterCode: res.data.counterCode,
          city: res.data.city,
          time: res.data.bookTime
        })
        this.getStoreList()
        this.getServiceList(res.data.serviceCode)
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  getServiceList(serviceCode) {
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.ServiceList, {}, 'get').then(res => {
      wx.hideLoading()
      if (res.ret_code == 0) {
        let list = res.data.list
        list.forEach((item, i) => {
          if (item.serviceCode == '602020057413') {
            this.setData({
              imgUrl: api.ImgUrl + '128.gif'
            })
          } else if (item.serviceCode == '602020057415'){
            this.setData({
              imgUrl: api.ImgUrl + '168.gif'
            })
          } else if (item.serviceCode =='602020057417'){
            this.setData({
              imgUrl: api.ImgUrl + '208.gif'
            })
          }
        })
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getBookList(options)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('111111111111111111')
    this.mapCtx = wx.createMapContext('myMap')
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