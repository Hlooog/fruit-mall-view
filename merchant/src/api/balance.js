import request from '@/utils/request'

export default {
  get() {
    return request({
      url: '/balance/get',
      method: 'get'
    })
  },
  withdraw(data) {
    return request({
      url: '/balance/withdraw',
      method: 'post',
      data: data
    })
  },
  sendMsg(phone) {
    return request({
      url: '/sms/send',
      method: 'get',
      params: {
        phone: phone
      }
    })
  }
}
