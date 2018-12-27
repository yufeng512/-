const util = require('../../utils/util.js')
var api = require('../../config/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: api.ImgUrl,
    statusBtn:[{text: '待完成',status: 0},{text: '已完成',status: 1}],
    current: 1,
    list: []
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  selectStatus (e) {
    let index = e.currentTarget.dataset.status
    this.setData({
      current: index
    })
    let params = {
      bookingStatus: index
    }
    this.bookingList(params)
  },
  bookingList (params) {
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.BookList, params, 'get').then(res => {
      wx.hideLoading()
      if (res.ret_code == 0) {
        this.setData({
          list: res.data.list
        })
      }
    }).catch(err=>{
      console.log(err)
      wx.hideLoading()
    })
  },
  goDetails(e){
    console.log(e)
    let bookId = e.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: '/pages/orderDetails/orderDetails?bookId='+bookId,
    })
  },
  goEvaluate (e) {
    let id = e.currentTarget.dataset.id;
    if (this.data.current == 1) {
      wx.navigateTo({
        url: '/pages/evaluate/evaluate?bookId=' +id
      })
    } else {
      wx.navigateTo({
        url: '/pages/orederInfo/orederInfo?bookId=' + id
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let params = {
      bookingStatus: 1
    }
    this.bookingList(params)
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

  }
})