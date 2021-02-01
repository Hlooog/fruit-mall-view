import request from '@/utils/request'

export default {
  getLinkUser(){
    return request({
      url: '/chat/link/get',
      method: 'get',
    })
  },
  gerRecord(phone,cur){
    return request({
      url: '/chat/record/get',
      method: 'get',
      params: {
        phone: phone,
        cur: cur
      }
    })
  }
}
