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
    imgUrl: api.ImgUrl,
    markers: [{
      iconPath: '',
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: '#FF0000DD',
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '',
      position: {
        left: 0,
        top: 300 - 100,
        width: 50,
        height: 50
      },
      clickable: true
    }]
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
              counterPhone: item.phone
            })
          }
        })
      }
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
    this.getdd()
    this.getBookList(options)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('111111111111111111')
    
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

  }
})