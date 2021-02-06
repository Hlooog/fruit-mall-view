import request from '@/utils/request'

export default {
  getInfo(id){
    return request({
      url: '/shop/getInfo/' + id,
      method: 'get'
    })
  },
  CreateOrUpdate(data){
    return request({
      url: '/shop/createOrUpdate',
      method: 'post',
      data: data
    })
  },
  close(data){
    return request({
      url: '/shop/close',
      method: 'put',
      data: data
    })
  },
  sendMsg(phone){
    return request({
      url: '/sms/close/send',
      method: 'get',
      params: {
        phone: phone
      }
    })
  }
}
