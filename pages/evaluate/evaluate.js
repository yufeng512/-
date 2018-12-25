const util = require('../../utils/util.js')
var api = require('../../config/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: api.ImgUrl,
    judgeService: '',
    judgeStaff: '',
    bookId: '',
    evaluateList:[
      {
        problem: '您对本次修眉服务是否满意？', 
        options: [
          { name: '满意', value: '1' },
          { name: '一般', value: '2'},
          { name: '不满意', value: '3' }
        ]
      },
      {
        problem: '您对美容师A是否满意？', 
        options: [
          { name: '满意', value: '1' },
          { name: '一般', value: '2' },
          { name: '不满意', value: '3' }
        ]
      }
    ]
  },
  radioChange (e) {
    console.log(e)
    let i = e.currentTarget.dataset.index,
        val = e.detail.value;
    if(i == 0){
      this.setData({
        judgeService: val
      })
    }else{
      this.setData({
        judgeStaff: val
      })
    }
  },
  submit () {
    let params = {
      bookId: this.data.bookId,
      judgeService: this.data.judgeService.toString(),
      judgeStaff: this.data.judgeStaff.toString()
    }
    wx.showLoading({ title: '加载中', mask: true })
    util.request(api.ServiceJudge, params, 'post').then(res => {
      wx.hideLoading()
      if (res.ret_code == 0) {
        wx.showModal({
          content: '服务评价成功！',
          showCancel: false,
          confirmColor: '#fe697f',
          success(res) {
            if (res.confirm) {
              wx.switchTab({ url: '/pages/myOrdered/myOrdered' })
            }
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
    this.setData({
      bookId: options.bookId
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

  }
})