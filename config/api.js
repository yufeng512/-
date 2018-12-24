var NewApiRootUrl = 'http://172.23.21.60:8888/benefit_xcx/api/';//开发接口
var ImgUrl = 'http://172.23.21.60:8888/benefit_xcx/statics/images/';//静态资源

module.exports = {
  BaseUrl: NewApiRootUrl,//域名地址(完成)
  ImgUrl: ImgUrl,//域名地址(完成)
  AuthLoginByWeixin: NewApiRootUrl + 'auth/login_by_weixin', //微信登录(完成)
  SendCode: NewApiRootUrl + "sms/sendCode", //发送验证码(完成)
  CheckCode: NewApiRootUrl + "member/checkCode", //一键注册
  SaveInfo: NewApiRootUrl + "member/save", //保存个人信息
  BookList: NewApiRootUrl + "booking/bookingList",//获取预约服务列表
  ServiceJudge: NewApiRootUrl + "booking/judge",//服务评价
  ServiceSave: NewApiRootUrl + "booking/save",//服务预约保存
  ServiceUpdate: NewApiRootUrl + "booking/update",//服务预约更新
  StoreList: NewApiRootUrl + "system/counterList",//门店列表
  ServiceList: NewApiRootUrl + "system/serviceList",//服务列表
  StaffList: NewApiRootUrl + "system/staffList",//美容师列表
  IsServiceTImeList: NewApiRootUrl + "system/staffAvailableTimeSlotByRange",//美容师可选服务时间列表
  OrderStaffList: NewApiRootUrl + "system/staffAvailableTimeSlot",//预约美容师列表
  // member: NewApiRootUrl + "system/token/{memberId}",//获取会员 api token
  SearchBook: NewApiRootUrl + "booking/booking/",//获取会员 api token
};