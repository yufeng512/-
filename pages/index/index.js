// pages/index/index.js
const user = require('../../services/user.js');
const util = require('../../utils/util.js')
const api = require('../../config/api.js')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgList: [api.ImgUrl + '128.png', api.ImgUrl + '168.png', api.ImgUrl+'208.png'],
    defaultBorder: api.ImgUrl+'border.png',
    imgUrl: api.ImgUrl,
    serverList: [],
    severIndex: 0,
    show: false,
    imgShow: false
  },
  bindServeChange (e) {
    let index = e.detail.value,imgName = ''
    this.setData({
      severIndex: e.detail.value,
      bgGif: imgName
    })
  },
  goOrderInfo () {
    let serviceCode = this.data.serverList[this.data.severIndex].serviceCode,
        severIndex = this.data.severIndex,
        self = this,
        imgName = '';
    if (severIndex == 0) {
      imgName = api.ImgUrl + '128.gif'
    } else if (severIndex == 1) {
      imgName = api.ImgUrl + '168.gif'
    } else if (severIndex == 2) {
      imgName = api.ImgUrl + '208.gif'
    }
    this.setData({
      defaultBorder: api.ImgUrl+'border-gif.gif'
    })
    if (serviceCode){
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/orederInfo/orederInfo?serviceCode=' + serviceCode,
        })
        self.setData({
          defaultBorder: api.ImgUrl + 'border.png',
        })
      }, 2000) 
    }else{
      wx.showToast({
        title: '请选择服务项目！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  getData () {
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.ServiceList, {}, 'get').then(res => {
      wx.hideLoading()
      console.log('index res', res)
      if (res.ret_code == 0) {
        this.setData({
          serverList: res.data.list,
          show: true
        })
      }
    }).catch(err=>{
      console.log('index err',err)
      wx.hideLoading()
    })
  },
  bindSwiperChange (e) {
    this.setData({
      severIndex: e.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getData()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    user.checkLogin().then(res => {
      if (res) {
        this.getData()
      }else{
        user.loginByWeixin().then(res=>{
          console.log('index res', res)
        }).catch(err=>{
          console.log('index cotch')
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {

  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '眉吧服务预约',
      imageUrl: ''
    }
  }
})