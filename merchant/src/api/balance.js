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
  },
  getWithdraw(data){
    return request({
      url: '/withdraw/page',
      method: 'get',
      params: {
        phone: data.phone,
        cur: data.cur,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status
      }
    })
  }
}
