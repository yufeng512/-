// var NewApiRootUrl = 'http://3c1c5513bf327385.natapp.cc/benefit_xcx/api/';//开发接口
// var ImgUrl = 'http://3c1c5513bf327385.natapp.cc/benefit_xcx/statics/images/';//静态资源
var NewApiRootUrl = 'https://booking.benefitbrows.cn/benefit_xcx/api/';//生产接口
var ImgUrl = 'https://booking.benefitbrows.cn/benefit_xcx/statics/images/';//生产静态资源

module.exports = {
  BaseUrl: NewApiRootUrl,//域名地址(完成)
  ImgUrl: ImgUrl,//域名地址(完成)
  AuthLoginByWeixin: NewApiRootUrl + 'auth/login_by_weixin', //微信登录(完成)
  SendCode: NewApiRootUrl + "sms/sendCode", //发送验证码(完成)
  SmsCode: NewApiRootUrl + "system/smsCode/", //发送预约服务验证码(完成)
  CheckCode: NewApiRootUrl + "member/checkCode", //一键注册
  SaveInfo: NewApiRootUrl + "member/save", //保存个人信息
  BookList: NewApiRootUrl + "booking/bookingList",//获取预约服务列表
  ServiceJudge: NewApiRootUrl + "booking/judge",//服务评价
  ServiceSave: NewApiRootUrl + "booking/save",//服务预约保存
  ServiceUpdate: NewApiRootUrl + "booking/update",//服务预约更新
  ChannelList: NewApiRootUrl + "system/channelList",//获取门店渠道
  StoreList: NewApiRootUrl + "system/counterList",//门店列表
  ServiceList: NewApiRootUrl + "system/serviceList",//服务列表
  StaffList: NewApiRootUrl + "system/staffList",//美容师列表
  IsServiceTImeList: NewApiRootUrl + "system/staffAvailableTimeSlotByRange",//美容师可选服务时间列表
  OrderStaffList: NewApiRootUrl + "system/staffAvailableTimeSlot",//预约美容师列表
  // member: NewApiRootUrl + "system/token/{memberId}",//获取会员 api token
  SearchBook: NewApiRootUrl + "booking/booking/",//获取会员 api token
  LastBook: NewApiRootUrl + "booking/lastBooking",//获取上次预约的地址
  SurveyQuestionList: NewApiRootUrl + "system/surveyQuestionList",//问卷调查
};