const util = require('../../utils/util.js')
var api = require('../../config/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: api.ImgUrl,
    judgeList: [],
    bookId: '',
    evaluateList:[]
  },
  radioChange (e) {
    let params = {
          questionId: e.currentTarget.dataset.id.toString(),
          questionAnswer: e.detail.value
        },
        judgeList = this.data.judgeList
    console.log(params)
    if (judgeList && judgeList.length>0){
      judgeList.forEach(item=>{
        console.log(item.questionId, params.questionId)
        if (item.questionId == params.questionId){
          item.questionAnswer = params.questionAnswer
        }
      })    
    }
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  getQuestionList () {
    let list = [], judgeList =[]
    util.request(api.SurveyQuestionList,{},'get').then(res=>{
      console.log(res)
      if(res.ret_code == 0) {
        res.data.list.forEach(item=>{
          list.push({
            id: item.id,
            questionDesc: item.questionDesc,
            questionOption: JSON.parse(item.questionOption),
          })
          judgeList.push({
            questionId: item.id.toString(),
            questionAnswer: ''
          })
        })
        this.setData({
          evaluateList: list,
          judgeList: judgeList
        })
      }
    })
  },
  submit () {
    let judgeList = this.data.judgeList,
        params = {},
        isCheck = judgeList.every(item=> item.questionAnswer != '')
    // this.data.bookId,
    if (isCheck){
      params.bookId = this.data.bookId,
      params.survey = JSON.stringify(judgeList) 
      wx.showLoading({ title: '加载中', mask: true })
      util.request(api.ServiceJudge, params, 'post','application/x-www-form-urlencoded').then(res => {
        wx.hideLoading()
        if (res.ret_code == 0) {
          wx.showModal({
            content: '问卷已提交，感谢！',
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
    }else{
      wx.showToast({
        title: '还有问卷尚未全部答完！',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      bookId: options.bookId
    })
    this.getQuestionList()
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